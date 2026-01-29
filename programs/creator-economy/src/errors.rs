use anchor_lang::prelude::*;

// 自定义错误代码
#[error_code]
pub enum CreatorEconomyError {
    #[msg("标题过长（最长 100 字符）")]
    TitleTooLong,

    #[msg("描述过长（最长 500 字符）")]
    DescriptionTooLong,

    #[msg("打赏金额过小（最低 0.001 SOL）")]
    TipTooSmall,

    #[msg("不能打赏自己的内容")]
    CannotTipSelf,

    #[msg("早期支持者名额已满")]
    EarlySupporterSlotsFull,

    #[msg("数值计算溢出")]
    ArithmeticOverflow,

    #[msg("无效的费率配置")]
    InvalidFeeRate,

    #[msg("无效的支持者账户")]
    InvalidSupporterAccount,

    #[msg("账户不可写")]
    AccountNotWritable,
}
