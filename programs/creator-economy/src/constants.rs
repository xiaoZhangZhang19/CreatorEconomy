// 常量配置

// 内容限制
pub const MAX_TITLE_LENGTH: usize = 100;
pub const MAX_DESCRIPTION_LENGTH: usize = 500;

// 打赏限制
pub const MIN_TIP_AMOUNT: u64 = 1_000_000; // 0.001 SOL

// 早期支持者配置（默认值，保留供将来使用）
#[allow(dead_code)]
pub const DEFAULT_EARLY_SUPPORTER_LIMIT: u8 = 10;
#[allow(dead_code)]
pub const DEFAULT_EARLY_SUPPORTER_RATE: u16 = 1000; // 10% = 1000 / 10000
#[allow(dead_code)]
pub const DEFAULT_PLATFORM_FEE_RATE: u16 = 200;     // 2% = 200 / 10000

// 基数用于百分比计算
pub const RATE_DENOMINATOR: u64 = 10000;
