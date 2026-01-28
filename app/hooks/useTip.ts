"use client";

import { useState } from "react";
import { useProgram } from "./useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import {
  deriveContentPDA,
  deriveCreatorProfilePDA,
  derivePlatformPDA,
} from "@/lib/utils/pda";
import { PLATFORM_TREASURY } from "@/lib/utils/constants";

export function useTip() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tipContent = async (
    contentId: number,
    creatorAddress: string,
    amountInSOL: number
  ) => {
    if (!program || !publicKey) {
      throw new Error("请先连接钱包");
    }

    try {
      setLoading(true);
      setError(null);

      const amount = new BN(amountInSOL * LAMPORTS_PER_SOL);
      const creator = new PublicKey(creatorAddress);

      // 派生 PDAs
      const [contentPDA] = deriveContentPDA(contentId);
      const [creatorProfilePDA] = deriveCreatorProfilePDA(creator);
      const [platformPDA] = derivePlatformPDA();

      // 获取内容账户以获取早期支持者列表
      const contentAccount = await program.account.content.fetch(contentPDA);
      const earlySupporters = contentAccount.earlySupporters || [];

      // 构建 remaining_accounts（早期支持者的钱包账户）
      const remainingAccounts = earlySupporters.map((supporter: any) => ({
        pubkey: supporter,
        isSigner: false,
        isWritable: true,
      }));

      console.log("打赏信息:");
      console.log("- 内容 ID:", contentId);
      console.log("- 金额:", amountInSOL, "SOL");
      console.log("- 创作者:", creatorAddress);
      console.log("- 早期支持者数量:", earlySupporters.length);

      // 调用打赏指令
      const tx = await program.methods
        .tipContent(amount)
        .accountsStrict({
          tipper: publicKey,
          creator: creator,
          content: contentPDA,
          creatorProfile: creatorProfilePDA,
          platform: platformPDA,
          platformTreasury: PLATFORM_TREASURY,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(remainingAccounts)
        .rpc();

      console.log("打赏成功，交易签名:", tx);
      return tx;
    } catch (err: any) {
      console.error("打赏失败:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tipContent,
    loading,
    error,
  };
}
