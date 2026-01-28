import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { PROGRAM_ID } from "./constants";

/**
 * 派生平台 PDA
 */
export function derivePlatformPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    PROGRAM_ID
  );
}

/**
 * 派生创作者资料 PDA
 */
export function deriveCreatorProfilePDA(
  creator: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("creator"), creator.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * 派生内容 PDA
 */
export function deriveContentPDA(contentId: number): [PublicKey, number] {
  const contentIdBuffer = new BN(contentId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("content"), contentIdBuffer],
    PROGRAM_ID
  );
}

/**
 * 派生支持者收益 PDA
 */
export function deriveSupporterEarningsPDA(
  contentId: number,
  supporter: PublicKey
): [PublicKey, number] {
  const contentIdBuffer = new BN(contentId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [Buffer.from("earnings"), contentIdBuffer, supporter.toBuffer()],
    PROGRAM_ID
  );
}
