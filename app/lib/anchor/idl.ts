/**
 * Anchor IDL 类型定义
 * 这个文件从生成的 creator_economy.json 导入 IDL
 */

import idlJson from "../idl/creator_economy.json";
import type { Idl } from "@coral-xyz/anchor";

// 导出 IDL（使用 as const 保留字面量类型）
export const IDL = idlJson as unknown as Idl;

// 导出类型（从 IDL 推断的完整类型）
export type CreatorEconomy = typeof idlJson;

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID_FROM_IDL = idlJson.address;

// 导出 IDL 的 JSON 对象供类型推断使用
export { idlJson };
