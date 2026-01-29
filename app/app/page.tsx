"use client";

import { useAllContents } from "@/hooks/useContent";
import { WalletButton } from "@/components/wallet/WalletButton";
import { formatSOL, formatTimestamp, truncateText, formatAddress } from "@/lib/utils/format";

export default function HomePage() {
  const { contents, loading, error } = useAllContents();

  return (
    <div className="space-y-8 relative z-10">
      {/* Hero Section - Space Tech */}
      <div className="relative overflow-hidden glass-card rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-grid-cyan bg-[size:32px_32px]"></div>
        <div className="scan-lines absolute inset-0"></div>
        
        <div className="relative px-8 py-16 sm:px-12 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
              <span className="gradient-text animate-glow">探索宇宙级</span>
              <br />
              <span className="neon-glow-cyan">优质内容</span>
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              🚀 发现精彩创作，支持你喜欢的创作者
              <br />
              <span className="neon-glow-pink font-semibold">前10名支持者可获得后续打赏的10%分成</span>
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/creator/publish"
                className="inline-flex items-center px-8 py-4 glass neon-border rounded-xl font-bold text-cyan-300 hover:scale-105 transition-all duration-300 animate-float hover:neon-glow-cyan"
              >
                <span className="mr-2 text-2xl">✨</span>
                开始创作
              </a>
              <div className="animate-float animation-delay-2000">
                <WalletButton />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements - Neon orbs */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -mt-20 -ml-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Stats Section - Holographic cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="holographic glass-card rounded-2xl p-6 card-hover-effect">
          <div className="flex items-center space-x-4">
            <div className="p-4 neon-border rounded-xl bg-cyan-500/10">
              <span className="text-4xl">📝</span>
            </div>
            <div>
              <p className="text-4xl font-bold neon-glow-cyan">{contents.length}</p>
              <p className="text-cyan-200">优质内容</p>
            </div>
          </div>
        </div>
        <div className="holographic glass-card rounded-2xl p-6 card-hover-effect animation-delay-2000">
          <div className="flex items-center space-x-4">
            <div className="p-4 neon-border-purple rounded-xl bg-purple-500/10">
              <span className="text-4xl">💰</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-300">
                {formatSOL(contents.reduce((sum, c) => sum + c.totalTips, 0))}
              </p>
              <p className="text-purple-200">累计打赏 SOL</p>
            </div>
          </div>
        </div>
        <div className="holographic glass-card rounded-2xl p-6 card-hover-effect animation-delay-4000">
          <div className="flex items-center space-x-4">
            <div className="p-4 neon-border rounded-xl bg-pink-500/10">
              <span className="text-4xl">👥</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-pink-300">
                {contents.reduce((sum, c) => sum + c.tipCount, 0)}
              </p>
              <p className="text-pink-200">打赏次数</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-purple-400"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-b-cyan-400 border-l-purple-400" style={{animationDirection: 'reverse'}}></div>
          </div>
          <p className="mt-6 text-cyan-300 text-lg font-medium neon-glow-cyan">加载精彩内容中...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card neon-border rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-5xl">⚠️</span>
            <div>
              <h3 className="text-2xl font-semibold text-red-300 neon-glow-pink">加载失败</h3>
              <p className="text-red-200 mt-2">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contents.length === 0 && (
        <div className="text-center py-20 glass-card rounded-3xl shadow-lg neon-border">
          <div className="animate-float">
            <span className="text-8xl mb-6 inline-block">🚀</span>
          </div>
          <p className="text-cyan-300 text-2xl font-bold mb-2 neon-glow-cyan">探索太空，发现未知</p>
          <p className="text-cyan-200 mb-8">
            成为第一个发布内容的星际创作者吧！
          </p>
          <a
            href="/creator/publish"
            className="inline-flex items-center px-8 py-4 glass neon-border rounded-xl font-bold text-cyan-300 hover:scale-105 transition-all duration-300 hover:neon-glow-cyan"
          >
            <span className="mr-2 text-2xl">✨</span>
            启动创作
          </a>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && contents.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold gradient-text">🌌 内容星系</h3>
            <select className="px-4 py-2 glass neon-border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-cyan-300 bg-transparent font-semibold">
              <option className="bg-gray-900">最新发布</option>
              <option className="bg-gray-900">最多打赏</option>
              <option className="bg-gray-900">最多支持</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((content, index) => (
              <a
                key={content.contentId}
                href={`/content/${content.contentId}`}
                className="group block glass-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden neon-border card-hover-effect relative"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Card Header with gradient */}
                <div className="h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-glow"></div>
                
                <div className="p-6 relative scan-lines">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-cyan-100 group-hover:text-cyan-300 group-hover:neon-glow-cyan transition-all line-clamp-2 flex-1">
                      {content.title}
                    </h3>
                    {content.earlySupporters.length < 10 && (
                      <span className="ml-2 flex-shrink-0 inline-flex items-center px-2 py-1 neon-border rounded-full text-xs font-bold text-pink-300 animate-pulse neon-glow-pink">
                        🔥 HOT
                      </span>
                    )}
                  </div>
                  
                  <p className="text-cyan-200/80 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {truncateText(content.description, 150)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-cyan-300/70 mb-4 pb-4 border-b border-cyan-500/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/50">
                        {content.creator.substring(0, 1)}
                      </div>
                      <span className="font-medium text-cyan-200">{formatAddress(content.creator)}</span>
                    </div>
                    <span className="text-cyan-300/60">{formatTimestamp(content.createdAt)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass neon-border rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-cyan-300 neon-glow-cyan">
                        {formatSOL(content.totalTips)}
                      </p>
                      <p className="text-xs text-cyan-400/70 mt-1">总打赏 SOL</p>
                    </div>
                    <div className="glass neon-border-purple rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-purple-300">
                        {content.earlySupporters.length}
                      </p>
                      <p className="text-xs text-purple-400/70 mt-1">早期支持者</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-cyan-400/70">
                      <span className="font-semibold text-cyan-300">{content.tipCount}</span> 次打赏
                    </span>
                    <span className="text-cyan-300 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center neon-glow-cyan">
                      进入星球 →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
