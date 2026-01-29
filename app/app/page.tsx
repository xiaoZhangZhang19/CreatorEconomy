"use client";

import { useAllContents } from "@/hooks/useContent";
import { WalletButton } from "@/components/wallet/WalletButton";
import { formatSOL, formatTimestamp, truncateText, formatAddress } from "@/lib/utils/format";

export default function HomePage() {
  const { contents, loading, error } = useAllContents();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="relative px-8 py-16 sm:px-12 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              探索优质内容
              <br />
              <span className="text-purple-200">成为早期支持者</span>
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              发现精彩创作，支持你喜欢的创作者，前10名支持者可获得后续打赏的10%分成
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/creator/publish"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span className="mr-2">✨</span>
                开始创作
              </a>
              <WalletButton />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-purple-100 rounded-xl">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{contents.length}</p>
              <p className="text-gray-600">优质内容</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-green-100 rounded-xl">
              <span className="text-3xl">💰</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {formatSOL(contents.reduce((sum, c) => sum + c.totalTips, 0))}
              </p>
              <p className="text-gray-600">累计打赏 SOL</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-orange-100 rounded-xl">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {contents.reduce((sum, c) => sum + c.tipCount, 0)}
              </p>
              <p className="text-gray-600">打赏次数</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-6 text-gray-600 text-lg font-medium">加载精彩内容中...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">⚠️</span>
            <div>
              <h3 className="text-xl font-semibold text-red-800">加载失败</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contents.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl shadow-lg border-2 border-dashed border-gray-300">
          <span className="text-7xl mb-6 inline-block">📝</span>
          <p className="text-gray-600 text-xl font-medium mb-2">暂无内容</p>
          <p className="text-gray-500 mb-8">
            成为第一个发布内容的创作者吧！
          </p>
          <a
            href="/creator/publish"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <span className="mr-2">✨</span>
            立即发布
          </a>
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && contents.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">内容广场</h3>
            <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white">
              <option>最新发布</option>
              <option>最多打赏</option>
              <option>最多支持</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((content) => (
              <a
                key={content.contentId}
                href={`/content/${content.contentId}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 hover:scale-[1.02]"
              >
                {/* Card Header with gradient */}
                <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 flex-1">
                      {content.title}
                    </h3>
                    {content.earlySupporters.length < 10 && (
                      <span className="ml-2 flex-shrink-0 inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full animate-pulse">
                        🔥 热门
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {truncateText(content.description, 150)}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {content.creator.substring(0, 1)}
                      </div>
                      <span className="font-medium">{formatAddress(content.creator)}</span>
                    </div>
                    <span>{formatTimestamp(content.createdAt)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatSOL(content.totalTips)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">总打赏 SOL</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-indigo-600">
                        {content.earlySupporters.length}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">早期支持者</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      <span className="font-semibold text-gray-700">{content.tipCount}</span> 次打赏
                    </span>
                    <span className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                      查看详情 →
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
