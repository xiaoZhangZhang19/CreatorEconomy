"use client";

import { useMemo } from "react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { IDL } from "@/lib/anchor/idl";
import type { CreatorEconomyProgram } from "@/lib/anchor/types";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";

// 从 IDL 中读取程序 ID
const PROGRAM_ID = new PublicKey("7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx");

export function useProgram(): CreatorEconomyProgram | null {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    return new Program(IDL, provider) as CreatorEconomyProgram;
  }, [connection, wallet]);

  return program;
}
