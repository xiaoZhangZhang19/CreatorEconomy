/**
 * Anchor 程序类型定义
 */

import type { Program, IdlAccounts } from "@coral-xyz/anchor";
import type { CreatorEconomy } from "./idl";

// 导出程序类型
export type CreatorEconomyProgram = Program<CreatorEconomy>;

// 导出账户类型
export type Platform = IdlAccounts<CreatorEconomy>["platform"];
export type Content = IdlAccounts<CreatorEconomy>["content"];
export type CreatorProfile = IdlAccounts<CreatorEconomy>["creatorProfile"];
