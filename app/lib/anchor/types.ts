/**
 * Anchor 程序类型定义
 */

import type { Program } from "@coral-xyz/anchor";

// 导出程序类型 - 使用 Program 不带泛型，避免类型约束问题
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CreatorEconomyProgram = Program;
