"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/wallet/WalletButton";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function TestWalletPage() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (publicKey && connected) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });
    } else {
      setBalance(null);
    }
  }, [publicKey, connected, connection]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🔌 Solana 钱包连接测试
        </h1>

        <div className="space-y-6">
          {/* 钱包按钮 */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">钱包连接</h3>
              <p className="text-sm text-gray-600">
                使用官方 Solana Wallet Adapter
              </p>
            </div>
            <WalletButton />
          </div>

          {/* 连接状态 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">连接状态</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    connected ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-gray-700">
                  {connected ? "✅ 已连接" : "⚪ 未连接"}
                </span>
              </div>
              {connecting && (
                <div className="text-blue-600">⏳ 连接中...</div>
              )}
            </div>
          </div>

          {/* 钱包信息 */}
          {connected && publicKey && (
            <div className="p-4 bg-green-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">钱包信息</h3>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">公钥地址：</p>
                <p className="text-xs font-mono bg-white p-2 rounded break-all">
                  {publicKey.toBase58()}
                </p>
              </div>

              {balance !== null && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">余额：</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {balance.toFixed(4)} SOL
                  </p>
                </div>
              )}

              <button
                onClick={disconnect}
                className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                断开连接
              </button>
            </div>
          )}

          {/* 说明 */}
          {!connected && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                📱 如何连接钱包
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>安装 Phantom 或 Solflare 钱包扩展</li>
                <li>点击上方的 "Select Wallet" 按钮</li>
                <li>选择你的钱包并授权连接</li>
                <li>确保钱包切换到 Devnet 网络</li>
              </ol>
            </div>
          )}

          {/* 技术信息 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">🔧 技术栈</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <strong>Wallet Adapter:</strong> @solana/wallet-adapter-react
              </div>
              <div>
                <strong>UI 组件:</strong> @solana/wallet-adapter-react-ui
              </div>
              <div>
                <strong>支持钱包:</strong> Phantom, Solflare
              </div>
              <div>
                <strong>网络:</strong> Solana Devnet
              </div>
            </div>
          </div>

          {/* 返回首页 */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

