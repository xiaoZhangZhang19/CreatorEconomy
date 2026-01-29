use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

mod constants;
mod errors;
mod state;

use constants::*;
use errors::*;
use state::*;

declare_id!("7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx");

#[program]
pub mod creator_economy {
    use super::*;

    /// 初始化平台配置（仅平台管理员调用一次）
    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        early_supporter_limit: u8,
        early_supporter_rate: u16,
        platform_fee_rate: u16,
    ) -> Result<()> {
        // 验证费率配置合理性
        require!(
            early_supporter_rate < RATE_DENOMINATOR as u16,
            CreatorEconomyError::InvalidFeeRate
        );
        require!(
            platform_fee_rate < RATE_DENOMINATOR as u16,
            CreatorEconomyError::InvalidFeeRate
        );
        require!(
            (early_supporter_rate as u64 + platform_fee_rate as u64) < RATE_DENOMINATOR,
            CreatorEconomyError::InvalidFeeRate
        );

        let platform: &mut Account<'_, Platform> = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.total_content_count = 0;
        platform.early_supporter_limit = early_supporter_limit;
        platform.early_supporter_rate = early_supporter_rate;
        platform.platform_fee_rate = platform_fee_rate;
        platform.bump = ctx.bumps.platform;

        msg!("平台初始化成功！");
        msg!("管理员: {}", platform.authority);
        msg!("早期支持者上限: {}", platform.early_supporter_limit);
        msg!("早期支持者分成: {}%", early_supporter_rate as f64 / 100.0);
        msg!("平台手续费: {}%", platform_fee_rate as f64 / 100.0);

        Ok(())
    }

    /// 创建创作者资料
    pub fn create_creator_profile(ctx: Context<CreateCreatorProfile>) -> Result<()> {
        let creator_profile = &mut ctx.accounts.creator_profile;
        creator_profile.creator = ctx.accounts.creator.key();
        creator_profile.content_count = 0;
        creator_profile.total_earnings = 0;
        creator_profile.created_at = Clock::get()?.unix_timestamp;
        creator_profile.bump = ctx.bumps.creator_profile;

        msg!("创作者资料创建成功: {}", creator_profile.creator);

        Ok(())
    }

    /// 发布内容
    pub fn publish_content(
        ctx: Context<PublishContent>,
        title: String,
        description: String,
    ) -> Result<()> {
        // 验证标题和描述长度
        require!(
            title.len() <= MAX_TITLE_LENGTH,
            CreatorEconomyError::TitleTooLong
        );
        require!(
            description.len() <= MAX_DESCRIPTION_LENGTH,
            CreatorEconomyError::DescriptionTooLong
        );

        let platform = &mut ctx.accounts.platform;
        let creator_profile = &mut ctx.accounts.creator_profile;
        let content = &mut ctx.accounts.content;

        // 获取新的 content_id
        let content_id = platform.total_content_count;

        // 初始化内容账户
        content.content_id = content_id;
        content.creator = ctx.accounts.creator.key();
        content.title = title;
        content.description = description;
        content.total_tips = 0;
        content.tip_count = 0;
        content.early_supporters = Vec::new();
        content.created_at = Clock::get()?.unix_timestamp;
        content.bump = ctx.bumps.content;

        // 更新统计
        platform.total_content_count = platform
            .total_content_count
            .checked_add(1)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;
        creator_profile.content_count = creator_profile
            .content_count
            .checked_add(1)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;

        msg!("内容发布成功！");
        msg!("内容 ID: {}", content.content_id);
        msg!("标题: {}", content.title);
        msg!("创作者: {}", content.creator);

        Ok(())
    }

    /// 打赏内容（核心逻辑，包含早期支持者分成机制）
    pub fn tip_content<'info>(ctx: Context<'_, '_, '_, 'info, TipContent<'info>>, amount: u64) -> Result<()> {
        // 1. 验证打赏金额
        require!(
            amount >= MIN_TIP_AMOUNT,
            CreatorEconomyError::TipTooSmall
        );

        // 2. 验证不能打赏自己的内容
        require!(
            ctx.accounts.tipper.key() != ctx.accounts.creator.key(),
            CreatorEconomyError::CannotTipSelf
        );

        let platform = &ctx.accounts.platform;
        let content = &mut ctx.accounts.content;
        let creator_profile = &mut ctx.accounts.creator_profile;

        // 3. 检查是否成为早期支持者
        let is_early_supporter =
            content.early_supporters.len() < platform.early_supporter_limit as usize;

        if is_early_supporter {
            // 添加到早期支持者列表
            content.early_supporters.push(ctx.accounts.tipper.key());
            msg!(
                "新增早期支持者: {} (第 {} 个)",
                ctx.accounts.tipper.key(),
                content.early_supporters.len()
            );
        }

        // 4. 计算金额分配
        let platform_fee = amount
            .checked_mul(platform.platform_fee_rate as u64)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?
            .checked_div(RATE_DENOMINATOR)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;

        // 只有早期支持者满额后才开始分成
        let supporter_pool = if content.early_supporters.len() > platform.early_supporter_limit as usize {
            amount
                .checked_mul(platform.early_supporter_rate as u64)
                .ok_or(CreatorEconomyError::ArithmeticOverflow)?
                .checked_div(RATE_DENOMINATOR)
                .ok_or(CreatorEconomyError::ArithmeticOverflow)?
        } else {
            0
        };

        let creator_amount = amount
            .checked_sub(platform_fee)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?
            .checked_sub(supporter_pool)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;

        msg!("金额分配:");
        msg!("  总额: {} lamports", amount);
        msg!("  平台费: {} lamports", platform_fee);
        msg!("  创作者: {} lamports", creator_amount);
        msg!("  早期支持者池: {} lamports", supporter_pool);

        // 5. 执行转账 - 平台手续费
        if platform_fee > 0 {
            transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.tipper.to_account_info(),
                        to: ctx.accounts.platform_treasury.to_account_info(),
                    },
                ),
                platform_fee,
            )?;
        }

        // 6. 执行转账 - 创作者收益
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.tipper.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            ),
            creator_amount,
        )?;

        // 7. 分配早期支持者收益（如果有）
        if supporter_pool > 0 && !content.early_supporters.is_empty() {
            let per_supporter = supporter_pool
                .checked_div(content.early_supporters.len() as u64)
                .ok_or(CreatorEconomyError::ArithmeticOverflow)?;

            msg!(
                "分配给 {} 个早期支持者，每人 {} lamports",
                content.early_supporters.len(),
                per_supporter
            );

            // 注：通过 remaining_accounts 传入每个支持者的钱包账户
            // 必须验证传入的账户是否与 early_supporters 列表中的地址一一对应
            // 这样可以防止恶意用户传入错误的账户地址窃取资金

            for (index, supporter_account) in ctx.remaining_accounts.iter().enumerate() {
                if index < content.early_supporters.len() {
                    // 验证1：传入的账户地址必须与早期支持者列表中的地址匹配
                    let expected_supporter = content.early_supporters[index];
                    require!(
                        supporter_account.key() == expected_supporter,
                        CreatorEconomyError::InvalidSupporterAccount
                    );

                    // 验证2：账户必须可写（否则无法接收转账）
                    require!(
                        supporter_account.is_writable, 
                        CreatorEconomyError::AccountNotWritable
                    );

                    // 执行转账到早期支持者
                    transfer(
                        CpiContext::new(
                            ctx.accounts.system_program.to_account_info(),
                            Transfer {
                                from: ctx.accounts.tipper.to_account_info(),
                                to: supporter_account.clone(),
                            },
                        ),
                        per_supporter,
                    )?;

                    msg!("已转账 {} lamports 给支持者 {}", per_supporter, expected_supporter);
                }
            }
        }

        // 8. 更新统计数据
        content.total_tips = content
            .total_tips
            .checked_add(amount)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;
        content.tip_count = content
            .tip_count
            .checked_add(1)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;
        creator_profile.total_earnings = creator_profile
            .total_earnings
            .checked_add(creator_amount)
            .ok_or(CreatorEconomyError::ArithmeticOverflow)?;

        msg!("打赏成功！");
        msg!("内容累计打赏: {} lamports", content.total_tips);
        msg!("打赏次数: {}", content.tip_count);

        Ok(())
    }
}

