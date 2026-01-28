"use client";

import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import {
  derivePlatformPDA,
  deriveCreatorProfilePDA,
  deriveContentPDA,
} from "@/lib/utils/pda";

export function usePublish() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 检查并创建创作者资料（如果不存在）
   */
  const ensureCreatorProfile = async () => {
    if (!program || !publicKey) return;

    try {
      const [creatorProfilePDA] = deriveCreatorProfilePDA(publicKey);

      // 尝试获取创作者资料
      try {
        await program.account.creatorProfile.fetch(creatorProfilePDA);
        console.log("创作者资料已存在");
        return;
      } catch {
        // 资料不存在，需要创建
        console.log("创建创作者资料...");
        await program.methods
          .createCreatorProfile()
          .accounts({
            creator: publicKey,
            creatorProfile: creatorProfilePDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        console.log("创作者资料创建成功");
      }
    } catch (err) {
      console.error("确保创作者资料失败:", err);
      throw err;
    }
  };

  /**
   * 发布内容
   */
  const publishContent = async (title: string, description: string) => {
    if (!program || !publicKey) {
      throw new Error("请先连接钱包");
    }

    try {
      setLoading(true);
      setError(null);

      // 确保创作者资料存在
      await ensureCreatorProfile();

      // 派生 PDAs
      const [platformPDA] = derivePlatformPDA();
      const platformAccount = await program.account.platform.fetch(platformPDA);
      const contentId = platformAccount.totalContentCount.toNumber();

      const [contentPDA] = deriveContentPDA(contentId);
      const [creatorProfilePDA] = deriveCreatorProfilePDA(publicKey);

      console.log("发布内容:");
      console.log("- 内容 ID:", contentId);
      console.log("- 标题:", title);
      console.log("- 描述长度:", description.length);

      // 调用发布指令
      const tx = await program.methods
        .publishContent(title, description)
        .accounts({
          creator: publicKey,
          creatorProfile: creatorProfilePDA,
          content: contentPDA,
          platform: platformPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("发布成功，交易签名:", tx);
      return { tx, contentId };
    } catch (err: any) {
      console.error("发布失败:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    publishContent,
    loading,
    error,
  };
}
