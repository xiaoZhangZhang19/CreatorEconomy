"use client";

import { WalletButton } from "@/components/wallet/WalletButton";

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-purple-600">
              🎨 Creator Economy
            </h1>
            <span className="text-sm text-gray-500">创作者经济</span>
          </div>
          <nav className="flex items-center space-x-6">
            <a
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              首页
            </a>
            <a
              href="/test-wallet"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              测试钱包
            </a>
            <a
              href="/creator/publish"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              发布内容
            </a>
            <a
              href="/creator"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              创作者中心
            </a>
            <WalletButton />
          </nav>
        </div>
      </div>
    </header>
  );
}

