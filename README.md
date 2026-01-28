# Creator Economy - 创作者经济平台

基于 Solana + Anchor 的去中心化创作者经济平台，核心特色是**早期支持者分成机制**。

## 🌟 核心创新

### 早期支持者激励
- 前 10 个打赏用户成为"早期支持者"
- 从第 11 个打赏开始，每次打赏的 10% 会平均分给前 10 个早期支持者
- 激励用户发现和支持优质内容

### Solana 优势
- 交易费用 < $0.001
- 高频微支付友好
- 亚秒级确认

## 📦 项目结构

```
creator-economy/
├── programs/                    # Anchor 智能合约
│   └── creator-economy/
│       └── src/
│           ├── lib.rs          # 主程序和指令
│           ├── state.rs        # 账户结构
│           ├── errors.rs       # 错误定义
│           └── constants.rs    # 常量配置
├── tests/                       # 测试
│   └── creator-economy.ts
├── app/                         # Next.js 前端
└── Anchor.toml                  # Anchor 配置
```

## 🚀 快速开始

### 前置要求

- Rust 1.70+
- Solana CLI 1.18+
- Anchor 0.32+
- Node.js 18+
- Yarn

### 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd creator-economy

# 安装依赖
yarn install

# 构建程序
anchor build

# 运行测试
anchor test
```

### 部署到 Devnet

```bash
# 配置 Solana CLI 到 Devnet
solana config set --url devnet

# 创建钱包（如果还没有）
solana-keygen new

# 空投 SOL
solana airdrop 2

# 部署程序
anchor deploy

# 初始化平台（首次部署后）
# 创建 scripts/initialize-platform.ts 并运行
```

## 📖 核心功能

### 1. 平台初始化
管理员调用一次，设置平台参数：
- 早期支持者人数上限（默认 10）
- 早期支持者分成比例（默认 10%）
- 平台手续费率（默认 2%）

### 2. 创建创作者资料
用户首次发布内容时自动创建，记录创作者的统计信息。

### 3. 发布内容
创作者发布新内容：
- 标题（最长 100 字符）
- 描述（最长 500 字符）
- 纯链上存储

### 4. 打赏内容
用户打赏创作者：
- 最低 0.001 SOL
- 自动分配：创作者 + 平台 + 早期支持者
- 前 10 个打赏用户成为早期支持者

## 💰 金额分配示例

### 场景 1：前 10 个打赏（早期支持者阶段）
用户 A 打赏 0.1 SOL：
- 平台费：0.002 SOL (2%)
- 创作者：0.098 SOL (98%)
- 用户 A 成为第 1 个早期支持者

### 场景 2：第 11 个打赏（开始分成）
用户 K 打赏 1 SOL：
- 平台费：0.02 SOL (2%)
- 早期支持者分成：0.1 SOL (10%)，每人 0.01 SOL
- 创作者：0.88 SOL (88%)

## 🧪 测试

```bash
# 运行所有测试
anchor test

# 运行单个测试
anchor test --skip-deploy

# 查看详细日志
anchor test -- --features=debug
```

测试覆盖：
- ✅ 平台初始化
- ✅ 创建创作者资料
- ✅ 发布内容
- ✅ 打赏（早期支持者）
- ✅ 打赏（分成机制）
- ✅ 错误处理（金额过小、自己打赏自己）

## 📝 账户结构

### Platform（平台配置）
```rust
pub struct Platform {
    pub authority: Pubkey,              // 32 bytes
    pub total_content_count: u64,       // 8 bytes
    pub early_supporter_limit: u8,      // 1 byte
    pub early_supporter_rate: u16,      // 2 bytes
    pub platform_fee_rate: u16,         // 2 bytes
    pub bump: u8,                       // 1 byte
}
// 总计：~56 bytes
```

### Content（内容）
```rust
pub struct Content {
    pub content_id: u64,                // 8 bytes
    pub creator: Pubkey,                // 32 bytes
    pub title: String,                  // 4 + 100 bytes
    pub description: String,            // 4 + 500 bytes
    pub total_tips: u64,                // 8 bytes
    pub tip_count: u32,                 // 4 bytes
    pub early_supporters: Vec<Pubkey>,  // 4 + 32*10 bytes
    pub created_at: i64,                // 8 bytes
    pub bump: u8,                       // 1 byte
}
// 总计：~1000 bytes (租金 ~0.007 SOL)
```

## 🛠️ 技术栈

- **链上**: Anchor 0.32, Rust 1.89
- **前端**: Next.js 14, React 18, TypeScript
- **钱包**: @solana/wallet-adapter
- **UI**: Tailwind CSS + shadcn/ui
- **测试**: Mocha + Chai

## 🔒 安全性

- ✅ 所有金额计算使用 `checked_add/sub/mul/div` 防止溢出
- ✅ 账户验证使用 Anchor 的 `has_one` 和 `constraint`
- ✅ 输入验证（标题/描述长度，最低打赏金额）
- ✅ 防止创作者打赏自己的内容

## 🌐 部署信息

- **Network**: Solana Devnet
- **Program ID**: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- **RPC**: Devnet 公共 RPC

## 📚 API 文档

### 指令

#### initialize_platform
初始化平台配置（仅管理员）

```typescript
await program.methods
  .initializePlatform(
    10,    // early_supporter_limit
    1000,  // early_supporter_rate (10%)
    200    // platform_fee_rate (2%)
  )
  .accounts({...})
  .rpc();
```

#### create_creator_profile
创建创作者资料

```typescript
await program.methods
  .createCreatorProfile()
  .accounts({...})
  .rpc();
```

#### publish_content
发布内容

```typescript
await program.methods
  .publishContent(
    "文章标题",
    "文章描述..."
  )
  .accounts({...})
  .rpc();
```

#### tip_content
打赏内容

```typescript
await program.methods
  .tipContent(new BN(0.01 * LAMPORTS_PER_SOL))
  .accounts({...})
  .remainingAccounts([...earlySupporterAccounts])
  .rpc();
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT

## 🎉 黑客松

这个项目是为 Solana 黑客松开发的，专注于消费与娱乐应用赛道。

## 👥 团队

- 开发者：[Your Name]
- 联系方式：[Your Email]

## 🔗 相关链接

- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)

---

**注意**: 这是一个 Devnet 项目，不要在 Mainnet 上使用未经审计的代码！
