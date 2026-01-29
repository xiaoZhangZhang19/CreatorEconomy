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
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-6 text-gray-600 text-lg font-medium">加载内容中...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl">😕</span>
            <div>
              <h2 className="text-2xl font-bold text-red-800">内容加载失败</h2>
              <p className="text-red-600 mt-1">{error || "内容不存在"}</p>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    );
  }

  const isEarlySupporter =
    publicKey &&
    content.earlySupporters.includes(publicKey.toBase58());
  const canBeEarlySupporter = content.earlySupporters.length < 10;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
          className="inline-flex items-center px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-medium"
        >
          ← 返回首页
        </a>
        <WalletButton />
      </div>

      {/* Main Content Card */}
      <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header Gradient */}
        <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
        
        <div className="p-8 md:p-12">
          {/* Title & Badge */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {content.title}
              </h1>
              {isEarlySupporter && (
                <span className="flex-shrink-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg">
                  ⭐ 早期支持者
                </span>
              )}
            </div>
          </div>

          {/* Author & Time */}
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b-2 border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {content.creator.substring(0, 1)}
            </div>
            <div>
              <p className="text-sm text-gray-500">创作者</p>
              <p className="font-semibold text-gray-900">{formatAddress(content.creator)}</p>
            </div>
            <span className="text-gray-300">•</span>
            <div>
              <p className="text-sm text-gray-500">发布时间</p>
              <p className="font-semibold text-gray-900">{formatTimestamp(content.createdAt)}</p>
            </div>
          </div>

          {/* Content Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-2xl p-8">
              {content.description}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border-2 border-purple-200">
              <span className="text-3xl mb-2 block">💰</span>
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {formatSOL(content.totalTips)} SOL
              </p>
              <p className="text-sm text-gray-600 font-medium">累计打赏</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center border-2 border-indigo-200">
              <span className="text-3xl mb-2 block">👥</span>
              <p className="text-3xl font-bold text-indigo-600 mb-1">
                {content.tipCount}
              </p>
              <p className="text-sm text-gray-600 font-medium">打赏次数</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center border-2 border-orange-200">
              <span className="text-3xl mb-2 block">⭐</span>
              <p className="text-3xl font-bold text-orange-600 mb-1">
                {content.earlySupporters.length} / 10
              </p>
              <p className="text-sm text-gray-600 font-medium">早期支持者</p>
            </div>
          </div>

          {/* Early Supporters List */}
          {content.earlySupporters.length > 0 && (
            <div className="mb-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⭐</span>
                早期支持者名单
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.earlySupporters.map((supporter, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl px-4 py-3 flex items-center space-x-3 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow">
                      #{index + 1}
                    </div>
                    <span className="font-mono text-sm text-gray-700">
                      {formatAddress(supporter)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          {publicKey ? (
            publicKey.toBase58() === content.creator ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <span className="text-5xl mb-3 block">✨</span>
                <p className="text-blue-800 text-lg font-semibold">这是你创建的内容</p>
                <p className="text-blue-600 text-sm mt-2">感谢你的分享！</p>
              </div>
            ) : (
              <button
                onClick={() => setShowTipDialog(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <span className="text-3xl">💰</span>
                <span>打赏创作者</span>
              </button>
            )
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-gray-200 rounded-2xl p-8 text-center">
              <span className="text-5xl mb-4 block">🔐</span>
              <p className="text-gray-700 text-lg font-semibold mb-6">连接钱包以打赏创作者</p>
              <div className="flex justify-center">
                <WalletButton />
              </div>
            </div>
          )}

          {/* Info Banners */}
          {canBeEarlySupporter && !isEarlySupporter && publicKey && (
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <span className="text-4xl">💡</span>
                <div>
                  <p className="text-yellow-900 font-bold text-lg mb-2">
                    成为早期支持者，获得长期收益！
                  </p>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    前10名打赏用户将成为早期支持者，从第11个打赏开始，你将获得每次打赏金额的10%分成。
                    目前还剩 <span className="font-bold text-lg">{10 - content.earlySupporters.length}</span> 个名额！
                  </p>
                </div>
              </div>
            </div>
          )}

          {!canBeEarlySupporter && !isEarlySupporter && publicKey && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <span className="text-4xl">ℹ️</span>
                <div>
                  <p className="text-blue-900 font-bold text-lg mb-2">
                    早期支持者名额已满
                  </p>
                  <p className="text-blue-800 text-sm">
                    你打赏金额的10%将分配给前10个早期支持者，90%归创作者。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Tip Dialog */}
      {showTipDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border-4 border-purple-200">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">💰</span>
              <h3 className="text-3xl font-bold text-gray-900">打赏创作者</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  打赏金额 (SOL)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-xl px-6 py-4 text-2xl font-bold text-center focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">最低 0.001 SOL</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 space-y-3 border-2 border-purple-200">
                <h4 className="font-bold text-gray-900 mb-3">💸 费用明细</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">平台费 (2%)</span>
                    <span className="font-semibold text-gray-900">
                      {(parseFloat(tipAmount) * 0.02).toFixed(4)} SOL
                    </span>
                  </div>
                  {!canBeEarlySupporter && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">早期支持者分成 (10%)</span>
                      <span className="font-semibold text-gray-900">
                        {(parseFloat(tipAmount) * 0.1).toFixed(4)} SOL
                      </span>
                    </div>
                  )}
                  <div className="border-t-2 border-purple-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-bold">创作者收益</span>
                      <span className="font-bold text-purple-600 text-lg">
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
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  disabled={tipping}
                >
                  取消
                </button>
                <button
                  onClick={handleTip}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      )}
    </div>
  );
}
