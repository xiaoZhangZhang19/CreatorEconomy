"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/hooks/useProgram";
import { WalletButton } from "@/components/wallet/WalletButton";
import { deriveCreatorProfilePDA } from "@/lib/utils/pda";
import { formatSOL, formatTimestamp, formatAddress } from "@/lib/utils/format";

interface CreatorProfileData {
  creator: string;
  contentCount: number;
  totalEarnings: number;
  createdAt: number;
}

interface MyContent {
  contentId: number;
  title: string;
  totalTips: number;
  tipCount: number;
  createdAt: number;
}

export default function CreatorCenterPage() {
  const { publicKey } = useWallet();
  const program = useProgram();

  const [profile, setProfile] = useState<CreatorProfileData | null>(null);
  const [myContents, setMyContents] = useState<MyContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program || !publicKey) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 获取创作者资料
        const [profilePDA] = deriveCreatorProfilePDA(publicKey);
        try {
          const profileAccount = await program.account.creatorProfile.fetch(profilePDA);
          setProfile({
            creator: profileAccount.creator.toBase58(),
            contentCount: profileAccount.contentCount,
            totalEarnings: profileAccount.totalEarnings.toNumber(),
            createdAt: profileAccount.createdAt.toNumber(),
          });
        } catch {
          setProfile(null);
        }

        // 获取我的内容列表
        const allContents = await program.account.content.all();
        const myContentsList = allContents
          .filter((c) => c.account.creator.toBase58() === publicKey.toBase58())
          .map((c) => ({
            contentId: c.account.contentId.toNumber(),
            title: c.account.title,
            totalTips: c.account.totalTips.toNumber(),
            tipCount: c.account.tipCount,
            createdAt: c.account.createdAt.toNumber(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        setMyContents(myContentsList);
        setError(null);
      } catch (err: any) {
        console.error("获取数据失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program, publicKey]);

  if (!publicKey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            创作者中心
          </h2>
          <p className="text-gray-600 mb-6">请先连接钱包</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">创作者中心</h2>
          <p className="mt-2 text-gray-600">
            管理你的内容和收益
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/creator/publish"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + 发布新内容
          </a>
          <WalletButton />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">加载失败: {error}</p>
        </div>
      )}

      {/* 统计卡片 */}
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-500 mb-2">累计收益</h3>
            <p className="text-3xl font-bold text-purple-600">
              {formatSOL(profile.totalEarnings)} SOL
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-500 mb-2">发布内容数</h3>
            <p className="text-3xl font-bold text-gray-800">
              {profile.contentCount}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm text-gray-500 mb-2">注册时间</h3>
            <p className="text-lg text-gray-800">
              {formatTimestamp(profile.createdAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            你还没有创作者资料。发布第一条内容时会自动创建。
          </p>
        </div>
      )}

      {/* 我的内容列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">我的内容</h3>
        </div>

        {myContents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">还没有发布内容</p>
            <a
              href="/creator/publish"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              发布第一条内容
            </a>
          </div>
        ) : (
          <div className="divide-y">
            {myContents.map((content) => (
              <a
                key={content.contentId}
                href={`/content/${content.contentId}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {content.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      发布于 {formatTimestamp(content.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600">
                        {formatSOL(content.totalTips)}
                      </p>
                      <p className="text-gray-500">SOL</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">
                        {content.tipCount}
                      </p>
                      <p className="text-gray-500">打赏次数</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
