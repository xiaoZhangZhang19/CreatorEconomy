"use client";

import { useAllContents } from "@/hooks/useContent";
import { WalletButton } from "@/components/wallet/WalletButton";
import { formatSOL, formatTimestamp, truncateText, formatAddress } from "@/lib/utils/format";

export default function HomePage() {
  const { contents, loading, error } = useAllContents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">内容广场</h2>
          <p className="mt-2 text-gray-600">
            发现优质内容，成为早期支持者获得分成
          </p>
        </div>
        <WalletButton />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">加载失败: {error}</p>
        </div>
      )}

      {!loading && !error && contents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">还没有内容</p>
          <p className="mt-2 text-gray-400">
            成为第一个发布内容的创作者吧！
          </p>
          <a
            href="/creator/publish"
            className="mt-4 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            发布内容
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <a
            key={content.contentId}
            href={`/content/${content.contentId}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {content.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateText(content.description, 150)}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>by {formatAddress(content.creator)}</span>
                <span>{formatTimestamp(content.createdAt)}</span>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-purple-600 font-semibold">
                    💰 {formatSOL(content.totalTips)} SOL
                  </span>
                  <span className="text-gray-500">
                    👥 {content.tipCount} 次打赏
                  </span>
                </div>
                {content.earlySupporters.length > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {content.earlySupporters.length} 个早期支持者
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
