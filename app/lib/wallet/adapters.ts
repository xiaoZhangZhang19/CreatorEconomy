/**
 * 钱包适配器配置
 * 只导入我们需要的 Solana 钱包，避免加载不必要的适配器
 */
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

export function getWalletAdapters() {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
}

