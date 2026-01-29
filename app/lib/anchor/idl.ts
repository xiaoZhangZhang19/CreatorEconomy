/**
 * Anchor IDL 类型定义
 * 这个文件从生成的 creator_economy.json 导入 IDL
 */

import idlData from "../idl/creator_economy.json";

export const IDL = idlData as any;

// 程序 ID（从 IDL 中读取）
export const PROGRAM_ID_FROM_IDL = idlData.address;
