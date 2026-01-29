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
          const profileAccount = await (program.account as any).creatorProfile.fetch(profilePDA);
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
        const allContents = await (program.account as any).content.all();
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
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass-card neon-border rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="scan-lines absolute inset-0"></div>
          <div className="relative z-10">
            <div className="animate-float mb-6">
              <span className="text-8xl">👨‍💼</span>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-4">
              创作者控制中心
            </h2>
            <p className="text-cyan-200 text-lg mb-8">连接钱包以访问你的星际创作者中心</p>
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

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-cyan-400 border-r-purple-400"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-b-cyan-400 border-l-purple-400" style={{animationDirection: 'reverse'}}></div>
        </div>
        <p className="mt-6 text-cyan-300 text-lg font-medium neon-glow-cyan">加载数据中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative z-10">
      {/* Header - Space Tech */}
      <div className="glass-card neon-border rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-cyan bg-[size:32px_32px]"></div>
        <div className="scan-lines absolute inset-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-6xl animate-float">👨‍💼</span>
              <h2 className="text-5xl font-extrabold gradient-text neon-glow-cyan">创作者控制中心</h2>
            </div>
            <p className="text-xl text-cyan-200">
              🚀 管理你的星际内容和收益
            </p>
            <p className="text-sm text-cyan-300 mt-2 font-mono neon-border inline-block px-3 py-1 rounded-lg">
              {formatAddress(publicKey.toBase58())}
            </p>
          </div>
          <a
            href="/creator/publish"
            className="inline-flex items-center px-8 py-4 glass neon-border rounded-xl font-bold text-cyan-300 hover:scale-105 transition-all hover:neon-glow-cyan"
          >
            <span className="mr-2 text-2xl">✨</span>
            发布新内容
          </a>
        </div>
        
        {/* 背景光球 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card rounded-2xl p-6 flex items-start space-x-4 neon-border relative"
          style={{borderColor: 'rgba(255, 0, 110, 0.5)', boxShadow: '0 0 40px rgba(255, 0, 110, 0.3)'}}>
          <span className="text-4xl">⚠️</span>
          <div>
            <h4 className="font-bold text-pink-300 mb-1 neon-glow-pink">加载失败</h4>
            <p className="text-pink-200">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards - Holographic */}
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="holographic glass-card rounded-2xl p-8 neon-border card-hover-effect">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 neon-border rounded-2xl bg-cyan-500/20">
                <span className="text-5xl">💰</span>
              </div>
              <div>
                <h3 className="text-sm text-cyan-300 font-medium">累计收益</h3>
                <p className="text-4xl font-bold text-cyan-300 neon-glow-cyan">
                  {formatSOL(profile.totalEarnings)}
                </p>
                <p className="text-sm text-cyan-400">SOL</p>
              </div>
            </div>
          </div>

          <div className="holographic glass-card rounded-2xl p-8 neon-border-purple card-hover-effect animation-delay-2000">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 neon-border-purple rounded-2xl bg-purple-500/20">
                <span className="text-5xl">📝</span>
              </div>
              <div>
                <h3 className="text-sm text-purple-300 font-medium">发布内容</h3>
                <p className="text-4xl font-bold text-purple-300">
                  {profile.contentCount}
                </p>
                <p className="text-sm text-purple-400">篇</p>
              </div>
            </div>
          </div>

          <div className="holographic glass-card rounded-2xl p-8 neon-border card-hover-effect animation-delay-4000">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 neon-border rounded-2xl bg-pink-500/20">
                <span className="text-5xl">⏰</span>
              </div>
              <div>
                <h3 className="text-sm text-pink-300 font-medium">注册时间</h3>
                <p className="text-lg font-bold text-pink-300">
                  {formatTimestamp(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card neon-border rounded-2xl p-8 relative overflow-hidden">
          <div className="scan-lines absolute inset-0"></div>
          <div className="relative z-10 flex items-start space-x-4">
            <span className="text-6xl animate-float">💡</span>
            <div>
              <h4 className="text-2xl font-bold gradient-text mb-2">
                开始你的星际创作之旅
              </h4>
              <p className="text-cyan-200 mb-4">
                你还没有创作者资料。发布第一条内容时会自动创建。
              </p>
              <a
                href="/creator/publish"
                className="inline-flex items-center px-6 py-3 glass neon-border text-cyan-300 font-bold rounded-xl hover:scale-105 transition-all hover:neon-glow-cyan"
              >
                <span className="mr-2 text-xl">✨</span>
                发布第一条内容
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Content List - Space Tech */}
      <div className="glass-card rounded-3xl shadow-2xl overflow-hidden neon-border relative">
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-glow"></div>
        <div className="scan-lines absolute inset-0"></div>
        
        <div className="px-8 py-6 border-b border-cyan-500/30 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">📚</span>
              <h3 className="text-3xl font-bold gradient-text">我的内容星球</h3>
            </div>
            {myContents.length > 0 && (
              <span className="px-4 py-2 glass neon-border text-cyan-300 font-bold rounded-full">
                {myContents.length} 篇
              </span>
            )}
          </div>
        </div>

        {myContents.length === 0 ? (
          <div className="p-16 text-center relative z-10">
            <div className="animate-float">
              <span className="text-8xl mb-6 block">📝</span>
            </div>
            <p className="text-cyan-300 text-2xl font-bold mb-2 neon-glow-cyan">还没有发布内容</p>
            <p className="text-cyan-200 mb-8">开始创作，分享你的星际作品吧！</p>
            <a
              href="/creator/publish"
              className="inline-flex items-center px-8 py-4 glass neon-border text-cyan-300 font-bold rounded-xl hover:scale-105 transition-all hover:neon-glow-cyan"
            >
              <span className="mr-2 text-2xl">✨</span>
              发布第一条内容
            </a>
          </div>
        ) : (
          <div className="divide-y divide-cyan-500/20">
            {myContents.map((content, index) => (
              <a
                key={content.contentId}
                href={`/content/${content.contentId}`}
                className="block px-8 py-6 glass-card hover:neon-border transition-all group relative z-10"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-cyan-300 mb-2 group-hover:neon-glow-cyan transition-all">
                      {content.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-sm text-cyan-400">
                      <span className="flex items-center">
                        <span className="mr-1">📅</span>
                        {formatTimestamp(content.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center glass neon-border rounded-xl px-6 py-4 min-w-[120px]">
                      <p className="text-2xl font-bold text-cyan-300 neon-glow-cyan">
                        {formatSOL(content.totalTips)}
                      </p>
                      <p className="text-sm text-cyan-400 mt-1">累计 SOL</p>
                    </div>
                    <div className="text-center glass neon-border-purple rounded-xl px-6 py-4 min-w-[120px]">
                      <p className="text-2xl font-bold text-purple-300">
                        {content.tipCount}
                      </p>
                      <p className="text-sm text-purple-400 mt-1">打赏次数</p>
                    </div>
                    <span className="text-cyan-300 group-hover:translate-x-2 transition-transform text-3xl neon-glow-cyan">
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
