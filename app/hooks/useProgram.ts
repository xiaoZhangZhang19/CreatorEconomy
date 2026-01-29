"use client";

import { useMemo } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { IDL } from "@/lib/anchor/idl";
import type { CreatorEconomyProgram } from "@/lib/anchor/types";
import { PublicKey } from "@solana/web3.js";

// 程序 ID
const PROGRAM_ID = new PublicKey("7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx");

export function useProgram(): CreatorEconomyProgram | null {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    // 使用 IDL 和 provider 创建 Program 实例
    // 强制转换为 CreatorEconomyProgram (Program<any>) 以绕过类型检查
    return new Program(IDL, provider) as CreatorEconomyProgram;
  }, [connection, wallet]);

  return program;
}
