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
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="glass-card neon-border rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="scan-lines absolute inset-0"></div>
          <div className="relative z-10">
            <div className="animate-float mb-6">
              <span className="text-8xl">🔐</span>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-4">
              开始星际创作之旅
            </h2>
            <p className="text-cyan-200 text-lg mb-8">请先连接钱包以发布内容到星际网络</p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
          {/* 背景光球 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
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
    <div className="max-w-4xl mx-auto relative z-10">
      {/* 成功对话框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="发布成功！"
        message="你的作品已成功发布到星际链上，现在可以开始获得支持者和收益了！"
        icon="🎉"
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block mb-4 animate-float">
          <span className="text-7xl">✨</span>
        </div>
        <h2 className="text-5xl font-extrabold gradient-text mb-3">发布你的星际作品</h2>
        <p className="text-xl text-cyan-200">分享创意到宇宙，获得支持者和收益 🚀</p>
      </div>

      {/* Main Form Card - Space Tech */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl shadow-2xl overflow-hidden neon-border relative">
        {/* Gradient Header */}
        <div className="h-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-glow"></div>
        
        {/* 扫描线效果 */}
        <div className="scan-lines absolute inset-0 pointer-events-none"></div>
        
        <div className="p-8 md:p-12 space-y-8 relative z-10">
          {/* Error Message */}
          {error && (
            <div className="glass-card rounded-2xl p-6 flex items-start space-x-4 relative"
              style={{borderColor: 'rgba(255, 0, 110, 0.5)', boxShadow: '0 0 40px rgba(255, 0, 110, 0.3)'}}>
              <span className="text-4xl">⚠️</span>
              <div>
                <h4 className="font-bold text-pink-300 mb-1 neon-glow-pink">发布失败</h4>
                <p className="text-pink-200">{error}</p>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-lg font-bold text-cyan-300 mb-3">
              标题 <span className="text-pink-400 neon-glow-pink">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的作品起个响亮的星际名字..."
              maxLength={MAX_TITLE_LENGTH}
              className="w-full glass neon-border rounded-xl px-6 py-4 text-lg text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-cyan-400">
                让标题简洁有力，吸引星际读者注意
              </p>
              <p className="text-sm font-medium text-cyan-300">
                {title.length} / {MAX_TITLE_LENGTH}
              </p>
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-lg font-bold text-cyan-300 mb-3">
              内容描述 <span className="text-pink-400 neon-glow-pink">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述你的作品内容、创作灵感、特色亮点..."
              rows={12}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full glass neon-border rounded-xl px-6 py-4 text-lg text-cyan-100 placeholder-cyan-400/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 resize-none transition-all leading-relaxed"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-cyan-400">
                详细的描述能让读者更好地了解你的星际作品
              </p>
              <p className="text-sm font-medium text-cyan-300">
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>

          {/* Info Card - Early Supporter Mechanism */}
          <div className="holographic glass-card neon-border-purple rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-start space-x-4 mb-6">
              <span className="text-6xl animate-float">💎</span>
              <div>
                <h4 className="text-2xl font-bold gradient-text mb-2">
                  早期支持者机制
                </h4>
                <p className="text-purple-200 leading-relaxed">
                  通过独特的分成机制，激励用户发现和支持优质内容
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass neon-border rounded-xl p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">👥</span>
                  <h5 className="font-bold text-cyan-300">前10名支持者</h5>
                </div>
                <p className="text-sm text-cyan-200">
                  成为早期支持者，享有永久分成权益
                </p>
              </div>
              <div className="glass neon-border rounded-xl p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">💰</span>
                  <h5 className="font-bold text-cyan-300">10% 持续分成</h5>
                </div>
                <p className="text-sm text-cyan-200">
                  从第11个打赏开始，每次获得10%分成
                </p>
              </div>
              <div className="glass neon-border rounded-xl p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">⚡</span>
                  <h5 className="font-bold text-cyan-300">激励传播</h5>
                </div>
                <p className="text-sm text-cyan-200">
                  用户主动发现和推广优质内容
                </p>
              </div>
              <div className="glass neon-border rounded-xl p-5">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">🎯</span>
                  <h5 className="font-bold text-cyan-300">持续收益</h5>
                </div>
                <p className="text-sm text-cyan-200">
                  作品越受欢迎，你和支持者收益越多
                </p>
              </div>
            </div>
          </div>

          {/* Cost Info */}
          <div className="glass-card neon-border rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <span className="text-4xl">ℹ️</span>
              <div>
                <h4 className="font-bold text-cyan-300 mb-2">发布费用说明</h4>
                <p className="text-cyan-200 text-sm">
                  发布内容需要支付约 <span className="font-bold text-lg neon-glow-cyan">0.007 SOL</span> 的链上存储租金费用（一次性）
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 glass text-cyan-300 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all border border-cyan-500/30"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 glass neon-border text-cyan-300 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:neon-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading || !title.trim() || !description.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  发布中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2 text-2xl">🚀</span>
                  发射到星际
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* 背景光球 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
      </form>

      {/* Tips Section */}
      <div className="mt-8 glass-card neon-border rounded-2xl p-8 relative overflow-hidden">
        <div className="scan-lines absolute inset-0"></div>
        <div className="relative z-10 flex items-start space-x-4">
          <span className="text-5xl animate-float">💡</span>
          <div>
            <h4 className="text-2xl font-bold gradient-text mb-3">星际创作小贴士</h4>
            <ul className="space-y-2 text-cyan-200">
              <li className="flex items-start">
                <span className="mr-2 text-cyan-400">▸</span>
                <span>起一个吸引人的标题，让人一眼就想点进来</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-cyan-400">▸</span>
                <span>内容要真实、有价值，能给读者带来收获</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-cyan-400">▸</span>
                <span>可以分享到社交媒体，吸引更多早期支持者</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-cyan-400">▸</span>
                <span>与支持者保持互动，建立良好的创作者形象</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