// ===== 账户验证结构 =====

/// 初始化平台
#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = Platform::LEN,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,

    pub system_program: Program<'info, System>,
}

/// 创建创作者资料
#[derive(Accounts)]
pub struct CreateCreatorProfile<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = CreatorProfile::LEN,
        seeds = [b"creator", creator.key().as_ref()],
        bump
    )]
    pub creator_profile: Account<'info, CreatorProfile>,

    pub system_program: Program<'info, System>,
}

/// 发布内容
#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct PublishContent<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"creator", creator.key().as_ref()],
        bump = creator_profile.bump,
        has_one = creator
    )]
    pub creator_profile: Account<'info, CreatorProfile>,

    #[account(
        init,
        payer = creator,
        space = Content::space(
            title.len(),
            description.len(),
            platform.early_supporter_limit as usize
        ),
        seeds = [b"content", platform.total_content_count.to_le_bytes().as_ref()],
        bump
    )]
    pub content: Account<'info, Content>,

    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    pub system_program: Program<'info, System>,
}

/// 打赏内容
#[derive(Accounts)]
pub struct TipContent<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    /// CHECK: 创作者账户，接收打赏
    #[account(mut)]
    pub creator: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"content", content.content_id.to_le_bytes().as_ref()],
        bump = content.bump,
        has_one = creator
    )]
    pub content: Account<'info, Content>,

    #[account(
        mut,
        seeds = [b"creator", creator.key().as_ref()],
        bump = creator_profile.bump
    )]
    pub creator_profile: Account<'info, CreatorProfile>,

    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    /// CHECK: 平台金库，接收手续费
    #[account(mut)]
    pub platform_treasury: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    // remaining_accounts: 早期支持者的钱包账户（用于接收分成）
}
