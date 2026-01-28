#!/bin/bash

# 合约更新部署脚本
# 用于快速更新和部署修改后的 Anchor 合约

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Anchor 合约更新部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 检查是否在项目根目录
if [ ! -f "Anchor.toml" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 1. 构建合约
echo -e "${YELLOW}📦 步骤 1/4: 构建合约...${NC}"
anchor build
echo -e "${GREEN}✅ 构建完成${NC}"
echo ""

# 2. 部署到 devnet
echo -e "${YELLOW}🚀 步骤 2/4: 部署到 devnet...${NC}"
echo -e "${BLUE}当前网络配置:${NC}"
solana config get | grep "RPC URL"
echo ""

# 检查余额
BALANCE=$(solana balance | awk '{print $1}')
echo -e "${BLUE}钱包余额: ${BALANCE} SOL${NC}"

if (( $(echo "$BALANCE < 1" | bc -l) )); then
    echo -e "${YELLOW}⚠️  余额不足，正在申请空投...${NC}"
    solana airdrop 2 || echo -e "${YELLOW}空投失败，请手动申请 SOL${NC}"
fi

anchor deploy
echo -e "${GREEN}✅ 部署完成${NC}"
echo ""

# 3. 复制 IDL 到前端
echo -e "${YELLOW}📋 步骤 3/4: 更新前端 IDL...${NC}"
if [ -f "target/idl/creator_economy.json" ]; then
    # 确保目录存在
    mkdir -p app/lib/idl
    cp target/idl/creator_economy.json app/lib/idl/creator_economy.json
    echo -e "${GREEN}✅ IDL 已复制到 app/lib/idl/${NC}"
    echo -e "${BLUE}   文件大小: $(du -h app/lib/idl/creator_economy.json | awk '{print $1}')${NC}"
else
    echo -e "${RED}❌ 错误: IDL 文件不存在${NC}"
    exit 1
fi
echo ""

# 4. 显示程序信息
echo -e "${YELLOW}📊 步骤 4/4: 验证部署...${NC}"
PROGRAM_ID=$(grep "creator_economy = " Anchor.toml | grep -o '".*"' | tr -d '"')
echo -e "${BLUE}Program ID: ${PROGRAM_ID}${NC}"

# 查看程序信息
solana program show $PROGRAM_ID || echo -e "${YELLOW}⚠️  无法获取程序信息${NC}"
echo ""

# 完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 合约更新完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

echo -e "${YELLOW}📝 后续步骤:${NC}"
echo ""
echo -e "1. ${BLUE}重启前端开发服务器:${NC}"
echo -e "   cd app && yarn dev"
echo ""
echo -e "2. ${BLUE}如果账户结构有变化，重新初始化平台:${NC}"
echo -e "   npm run initialize"
echo ""
echo -e "3. ${BLUE}如果 Program ID 有变化，更新前端配置:${NC}"
echo -e "   编辑 app/lib/utils/constants.ts"
echo -e "   export const PROGRAM_ID = new PublicKey(\"${PROGRAM_ID}\");"
echo ""

# 询问是否重新初始化
read -p "是否需要重新初始化平台? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔄 重新初始化平台...${NC}"
    npm run initialize || echo -e "${RED}初始化失败，请手动运行: npm run initialize${NC}"
fi

echo ""
echo -e "${GREEN}🎉 全部完成！${NC}"

