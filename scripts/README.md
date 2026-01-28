# 部署和管理脚本

本目录包含用于部署和管理 Creator Economy 平台的脚本。

## 前置要求

1. **安装依赖**：
```bash
npm install
```

2. **启动 Solana 本地验证器**（仅本地开发）：
```bash
solana-test-validator
```

3. **确保钱包已配置**：
```bash
# 查看当前钱包地址
solana address

# 如果没有钱包，创建一个
solana-keygen new

# 获取测试 SOL（本地或 devnet）
solana airdrop 2
```

## 环境变量（可选）

脚本会使用以下默认值，如果需要可以通过环境变量覆盖：

### `ANCHOR_PROVIDER_URL`
Solana RPC 节点地址
- **默认值**: `http://localhost:8899`（本地验证器）
- **Devnet**: `https://api.devnet.solana.com`
- **Mainnet**: `https://api.mainnet-beta.solana.com`

### `ANCHOR_WALLET`
钱包密钥文件路径
- **默认值**: `~/.config/solana/id.json`

## 使用方法

### 1. 初始化平台

初始化平台配置（只需运行一次）：

```bash
# 使用默认配置（本地网络）
npx ts-node scripts/initialize-platform.ts

# 或者指定网络和钱包
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
ANCHOR_WALLET=~/.config/solana/devnet.json \
npx ts-node scripts/initialize-platform.ts
```

**平台配置参数**（在脚本中可修改）：
- `earlySupporterLimit`: 早期支持者人数上限（默认：10）
- `earlySupporterRate`: 早期支持者分成比例（默认：10% = 1000/10000）
- `platformFeeRate`: 平台手续费比例（默认：2% = 200/10000）

### 2. 不同网络的部署

#### 本地网络（Localhost）
```bash
# 1. 启动本地验证器
solana-test-validator

# 2. 在另一个终端运行脚本
npx ts-node scripts/initialize-platform.ts
```

#### Devnet
```bash
# 1. 切换到 devnet
solana config set --url devnet

# 2. 获取测试 SOL
solana airdrop 2

# 3. 运行脚本
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com \
npx ts-node scripts/initialize-platform.ts
```

#### Mainnet（生产环境）⚠️
```bash
# 确保你有足够的 SOL 用于部署
solana balance

# 运行脚本
ANCHOR_PROVIDER_URL=https://api.mainnet-beta.solana.com \
ANCHOR_WALLET=/path/to/your/mainnet/wallet.json \
npx ts-node scripts/initialize-platform.ts
```

## 脚本说明

### `initialize-platform.ts`
初始化平台全局配置，包括：
- 设置平台管理员
- 配置早期支持者机制
- 设置平台手续费率

该脚本只需在部署时运行一次。

## 故障排除

### 错误：`Error: failed to send transaction`
- 确保本地验证器正在运行（`solana-test-validator`）
- 检查钱包是否有足够的 SOL（`solana balance`）
- 确保网络连接正常

### 错误：`账户已存在`
- 平台已经初始化过了，不需要再次运行初始化脚本
- 如果需要重新部署，请先清理本地验证器数据

### 错误：`无法读取钱包文件`
- 检查钱包文件是否存在：`ls ~/.config/solana/id.json`
- 或通过 `ANCHOR_WALLET` 环境变量指定正确的钱包路径

## 查看部署结果

```bash
# 查看程序账户
solana account 7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx

# 查看平台 PDA 账户
# PDA 地址会在脚本运行时显示
solana account <PLATFORM_PDA_ADDRESS>
```

## 下一步

部署完成后，您可以：
1. 在前端应用中使用该程序
2. 创建创作者资料
3. 发布内容
4. 接受打赏

详见主 README.md 和 DEPLOYMENT_GUIDE.md。

