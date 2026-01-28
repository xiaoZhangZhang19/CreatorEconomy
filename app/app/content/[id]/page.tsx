"use client";

import { use, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContent } from "@/hooks/useContent";
import { useTip } from "@/hooks/useTip";
import { WalletButton } from "@/components/wallet/WalletButton";
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

  const handleTip = async () => {
    if (!content || !publicKey) return;

    try {
      await tipContent(content.contentId, content.creator, parseFloat(tipAmount));
      alert("打赏成功！");
      setShowTipDialog(false);
      window.location.reload();
    } catch (err: any) {
      alert("打赏失败: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">加载失败</h2>
        <p className="text-red-600">{error || "内容不存在"}</p>
        <a
          href="/"
          className="mt-4 inline-block text-red-600 hover:text-red-800"
        >
          ← 返回首页
        </a>
      </div>
    );
  }

  const isEarlySupporter =
    publicKey &&
    content.earlySupporters.includes(publicKey.toBase58());
  const canBeEarlySupporter = content.earlySupporters.length < 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <a href="/" className="text-purple-600 hover:text-purple-800">
          ← 返回首页
        </a>
        <WalletButton />
      </div>

      <article className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>

        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>创作者: {formatAddress(content.creator)}</span>
            <span>•</span>
            <span>{formatTimestamp(content.createdAt)}</span>
          </div>
          {isEarlySupporter && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ 你是早期支持者
            </span>
          )}
        </div>

        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 whitespace-pre-wrap">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatSOL(content.totalTips)} SOL
            </p>
            <p className="text-sm text-gray-500">累计打赏</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {content.tipCount}
            </p>
            <p className="text-sm text-gray-500">打赏次数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {content.earlySupporters.length}
            </p>
            <p className="text-sm text-gray-500">早期支持者</p>
          </div>
        </div>

        {content.earlySupporters.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              早期支持者列表
            </h3>
            <div className="flex flex-wrap gap-2">
              {content.earlySupporters.map((supporter, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full"
                >
                  {index + 1}. {formatAddress(supporter)}
                </span>
              ))}
            </div>
          </div>
        )}

        {publicKey ? (
          publicKey.toBase58() === content.creator ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800">这是你创建的内容</p>
            </div>
          ) : (
            <button
              onClick={() => setShowTipDialog(true)}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
            >
              💰 打赏创作者
            </button>
          )
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">连接钱包以打赏创作者</p>
            <WalletButton />
          </div>
        )}

        {canBeEarlySupporter && !isEarlySupporter && publicKey && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold">
              💡 成为早期支持者，获得后续打赏的 10% 分成！
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              目前已有 {content.earlySupporters.length} 个早期支持者，还剩{" "}
              {10 - content.earlySupporters.length} 个名额
            </p>
          </div>
        )}

        {!canBeEarlySupporter && !isEarlySupporter && publicKey && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              早期支持者名额已满，你打赏的 10% 将分给前 10 个支持者
            </p>
          </div>
        )}
      </article>

      {/* 打赏对话框 */}
      {showTipDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              打赏创作者
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  打赏金额 (SOL)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">最低 0.001 SOL</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-700">
                  • 平台费: 2% ≈ {(parseFloat(tipAmount) * 0.02).toFixed(4)}{" "}
                  SOL
                </p>
                {!canBeEarlySupporter && (
                  <p className="text-gray-700">
                    • 早期支持者分成: 10% ≈{" "}
                    {(parseFloat(tipAmount) * 0.1).toFixed(4)} SOL
                  </p>
                )}
                <p className="text-gray-700 font-semibold mt-2">
                  创作者收益: ≈{" "}
                  {(
                    parseFloat(tipAmount) *
                    (canBeEarlySupporter ? 0.98 : 0.88)
                  ).toFixed(4)}{" "}
                  SOL
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTipDialog(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={tipping}
                >
                  取消
                </button>
                <button
                  onClick={handleTip}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300"
                  disabled={tipping || parseFloat(tipAmount) < 0.001}
                >
                  {tipping ? "处理中..." : `打赏 ${tipAmount} SOL`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
