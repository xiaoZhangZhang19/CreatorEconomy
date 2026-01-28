"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePublish } from "@/hooks/usePublish";
import { WalletButton } from "@/components/wallet/WalletButton";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/utils/constants";

export default function PublishPage() {
  const { publicKey } = useWallet();
  const { publishContent, loading } = usePublish();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

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
      alert("发布成功！");
      // 跳转到内容详情页
      window.location.href = `/content/${result.contentId}`;
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            发布内容
          </h2>
          <p className="text-gray-600 mb-6">请先连接钱包以发布内容</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">发布内容</h2>
          <p className="mt-2 text-gray-600">分享你的作品，获得支持者</p>
        </div>
        <WalletButton />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            标题 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入内容标题..."
            maxLength={MAX_TITLE_LENGTH}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {title.length} / {MAX_TITLE_LENGTH} 字符
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述 *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="输入详细描述..."
            rows={10}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length} / {MAX_DESCRIPTION_LENGTH} 字符
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">
            📌 早期支持者机制
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• 前 10 个打赏用户将成为早期支持者</li>
            <li>• 从第 11 个打赏开始，他们将获得 10% 的分成</li>
            <li>• 激励用户发现和支持优质内容</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300"
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading ? "发布中..." : "发布内容"}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          发布内容需要支付约 0.007 SOL 的租金费用
        </p>
      </form>
    </div>
  );
}
