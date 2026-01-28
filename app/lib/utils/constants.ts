import { PublicKey } from "@solana/web3.js";

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID = new PublicKey(
  "7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx"
);

// RPC Endpoint
export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com";

// 平台金库地址（部署后需要更新为实际的管理员地址）
export const PLATFORM_TREASURY = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_TREASURY ||
    "11111111111111111111111111111111"
);

// 常量
export const MIN_TIP_AMOUNT = 0.001; // SOL
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
