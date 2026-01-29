/**
 * Anchor IDL 类型定义
 * 这个文件从生成的 creator_economy.json 导入 IDL
 */

import idlJson from "../idl/creator_economy.json";
import { Idl } from "@coral-xyz/anchor";

// 导出 IDL（使用 as Idl 确保类型正确）
export const IDL = idlJson as Idl;

// 导出类型（从 IDL 推断）
export type CreatorEconomy = typeof idlJson;

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID_FROM_IDL = idlJson.address;
