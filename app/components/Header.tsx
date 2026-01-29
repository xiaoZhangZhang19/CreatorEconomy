"use client";

import { WalletButton } from "@/components/wallet/WalletButton";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white rounded-lg p-2">
                <span className="text-3xl">🎨</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Creator Economy
              </h1>
              <span className="text-sm text-purple-200">创作者经济平台</span>
            </div>
          </a>
          <nav className="flex items-center space-x-2">
            <a
              href="/"
              className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium"
            >
              首页
            </a>
            <a
              href="/creator/publish"
              className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium"
            >
              发布内容
            </a>
            <a
              href="/creator"
              className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 font-medium"
            >
              创作者中心
            </a>
            <div className="ml-2">
              <WalletButton />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
