<div align="center">

# 🚀 Creator Economy

### 基于 Solana 的星际创作者经济平台
**一个将 Web3 经济模型与赛博朋克美学完美融合的去中心化内容平台**

[在线链接](https://creatoreconomy.vercel.app/) 

</div>

---

## ✨ 项目亮点

### 🌌 独特的太空科技主题 UI
- **霓虹发光效果** - 青色/紫色/粉色的赛博朋克配色
- **玻璃态设计** - 现代化的 Glass Morphism 视觉效果
- **动态背景** - 星空、扫描线、粒子光球等科幻动画
- **沉浸式体验** - 完整的太空主题贯穿整个应用

### 💎 创新的早期支持者机制
> 改变内容经济的游戏规则

```
前 10 个打赏用户 → 成为早期支持者 → 获得永久 10% 分成
```

**为什么这很重要？**
- 🔍 **激励发现** - 用户主动寻找优质内容
- 💰 **持续收益** - 早期支持者与创作者共同成长
- 📈 **价值认同** - 好内容会自然获得推广
- 🤝 **社区驱动** - 形成创作者-支持者共赢生态

### ⚡ Solana 原生优势
- **超低费用** - 交易成本 < $0.001，微支付友好
- **即时确认** - 亚秒级交易确认
- **高性能** - 支持高频打赏场景
- **链上存储** - 所有数据永久保存在链上

---

## 🎯 核心功能

<table>
<tr>
<td width="50%">

### 🎨 创作者功能
- ✍️ 发布内容到链上
- 📊 实时收益追踪
- 👥 查看早期支持者
- 💰 自动收益分配
- 📈 数据统计看板

</td>
<td width="50%">

### 👤 用户功能
- 🔍 探索优质内容
- 💎 成为早期支持者
- 💸 打赏创作者
- 📊 收益实时到账
- 🎯 个人收益追踪

</td>
</tr>
</table>

---

## 💰 经济模型

### 打赏金额分配

#### 📌 阶段 1：前 10 个打赏（早期支持者招募）
```
用户打赏 1 SOL
├─ 平台费 (2%)     → 0.02 SOL
└─ 创作者 (98%)    → 0.98 SOL
   └─ 用户成为早期支持者 ⭐
```

#### 📌 阶段 2：第 11+ 个打赏（分成机制启动）
```
用户打赏 1 SOL
├─ 平台费 (2%)          → 0.02 SOL
├─ 早期支持者 (10%)     → 0.10 SOL (每人 0.01 SOL)
└─ 创作者 (88%)         → 0.88 SOL
```

### 💡 收益举例

**创作者视角：**
- 发布一篇文章，获得 100 次打赏（每次 0.1 SOL）
- 前 10 次：收入 0.98 SOL
- 后 90 次：收入 7.92 SOL（每次 0.088 SOL）
- **总收入：8.9 SOL** 💰

**早期支持者视角：**
- 第 5 个打赏该文章（0.1 SOL）
- 后续 90 次打赏，每次获得 0.001 SOL
- **总收益：0.09 SOL（90% 被动收益！）** 📈

---

## 🛠️ 技术架构

### 📦 技术栈

#### 智能合约
```rust
Anchor 0.32.1          // Solana 开发框架
Rust 1.89              // 系统编程语言
Solana 1.18+           // 区块链平台
```

#### 前端应用
```typescript
Next.js 15             // React 框架
TypeScript 5.3         // 类型安全
Tailwind CSS 3.4       // 样式框架
@solana/wallet-adapter // 钱包集成
@tanstack/react-query  // 数据管理
```

---

## 🚀 快速开始

### 前置要求

确保你已安装以下工具：

```bash
# Rust & Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.32.1
avm use 0.32.1

# Node.js & Yarn
# 访问 https://nodejs.org/ 下载 Node.js 18+
npm install -g yarn
```

### 安装步骤

#### 1️⃣ 克隆项目
```bash
git clone https://github.com/your-username/creator-economy.git
cd creator-economy
```

#### 2️⃣ 安装依赖
```bash
# 安装前端依赖
cd app
yarn install

# 返回根目录
cd ..
```

#### 3️⃣ 构建智能合约
```bash
# 构建 Anchor 程序
anchor build

# 运行测试
anchor test
```

#### 4️⃣ 部署到 Devnet
```bash
# 配置 Solana 到 Devnet
solana config set --url devnet

# 创建钱包（如果需要）
solana-keygen new --outfile ~/.config/solana/id.json

# 获取空投
solana airdrop 2

# 部署程序
anchor deploy

# 记录程序 ID 并更新配置
# 更新 app/lib/anchor/idl.ts 中的 PROGRAM_ID
```

#### 5️⃣ 初始化平台
```bash
# 运行初始化脚本
ts-node scripts/initialize-platform.ts
```

#### 6️⃣ 启动前端
```bash
cd app
yarn dev
```

访问 `http://localhost:3000` 开始体验！🎉

---

## 📖 详细文档

### 智能合约 API

#### `initialize_platform`
初始化平台配置（仅限管理员，仅需执行一次）

```typescript
await program.methods
  .initializePlatform(
    10,    // 早期支持者人数上限
    1000,  // 早期支持者分成比例 (10% = 1000/10000)
    200    // 平台手续费率 (2% = 200/10000)
  )
  .accounts({
    authority: adminPublicKey,
    platform: platformPDA,
    platformTreasury: treasuryPublicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

#### `create_creator_profile`
创建创作者资料

```typescript
await program.methods
  .createCreatorProfile()
  .accounts({
    creator: creatorPublicKey,
    creatorProfile: creatorProfilePDA,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

#### `publish_content`
发布内容

```typescript
await program.methods
  .publishContent(
    "我的第一篇文章",           // 标题 (最长 100 字符)
    "这是一篇关于 Solana 的文章..." // 描述 (最长 500 字符)
  )
  .accounts({
    creator: creatorPublicKey,
    creatorProfile: creatorProfilePDA,
    content: contentPDA,
    platform: platformPDA,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

#### `tip_content`
打赏内容

```typescript
const tipAmount = new BN(0.1 * LAMPORTS_PER_SOL); // 0.1 SOL

await program.methods
  .tipContent(tipAmount)
  .accounts({
    tipper: tipperPublicKey,
    creator: creatorPublicKey,
    content: contentPDA,
    creatorProfile: creatorProfilePDA,
    platform: platformPDA,
    platformTreasury: treasuryPublicKey,
    systemProgram: SystemProgram.programId,
  })
  .remainingAccounts(earlySupporterAccounts) // 早期支持者账户
  .rpc();
```

### 数据结构

#### Platform（平台配置）
```rust
pub struct Platform {
    pub authority: Pubkey,           // 管理员地址
    pub total_content_count: u64,    // 内容总数
    pub early_supporter_limit: u8,   // 早期支持者人数限制
    pub early_supporter_rate: u16,   // 早期支持者分成比例
    pub platform_fee_rate: u16,      // 平台手续费率
    pub bump: u8,                    // PDA bump
}
```

#### Content（内容）
```rust
pub struct Content {
    pub content_id: u64,              // 内容 ID
    pub creator: Pubkey,              // 创作者地址
    pub title: String,                // 标题
    pub description: String,          // 描述
    pub total_tips: u64,              // 累计打赏金额
    pub tip_count: u32,               // 打赏次数
    pub early_supporters: Vec<Pubkey>, // 早期支持者列表
    pub created_at: i64,              // 创建时间
    pub bump: u8,                     // PDA bump
}
```

---

## 🧪 测试

### 运行测试套件

```bash
# 运行所有测试
anchor test

# 跳过部署运行测试
anchor test --skip-deploy

# 显示详细日志
RUST_LOG=debug anchor test
```

### 测试覆盖

- ✅ 平台初始化
- ✅ 创作者资料创建
- ✅ 内容发布
- ✅ 打赏功能（早期支持者阶段）
- ✅ 打赏功能（分成机制）
- ✅ 边界条件测试
- ✅ 错误处理测试

---

## 🔒 安全特性

### 智能合约安全

- ✅ **溢出保护** - 所有数学运算使用 `checked_*` 方法
- ✅ **账户验证** - 使用 Anchor 的约束系统
- ✅ **输入验证** - 严格的参数校验
- ✅ **权限控制** - 基于角色的访问控制
- ✅ **防重入** - Solana 架构天然防重入
- ✅ **审计** - 代码经过多轮安全审查

### 前端安全

- ✅ **类型安全** - TypeScript 严格模式
- ✅ **钱包集成** - 官方 Solana Wallet Adapter
- ✅ **XSS 防护** - React 自动转义
- ✅ **HTTPS** - 强制加密传输

---

## 🌐 部署信息

### Devnet 部署

- **Network**: Solana Devnet
- **Program ID**: `7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx`
- **RPC Endpoint**: `https://api.devnet.solana.com`
- **Explorer**: [View on Solscan](https://solscan.io/account/7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx?cluster=devnet)

### Mainnet 部署

> 🚧 即将上线... 敬请期待