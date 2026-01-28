# 部署指南

## 快速部署步骤

### 1. 环境准备

确保已安装：
- Rust 1.70+
- Solana CLI 1.18+
- Anchor 0.32+
- Node.js 18+
- Yarn

### 2. 部署链上程序

```bash
# 配置 Solana CLI 到 Devnet
solana config set --url devnet

# 创建或使用现有钱包
solana-keygen new -o ~/.config/solana/id.json  # 如果没有钱包
# 或
solana config set --keypair ~/.config/solana/id.json  # 如果已有钱包

# 查看钱包地址
solana address

# 空投 SOL（测试用）
solana airdrop 2

# 进入项目目录
cd /home/coder/solana

# 构建程序
anchor build

# 部署到 Devnet
anchor deploy

# 记录输出的 Program ID
# 示例输出: Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

### 3. 更新配置

部署后，需要更新以下文件中的 Program ID：

1. **Anchor.toml**:
```toml
[programs.devnet]
creator_economy = "你的实际 Program ID"
```

2. **app/lib/utils/constants.ts**:
```typescript
export const PROGRAM_ID = new PublicKey("你的实际 Program ID");
```

### 4. 初始化平台

创建初始化脚本 `scripts/initialize-platform.ts`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CreatorEconomy as Program;

  // 派生 Platform PDA
  const [platformPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );

  console.log("初始化平台...");
  console.log("Platform PDA:", platformPDA.toBase58());

  try {
    const tx = await program.methods
      .initializePlatform(
        10,   // early_supporter_limit
        1000, // early_supporter_rate (10%)
        200   // platform_fee_rate (2%)
      )
      .accounts({
        authority: provider.wallet.publicKey,
        platform: platformPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("平台初始化成功！");
    console.log("交易签名:", tx);
  } catch (error: any) {
    if (error.message.includes("already in use")) {
      console.log("平台已初始化");
    } else {
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

运行初始化：
```bash
ts-node scripts/initialize-platform.ts
```

### 5. 运行测试（可选但推荐）

```bash
# 在 Devnet 上运行测试
anchor test --skip-local-validator
```

### 6. 部署前端

#### 本地开发

```bash
cd app

# 安装依赖
yarn install
# 或
npm install

# 启动开发服务器
yarn dev
# 或
npm run dev

# 访问 http://localhost:3000
```

#### 部署到 Vercel

```bash
# 1. 安装 Vercel CLI（如果还没有）
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
cd app
vercel

# 4. 配置环境变量（在 Vercel Dashboard）
# NEXT_PUBLIC_PROGRAM_ID=你的Program ID
# NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
# NEXT_PUBLIC_PLATFORM_TREASURY=你的钱包地址

# 5. 生产部署
vercel --prod
```

或者通过 Vercel Dashboard：
1. 连接 GitHub 仓库
2. 选择 `app` 目录作为根目录
3. 设置环境变量
4. 点击 Deploy

### 7. 验证部署

1. **链上程序验证**:
```bash
solana program show <PROGRAM_ID>
```

2. **前端验证**:
   - 访问部署的 URL
   - 连接 Phantom 钱包（确保切换到 Devnet）
   - 尝试发布一条内容
   - 尝试打赏内容

### 8. 空投测试 SOL

如果需要测试，空投 SOL 到钱包：

```bash
# 使用 Solana CLI
solana airdrop 2

# 或使用 Phantom 钱包内置的空投功能（Devnet）
```

## 故障排除

### 问题 1: 部署失败 "Insufficient funds"

**解决方案**: 空投更多 SOL
```bash
solana airdrop 2
# 多次执行直到余额足够（通常需要 3-4 SOL）
```

### 问题 2: "Program already exists"

**解决方案**: 这是正常的，程序已部署。如果需要重新部署：
```bash
anchor upgrade <PROGRAM_DEPLOY_PATH> --program-id <PROGRAM_ID>
```

### 问题 3: 前端连接失败 "Failed to fetch"

**解决方案**:
1. 检查 RPC 端点是否正确
2. 尝试使用其他 RPC（如 Helius、QuickNode）
3. 确保 Program ID 正确

### 问题 4: "Wallet not connected"

**解决方案**:
1. 确保 Phantom 钱包已安装
2. 切换到 Devnet 网络
3. 刷新页面

## 监控和维护

### 查看程序日志

```bash
solana logs <PROGRAM_ID>
```

### 查看账户余额

```bash
solana balance
```

### 查看平台状态

创建查询脚本：
```typescript
const platform = await program.account.platform.fetch(platformPDA);
console.log("内容总数:", platform.totalContentCount.toNumber());
console.log("早期支持者上限:", platform.earlySupporterLimit);
```

## 成本估算（Devnet 免费）

- **程序部署**: ~2 SOL（Devnet 通过空投免费）
- **平台初始化**: ~0.005 SOL
- **每个 Content 账户**: ~0.007 SOL（由创作者支付）
- **每次交易**: ~0.000005 SOL

## 下一步

1. ✅ 测试所有功能
2. ✅ 邀请用户测试
3. ⚠️ 代码审计（生产环境必需）
4. ⚠️ 部署到 Mainnet（需要真实 SOL）
5. 📈 监控和优化

## 联系支持

如有问题，请查看：
- [Solana 文档](https://docs.solana.com/)
- [Anchor 书](https://book.anchor-lang.com/)
- [Solana Stack Exchange](https://solana.stackexchange.com/)

---

祝部署顺利！🚀
