"use client";

import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

/**
 * 钱包连接按钮
 * 使用官方 Solana Wallet Adapter UI 组件
 * 添加客户端挂载检查以防止 SSR hydration 错误
 */
export function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在服务端渲染时返回占位符，防止 hydration 不匹配
  if (!mounted) {
    return (
      <div 
        style={{
          backgroundColor: '#7c3aed',
          height: '40px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          padding: '0 20px',
          display: 'inline-flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        Select Wallet
      </div>
    );
  }

  return (
    <WalletMultiButton 
      style={{
        backgroundColor: '#7c3aed',
        height: '40px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
      }}
    />
  );
}
