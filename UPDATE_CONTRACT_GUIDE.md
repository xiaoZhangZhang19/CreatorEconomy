# Anchor 合约更新部署指南

## 🔄 完整更新流程

当你修改了 Anchor 合约（`programs/creator-economy/src/*.rs`）后，需要按以下步骤操作：

### 1️⃣ 构建合约

```bash
# 在项目根目录（/Users/kiro/Documents/item/ce）执行
anchor build
```

这会：
- 编译 Rust 程序
- 生成 `.so` 文件到 `target/deploy/`
- 生成 IDL 文件到 `target/idl/`

### 2️⃣ 部署到 Devnet

```bash
# 确保配置正确
solana config get

# 应该显示：
# - RPC URL: https://api.devnet.solana.com
# - Keypair Path: ~/.config/solana/id.json

# 部署程序
anchor deploy
```

**注意事项：**
- 如果是首次部署，会生成新的 Program ID
- 如果是更新现有程序，确保你有该程序的 upgrade authority

### 3️⃣ 更新 Program ID（如果是新部署）

如果是首次部署或生成了新的 Program ID：

```bash
# 部署后会显示 Program ID，例如：
# Program Id: 7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx

# 1. 更新 Anchor.toml
# [programs.devnet]
# creator_economy = "新的Program ID"

# 2. 更新 lib.rs
# declare_id!("新的Program ID");

# 3. 更新前端常量
# app/lib/utils/constants.ts
# export const PROGRAM_ID = new PublicKey("新的Program ID");
```

### 4️⃣ 复制 IDL 到前端

```bash
# 从 target/idl/ 复制到前端
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
```

### 5️⃣ 重新初始化平台（如果需要）

如果合约结构有重大变化（如添加/修改账户字段），需要重新初始化：

```bash
# 运行初始化脚本
npm run initialize
# 或
ts-node scripts/initialize-platform.ts
```

### 6️⃣ 重启前端开发服务器

```bash
cd app
yarn dev
```

---

## 🚀 快速更新脚本（推荐）

创建一个更新脚本 `scripts/update-and-deploy.sh`：

```bash
#!/bin/bash
set -e

echo "🔨 构建合约..."
anchor build

echo "📦 部署到 devnet..."
anchor deploy

echo "📋 复制 IDL 到前端..."
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json

echo "✅ 更新完成！"
echo ""
echo "⚠️  注意："
echo "1. 如果是新部署，请更新 Program ID"
echo "2. 如果账户结构改变，需要重新初始化平台"
echo "3. 重启前端开发服务器"
```

使用：
```bash
chmod +x scripts/update-and-deploy.sh
./scripts/update-and-deploy.sh
```

---

## 🔍 常见场景

### 场景 1: 只修改了指令逻辑（不改账户结构）

```bash
anchor build
anchor deploy
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
# 重启前端即可
```

### 场景 2: 修改了账户结构

```bash
anchor build
anchor deploy
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
npm run initialize  # 重新初始化平台
# 重启前端
```

### 场景 3: 完全重新部署

```bash
# 1. 生成新的 program keypair
solana-keygen new -o target/deploy/creator_economy-keypair.json

# 2. 更新 Anchor.toml 中的 Program ID
# 从 target/deploy/creator_economy-keypair.json 读取公钥

# 3. 更新 lib.rs 中的 declare_id!
# declare_id!("新的Program ID");

# 4. 重新构建和部署
anchor build
anchor deploy

# 5. 更新前端
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
# 更新 app/lib/utils/constants.ts 中的 PROGRAM_ID

# 6. 初始化
npm run initialize
```

---

## ⚠️ 重要注意事项

### 1. 账户数据兼容性
- 如果修改了账户结构（添加/删除/修改字段），旧账户数据会不兼容
- 需要重新创建所有账户或编写迁移脚本

### 2. Program ID 管理
- 开发阶段：每次重新部署可以用新的 Program ID
- 生产阶段：应该使用 `anchor upgrade` 而不是重新部署

### 3. 升级权限
```bash
# 查看程序的升级权限
solana program show 7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx

# 转移升级权限
solana program set-upgrade-authority <PROGRAM_ID> --new-upgrade-authority <NEW_AUTHORITY>
```

### 4. 成本考虑
- 部署需要 SOL（在 devnet 可以免费领取）
- 大型程序可能需要较多 SOL

```bash
# 领取 devnet SOL
solana airdrop 2
```

---

## 📝 检查清单

更新合约后的验证步骤：

- [ ] `anchor build` 成功编译
- [ ] `anchor deploy` 成功部署
- [ ] IDL 文件已复制到前端
- [ ] Program ID 在前端已更新（如果改变）
- [ ] 平台已重新初始化（如果需要）
- [ ] 前端开发服务器已重启
- [ ] 可以成功连接钱包
- [ ] 可以调用新的合约功能

---

## 🛠️ 故障排除

### 问题 1: `anchor build` 失败

```bash
# 清理并重建
anchor clean
anchor build
```

### 问题 2: 部署失败 - 余额不足

```bash
# 检查余额
solana balance

# 领取 devnet SOL
solana airdrop 2
```

### 问题 3: 前端无法找到程序

- 检查 `app/lib/utils/constants.ts` 中的 `PROGRAM_ID` 是否正确
- 检查 RPC 端点配置是否正确
- 检查 IDL 文件是否是最新的

### 问题 4: 账户反序列化失败

- 说明账户结构已改变
- 需要重新创建账户或运行迁移脚本
- 在 devnet 上可以直接重新初始化

---

## 📚 相关命令参考

```bash
# 查看当前配置
solana config get

# 切换到 devnet
solana config set --url https://api.devnet.solana.com

# 查看余额
solana balance

# 查看程序信息
solana program show <PROGRAM_ID>

# 查看账户信息
solana account <ACCOUNT_ADDRESS>

# 构建程序
anchor build

# 部署程序
anchor deploy

# 测试程序
anchor test

# 运行本地验证器
solana-test-validator
anchor localnet
```

---

## 🎯 最佳实践

1. **版本控制**: 为每个重要的合约版本打 tag
2. **测试先行**: 在本地测试通过后再部署到 devnet
3. **备份数据**: 重大更新前备份重要账户数据
4. **渐进式更新**: 一次只改一个功能，逐步验证
5. **文档同步**: 更新合约时同步更新 API 文档

---

## 当前项目配置

- **Program ID**: `7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx`
- **Network**: Devnet
- **RPC**: `https://api.devnet.solana.com`
- **Wallet**: `5nTLZ2q7XkACv7GZ7qY2q66Z5V7F1j69jQbNaYQtdKD6`

如果你修改了合约，现在可以运行：

```bash
cd /Users/kiro/Documents/item/ce
anchor build && anchor deploy
cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
```

