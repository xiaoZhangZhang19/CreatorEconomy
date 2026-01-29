"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePublish } from "@/hooks/usePublish";
import { WalletButton } from "@/components/wallet/WalletButton";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/utils/constants";

export default function PublishPage() {
  const { publicKey } = useWallet();
  const { publishContent, loading } = usePublish();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedContentId, setPublishedContentId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 验证
    if (!title.trim()) {
      setError("请输入标题");
      return;
    }
    if (!description.trim()) {
      setError("请输入描述");
      return;
    }
    if (title.length > MAX_TITLE_LENGTH) {
      setError(`标题最长 ${MAX_TITLE_LENGTH} 字符`);
      return;
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setError(`描述最长 ${MAX_DESCRIPTION_LENGTH} 字符`);
      return;
    }

    try {
      const result = await publishContent(title, description);
      setPublishedContentId(result.contentId);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!publicKey) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-2xl p-12 text-center border-2 border-purple-200">
          <span className="text-7xl mb-6 block">🔐</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            开始创作之旅
          </h2>
          <p className="text-gray-600 text-lg mb-8">请先连接钱包以发布内容</p>
          <div className="flex justify-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // 跳转到内容详情页
    if (publishedContentId !== null) {
      window.location.href = `/content/${publishedContentId}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 成功对话框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="发布成功！"
        message="你的作品已成功发布到链上，现在可以开始获得支持者和收益了！"
        icon="🎉"
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block mb-4">
          <span className="text-6xl">✨</span>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">发布你的作品</h2>
        <p className="text-xl text-gray-600">分享创意，获得支持者和收益</p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Gradient Header */}
        <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
        
        <div className="p-8 md:p-12 space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 flex items-start space-x-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h4 className="font-bold text-red-800 mb-1">发布失败</h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的作品起个响亮的名字..."
              maxLength={MAX_TITLE_LENGTH}
              className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                让标题简洁有力，吸引读者注意
              </p>
              <p className="text-sm font-medium text-gray-600">
                {title.length} / {MAX_TITLE_LENGTH}
              </p>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">
              内容描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述你的作品内容、创作灵感、特色亮点..."
              rows={12}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 resize-none transition-all leading-relaxed"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                详细的描述能让读者更好地了解你的作品
              </p>
              <p className="text-sm font-medium text-gray-600">
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>

          {/* Info Card - Early Supporter Mechanism */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 border-2 border-purple-300 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-6">
              <span className="text-5xl">💎</span>
              <div>
                <h4 className="text-2xl font-bold text-purple-900 mb-2">
                  早期支持者机制
                </h4>
                <p className="text-purple-800 leading-relaxed">
                  通过独特的分成机制，激励用户发现和支持优质内容
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">👥</span>
                  <h5 className="font-bold text-gray-900">前10名支持者</h5>
                </div>
                <p className="text-sm text-gray-700">
                  成为早期支持者，享有永久分成权益
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">💰</span>
                  <h5 className="font-bold text-gray-900">10% 持续分成</h5>
                </div>
                <p className="text-sm text-gray-700">
                  从第11个打赏开始，每次获得10%分成
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h5 className="font-bold text-gray-900">激励传播</h5>
                </div>
                <p className="text-sm text-gray-700">
                  用户主动发现和推广优质内容
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h5 className="font-bold text-gray-900">持续收益</h5>
                </div>
                <p className="text-sm text-gray-700">
                  作品越受欢迎，你和支持者收益越多
                </p>
              </div>
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <span className="text-3xl">ℹ️</span>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">发布费用说明</h4>
                <p className="text-blue-800 text-sm">
                  发布内容需要支付约 <span className="font-bold text-lg">0.007 SOL</span> 的链上存储租金费用（一次性）
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading || !title.trim() || !description.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  发布中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  立即发布
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <span className="text-4xl">💡</span>
          <div>
            <h4 className="text-xl font-bold text-yellow-900 mb-3">创作小贴士</h4>
            <ul className="space-y-2 text-yellow-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>起一个吸引人的标题，让人一眼就想点进来</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>内容要真实、有价值，能给读者带来收获</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>可以分享到社交媒体，吸引更多早期支持者</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>与支持者保持互动，建立良好的创作者形象</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
