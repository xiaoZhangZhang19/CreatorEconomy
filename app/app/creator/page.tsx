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
          const profileAccount = await (program.account as any).CreatorProfile.fetch(profilePDA);
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
        const allContents = await (program.account as any).Content.all();
        const myContentsList = allContents
          .filter((c: any) => c.account.creator.toBase58() === publicKey.toBase58())
          .map((c: any) => ({
            contentId: c.account.contentId.toNumber(),
            title: c.account.title,
            totalTips: c.account.totalTips.toNumber(),
            tipCount: c.account.tipCount,
            createdAt: c.account.createdAt.toNumber(),
          }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt);

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
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl shadow-2xl p-12 text-center border-2 border-purple-200">
          <span className="text-7xl mb-6 block">👨‍💼</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            创作者中心
          </h2>
          <p className="text-gray-600 text-lg mb-8">连接钱包以访问你的创作者中心</p>
          <div className="flex justify-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-6 text-gray-600 text-lg font-medium">加载数据中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-5xl">👨‍💼</span>
              <h2 className="text-4xl font-extrabold text-white">创作者中心</h2>
            </div>
            <p className="text-xl text-purple-100">
              管理你的内容和收益
            </p>
            <p className="text-sm text-purple-200 mt-2 font-mono">
              {formatAddress(publicKey.toBase58())}
            </p>
          </div>
          <a
            href="/creator/publish"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
          >
            <span className="mr-2">✨</span>
            发布新内容
          </a>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 flex items-start space-x-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h4 className="font-bold text-red-800 mb-1">加载失败</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl">
                <span className="text-4xl">💰</span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">累计收益</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {formatSOL(profile.totalEarnings)}
                </p>
                <p className="text-sm text-gray-500">SOL</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                <span className="text-4xl">📝</span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">发布内容</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {profile.contentCount}
                </p>
                <p className="text-sm text-gray-500">篇</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100 hover:border-green-300 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                <span className="text-4xl">⏰</span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">注册时间</h3>
                <p className="text-lg font-bold text-green-600">
                  {formatTimestamp(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <span className="text-5xl">💡</span>
            <div>
              <h4 className="text-xl font-bold text-yellow-900 mb-2">
                开始你的创作之旅
              </h4>
              <p className="text-yellow-800 mb-4">
                你还没有创作者资料。发布第一条内容时会自动创建。
              </p>
              <a
                href="/creator/publish"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
              >
                <span className="mr-2">✨</span>
                发布第一条内容
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"></div>
        
        <div className="px-8 py-6 border-b-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📚</span>
              <h3 className="text-2xl font-bold text-gray-900">我的内容</h3>
            </div>
            {myContents.length > 0 && (
              <span className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-full">
                {myContents.length} 篇
              </span>
            )}
          </div>
        </div>

        {myContents.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-7xl mb-6 block">📝</span>
            <p className="text-gray-600 text-xl font-medium mb-2">还没有发布内容</p>
            <p className="text-gray-500 mb-8">开始创作，分享你的作品吧！</p>
            <a
              href="/creator/publish"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="mr-2">✨</span>
              发布第一条内容
            </a>
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-100">
            {myContents.map((content) => (
              <a
                key={content.contentId}
                href={`/content/${content.contentId}`}
                className="block px-8 py-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all group"
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {content.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {formatTimestamp(content.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center bg-purple-50 rounded-xl px-6 py-4 min-w-[120px]">
                      <p className="text-2xl font-bold text-purple-600">
                        {formatSOL(content.totalTips)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">累计 SOL</p>
                    </div>
                    <div className="text-center bg-indigo-50 rounded-xl px-6 py-4 min-w-[120px]">
                      <p className="text-2xl font-bold text-indigo-600">
                        {content.tipCount}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">打赏次数</p>
                    </div>
                    <span className="text-purple-600 group-hover:translate-x-2 transition-transform text-2xl">
                      →
                    </span>
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
