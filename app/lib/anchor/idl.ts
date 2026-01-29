/**
 * Anchor IDL 类型定义
 * 这个文件从生成的 creator_economy.json 导入 IDL
 */

import idlData from "../idl/creator_economy.json";

// 将 JSON 转换为 Idl 类型（使用 as any 避免 Vercel 构建时的类型问题）
export const IDL = idlData as any;

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID_FROM_IDL = idlData.address;
