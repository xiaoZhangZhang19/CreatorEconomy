/**
 * Anchor IDL 类型定义
 * 这个文件从生成的 creator_economy.json 导入 IDL
 */

import idlData from "../idl/creator_economy.json";
import type { Idl } from "@coral-xyz/anchor";

// 将 JSON 转换为 Idl 类型
export const IDL: Idl = idlData as Idl;

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID_FROM_IDL = idlData.address;

// 导出原始类型用于 Program 泛型
export type CreatorEconomy = typeof idlData;
