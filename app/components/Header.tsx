"use client";

import { WalletButton } from "@/components/wallet/WalletButton";

export function Header() {
  return (
    <header className="glass-card border-b border-cyan-500/30 shadow-2xl sticky top-0 z-50 backdrop-blur-xl relative overflow-hidden">
      {/* 扫描线效果 */}
      <div className="scan-lines absolute inset-0"></div>
      
      {/* 霓虹装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-glow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* 外层霓虹光晕 */}
              <div className="absolute inset-0 neon-border rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-glow"></div>
              
              {/* Logo容器 */}
              <div className="relative glass neon-border rounded-lg p-2 group-hover:scale-110 transition-transform">
                <span className="text-3xl animate-float">🎨</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">
                Creator Economy
              </h1>
              <span className="text-sm text-cyan-300 neon-glow-cyan">🚀 星际创作者平台</span>
            </div>
          </a>
          
          <nav className="flex items-center space-x-2">
            <a
              href="/"
              className="px-4 py-2 text-cyan-300 hover:text-cyan-100 glass hover:neon-border rounded-lg transition-all duration-300 font-medium hover:scale-105 hover:neon-glow-cyan"
            >
              🏠 首页
            </a>
            <a
              href="/creator/publish"
              className="px-4 py-2 text-purple-300 hover:text-purple-100 glass hover:neon-border-purple rounded-lg transition-all duration-300 font-medium hover:scale-105"
            >
              ✨ 发布内容
            </a>
            <a
              href="/creator"
              className="px-4 py-2 text-pink-300 hover:text-pink-100 glass hover:neon-border rounded-lg transition-all duration-300 font-medium hover:scale-105"
            >
              👤 创作者中心
            </a>
            <div className="ml-2">
              <WalletButton />
            </div>
          </nav>
        </div>
      </div>
      
      {/* 背景装饰光球 */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
    </header>
  );
}
