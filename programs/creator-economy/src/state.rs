use anchor_lang::prelude::*;

/// 平台配置账户（全局单例）
/// PDA Seeds: [b"platform"]
#[account]
pub struct Platform {
    /// 平台管理员地址
    pub authority: Pubkey,
    /// 内容总数（用于生成递增的 content_id）
    pub total_content_count: u64,
    /// 早期支持者人数上限（例如 10）
    pub early_supporter_limit: u8,
    /// 早期支持者分成比例（例如 1000 = 10%）
    pub early_supporter_rate: u16,
    /// 平台手续费率（例如 200 = 2%）
    pub platform_fee_rate: u16,
    /// PDA bump seed
    pub bump: u8,
}

impl Platform {
    /// 计算账户所需空间
    pub const LEN: usize = 8    // discriminator
        + 32   // authority
        + 8    // total_content_count
        + 1    // early_supporter_limit
        + 2    // early_supporter_rate
        + 2    // platform_fee_rate
        + 1;   // bump
}

/// 创作者个人资料账户
/// PDA Seeds: [b"creator", creator.key()]
#[account]
pub struct CreatorProfile {
    /// 创作者钱包地址
    pub creator: Pubkey,
    /// 发布的内容数量
    pub content_count: u32,
    /// 累计收益（lamports）
    pub total_earnings: u64,
    /// 创建时间戳
    pub created_at: i64,
    /// PDA bump seed
    pub bump: u8,
}

impl CreatorProfile {
    /// 计算账户所需空间
    pub const LEN: usize = 8    // discriminator
        + 32   // creator
        + 4    // content_count
        + 8    // total_earnings
        + 8    // created_at
        + 1;   // bump
}

/// 内容账户
/// PDA Seeds: [b"content", content_id.to_le_bytes()]
#[account]
pub struct Content {
    /// 内容唯一 ID
    pub content_id: u64,
    /// 创作者地址
    pub creator: Pubkey,
    /// 标题（最长 100 字符）
    pub title: String,
    /// 描述（最长 500 字符）
    pub description: String,
    /// 累计打赏金额（lamports）
    pub total_tips: u64,
    /// 打赏次数
    pub tip_count: u32,
    /// 早期支持者列表（最多 10 个）
    pub early_supporters: Vec<Pubkey>,
    /// 发布时间戳
    pub created_at: i64,
    /// PDA bump seed
    pub bump: u8,
}

impl Content {
    /// 根据标题和描述长度计算账户所需空间
    pub fn space(title_len: usize, description_len: usize, max_supporters: usize) -> usize {
        8       // discriminator
        + 8     // content_id
        + 32    // creator
        + 4 + title_len // title (String = 4 bytes len + data)
        + 4 + description_len // description
        + 8     // total_tips
        + 4     // tip_count
        + 4 + (32 * max_supporters) // early_supporters (Vec = 4 bytes len + data)
        + 8     // created_at
        + 1     // bump
    }
}

/// 支持者收益账户
/// PDA Seeds: [b"earnings", content_id.to_le_bytes(), supporter.key()]
#[account]
pub struct SupporterEarnings {
    /// 支持者钱包地址
    pub supporter: Pubkey,
    /// 关联的内容 ID
    pub content_id: u64,
    /// 累计收益（lamports）
    pub total_earned: u64,
    /// 是否已提取收益
    pub is_claimed: bool,
    /// PDA bump seed
    pub bump: u8,
}

impl SupporterEarnings {
    /// 计算账户所需空间（保留供将来使用）
    #[allow(dead_code)]
    pub const LEN: usize = 8    // discriminator
        + 32   // supporter
        + 8    // content_id
        + 8    // total_earned
        + 1    // is_claimed
        + 1;   // bump
}
