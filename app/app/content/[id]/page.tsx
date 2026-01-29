"use client";

import { use, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContent } from "@/hooks/useContent";
import { useTip } from "@/hooks/useTip";
import { WalletButton } from "@/components/wallet/WalletButton";
import { SuccessModal, ErrorModal } from "@/components/ui";
import {
  formatSOL,
  formatTimestamp,
  formatAddress,
} from "@/lib/utils/format";

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const contentId = parseInt(id);
  const { content, loading, error } = useContent(contentId);
  const { tipContent, loading: tipping } = useTip();
  const { publicKey } = useWallet();

  const [showTipDialog, setShowTipDialog] = useState(false);
  const [tipAmount, setTipAmount] = useState("0.01");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTip = async () => {
    if (!content || !publicKey) return;

    try {
      await tipContent(content.contentId, content.creator, parseFloat(tipAmount));
      setShowTipDialog(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorMessage(err.message);
      setShowErrorModal(true);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-purple-400"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-b-cyan-400 border-l-purple-400" style={{animationDirection: 'reverse'}}></div>
        </div>
        <p className="mt-6 text-cyan-300 text-lg font-medium neon-glow-cyan">加载星际内容中...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card rounded-2xl p-8 shadow-xl relative overflow-hidden"
          style={{borderColor: 'rgba(255, 0, 110, 0.5)', boxShadow: '0 0 40px rgba(255, 0, 110, 0.3)'}}>
          <div className="scan-lines absolute inset-0"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-6xl">😕</span>
              <div>
                <h2 className="text-3xl font-bold text-pink-300 neon-glow-pink">内容加载失败</h2>
                <p className="text-pink-200 mt-1">{error || "内容不存在"}</p>
              </div>
            </div>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 glass neon-border text-cyan-300 font-semibold rounded-xl hover:scale-105 transition-all hover:neon-glow-cyan"
            >
              ← 返回星际首页
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isEarlySupporter =
    publicKey &&
    content.earlySupporters.includes(publicKey.toBase58());
  const canBeEarlySupporter = content.earlySupporters.length < 10;

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative z-10">
      {/* 成功对话框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="打赏成功！"
        message="你的打赏已成功发送给创作者，感谢你对优质内容的支持！"
        icon="🎉"
      />

      {/* 错误对话框 */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="打赏失败"
        message={errorMessage}
        icon="😕"
      />

      {/* Back Button & Wallet */}
      <div className="flex justify-between items-center">
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 glass neon-border text-cyan-300 rounded-xl transition-all font-medium hover:scale-105 hover:neon-glow-cyan"
        >
          ← 返回星际
        </a>
        <WalletButton />
      </div>

      {/* Main Content Card - Space Tech */}
      <article className="glass-card rounded-3xl shadow-2xl overflow-hidden neon-border relative">
        {/* Header Gradient */}
        <div className="h-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-glow"></div>
        
        {/* 扫描线效果 */}
        <div className="scan-lines absolute inset-0 pointer-events-none"></div>
        
        <div className="p-8 md:p-12 relative z-10">
          {/* Title & Badge */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-extrabold gradient-text leading-tight">
                {content.title}
              </h1>
              {isEarlySupporter && (
                <span className="flex-shrink-0 inline-flex items-center px-4 py-2 neon-border rounded-full text-sm font-bold text-pink-300 neon-glow-pink animate-pulse">
                  ⭐ 早期支持者
                </span>
              )}
            </div>
          </div>

          {/* Author & Time */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-cyan-500/30">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/50">
              {content.creator.substring(0, 1)}
            </div>
            <div>
              <p className="text-sm text-cyan-400">创作者</p>
              <p className="font-semibold text-cyan-300">{formatAddress(content.creator)}</p>
            </div>
            <span className="text-cyan-500">•</span>
            <div>
              <p className="text-sm text-cyan-400">发布时间</p>
              <p className="font-semibold text-cyan-300">{formatTimestamp(content.createdAt)}</p>
            </div>
          </div>

          {/* Content Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-cyan-100 text-lg leading-relaxed whitespace-pre-wrap glass rounded-2xl p-8">
              {content.description}
            </div>
          </div>

          {/* Stats Grid - Holographic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="holographic glass-card rounded-2xl p-6 text-center neon-border card-hover-effect">
              <span className="text-4xl mb-2 block">💰</span>
              <p className="text-4xl font-bold text-cyan-300 mb-1 neon-glow-cyan">
                {formatSOL(content.totalTips)} SOL
              </p>
              <p className="text-sm text-cyan-400 font-medium">累计打赏</p>
            </div>
            <div className="holographic glass-card rounded-2xl p-6 text-center neon-border-purple card-hover-effect animation-delay-2000">
              <span className="text-4xl mb-2 block">👥</span>
              <p className="text-4xl font-bold text-purple-300 mb-1">
                {content.tipCount}
              </p>
              <p className="text-sm text-purple-400 font-medium">打赏次数</p>
            </div>
            <div className="holographic glass-card rounded-2xl p-6 text-center neon-border card-hover-effect animation-delay-4000">
              <span className="text-4xl mb-2 block">⭐</span>
              <p className="text-4xl font-bold text-pink-300 mb-1">
                {content.earlySupporters.length} / 10
              </p>
              <p className="text-sm text-pink-400 font-medium">早期支持者</p>
            </div>
          </div>

          {/* Early Supporters List */}
          {content.earlySupporters.length > 0 && (
            <div className="mb-8 glass-card neon-border rounded-2xl p-6 relative overflow-hidden">
              <div className="scan-lines absolute inset-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center">
                  <span className="mr-2">⭐</span>
                  早期支持者名单
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.earlySupporters.map((supporter, index) => (
                    <div
                      key={index}
                      className="glass neon-border rounded-xl px-4 py-3 flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/50">
                        #{index + 1}
                      </div>
                      <span className="font-mono text-sm text-cyan-300">
                        {formatAddress(supporter)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {publicKey ? (
            publicKey.toBase58() === content.creator ? (
              <div className="glass-card neon-border rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="scan-lines absolute inset-0"></div>
                <div className="relative z-10">
                  <div className="animate-float mb-3">
                    <span className="text-6xl">✨</span>
                  </div>
                  <p className="text-cyan-300 text-xl font-semibold">这是你创建的星际内容</p>
                  <p className="text-cyan-400 text-sm mt-2">感谢你的分享！</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTipDialog(true)}
                className="w-full glass neon-border text-cyan-300 py-6 rounded-2xl font-bold text-xl hover:scale-105 hover:neon-glow-cyan transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <span className="text-4xl">💰</span>
                <span>打赏创作者</span>
              </button>
            )
          ) : (
            <div className="glass-card neon-border rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="scan-lines absolute inset-0"></div>
              <div className="relative z-10">
                <div className="animate-float mb-4">
                  <span className="text-6xl">🔐</span>
                </div>
                <p className="text-cyan-300 text-lg font-semibold mb-6">连接钱包以打赏创作者</p>
                <div className="flex justify-center">
                  <WalletButton />
                </div>
              </div>
            </div>
          )}

          {/* Info Banners */}
          {canBeEarlySupporter && !isEarlySupporter && publicKey && (
            <div className="mt-6 glass-card rounded-2xl p-6 relative overflow-hidden"
              style={{borderColor: 'rgba(255, 165, 0, 0.5)', boxShadow: '0 0 30px rgba(255, 165, 0, 0.2)'}}>
              <div className="scan-lines absolute inset-0"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <span className="text-5xl animate-float">💡</span>
                <div>
                  <p className="text-yellow-300 font-bold text-xl mb-2 neon-glow-pink">
                    成为早期支持者，获得长期收益！
                  </p>
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    前10名打赏用户将成为早期支持者，从第11个打赏开始，你将获得每次打赏金额的10%分成。
                    目前还剩 <span className="font-bold text-lg neon-glow-pink">{10 - content.earlySupporters.length}</span> 个名额！
                  </p>
                </div>
              </div>
            </div>
          )}

          {!canBeEarlySupporter && !isEarlySupporter && publicKey && (
            <div className="mt-6 glass-card neon-border rounded-2xl p-6 relative overflow-hidden">
              <div className="scan-lines absolute inset-0"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <span className="text-5xl">ℹ️</span>
                <div>
                  <p className="text-cyan-300 font-bold text-lg mb-2">
                    早期支持者名额已满
                  </p>
                  <p className="text-cyan-200 text-sm">
                    你打赏金额的10%将分配给前10个早期支持者，90%归创作者。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 背景光球 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
      </article>

      {/* Tip Dialog - Space Tech */}
      {showTipDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-xl" style={{background: 'rgba(10, 10, 31, 0.9)'}}>
          <div className="glass-card neon-border rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl relative overflow-hidden">
            <div className="scan-lines absolute inset-0"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="animate-float mb-4">
                  <span className="text-7xl">💰</span>
                </div>
                <h3 className="text-4xl font-bold gradient-text">打赏创作者</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-cyan-300 mb-3">
                    打赏金额 (SOL)
                  </label>
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="w-full glass neon-border rounded-xl px-6 py-4 text-2xl font-bold text-center text-cyan-300 placeholder-cyan-400/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                  />
                  <p className="text-xs text-cyan-400 mt-2 text-center">最低 0.001 SOL</p>
                </div>

                <div className="holographic glass-card neon-border-purple rounded-2xl p-6 space-y-3">
                  <h4 className="font-bold text-purple-300 mb-3">💸 费用明细</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cyan-300">平台费 (2%)</span>
                      <span className="font-semibold text-cyan-200">
                        {(parseFloat(tipAmount) * 0.02).toFixed(4)} SOL
                      </span>
                    </div>
                    {!canBeEarlySupporter && (
                      <div className="flex justify-between">
                        <span className="text-cyan-300">早期支持者分成 (10%)</span>
                        <span className="font-semibold text-cyan-200">
                          {(parseFloat(tipAmount) * 0.1).toFixed(4)} SOL
                        </span>
                      </div>
                    )}
                    <div className="border-t border-purple-500/30 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-purple-300 font-bold">创作者收益</span>
                        <span className="font-bold text-purple-300 text-lg neon-glow-cyan">
                          {(
                            parseFloat(tipAmount) *
                            (canBeEarlySupporter ? 0.98 : 0.88)
                          ).toFixed(4)}{" "}
                          SOL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowTipDialog(false)}
                    className="flex-1 glass text-cyan-300 py-4 rounded-xl font-bold hover:scale-105 transition-all border border-cyan-500/30"
                    disabled={tipping}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleTip}
                    className="flex-1 glass neon-border text-cyan-300 py-4 rounded-xl font-bold hover:scale-105 hover:neon-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={tipping || parseFloat(tipAmount) < 0.001}
                  >
                    {tipping ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">⏳</span>
                        处理中...
                      </span>
                    ) : (
                      `确认打赏 ${tipAmount} SOL`
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* 背景光球 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
}
