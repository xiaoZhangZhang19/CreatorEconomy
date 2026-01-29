/**
 * Anchor 程序类型定义
 */

import type { Program } from "@coral-xyz/anchor";
import type { CreatorEconomy } from "./idl";

// 导出程序类型
export type CreatorEconomyProgram = Program<CreatorEconomy>;

