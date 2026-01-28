"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// 导入钱包适配器样式
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // 使用 devnet 网络
  const network = WalletAdapterNetwork.Devnet;
  
  // 配置 RPC 端点
  const endpoint = useMemo(() => {
    // 可以使用环境变量或默认的 devnet URL
    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      return process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }
    return clusterApiUrl(network);
  }, [network]);

  // 配置支持的钱包适配器 - 只在客户端创建
  const wallets = useMemo(
    () => {
      // 在服务端返回空数组，客户端返回真实适配器
      if (typeof window === 'undefined') return [];
      
      try {
        return [
          // 主流 Solana 钱包
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
        ];
      } catch (error) {
        console.debug('钱包适配器初始化错误:', error);
        return [];
      }
    },
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          // 静默处理钱包相关错误，避免影响用户体验
          console.debug('钱包错误（已忽略）:', error);
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
