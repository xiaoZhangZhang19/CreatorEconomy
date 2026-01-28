// 部署脚本
// 在部署后运行此脚本以初始化平台

const anchor = require('@coral-xyz/anchor');

module.exports = async function (provider) {
  // 配置客户端使用本地集群
  anchor.setProvider(provider);

  console.log('部署完成！');
  console.log('程序 ID:', provider.wallet.publicKey.toString());
  console.log('');
  console.log('下一步：');
  console.log('1. 运行测试: anchor test');
  console.log('2. 或手动初始化平台（使用 scripts/initialize-platform.ts）');
};
