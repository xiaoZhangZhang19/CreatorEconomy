"use client";

import { useState, useEffect } from "react";
import { useProgram } from "./useProgram";
import { deriveContentPDA } from "@/lib/utils/pda";

export interface ContentData {
  contentId: number;
  creator: string;
  title: string;
  description: string;
  totalTips: number;
  tipCount: number;
  earlySupporters: string[];
  createdAt: number;
}

/**
 * 获取单个内容
 */
export function useContent(contentId: number) {
  const program = useProgram();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        const [contentPDA] = deriveContentPDA(contentId);
        const contentAccount = await (program.account as any).content.fetch(contentPDA);

        // 安全地转换 BN 类型
        const safeToNumber = (bn: any) => {
          try {
            return bn?.toNumber ? bn.toNumber() : 0;
          } catch {
            return 0;
          }
        };

        const safeToBase58 = (pk: any) => {
          try {
            return pk?.toBase58 ? pk.toBase58() : "";
          } catch {
            return "";
          }
        };

        setContent({
          contentId: safeToNumber(contentAccount.contentId),
          creator: safeToBase58(contentAccount.creator),
          title: contentAccount.title || "",
          description: contentAccount.description || "",
          totalTips: safeToNumber(contentAccount.totalTips),
          tipCount: contentAccount.tipCount || 0,
          earlySupporters: (contentAccount.earlySupporters || [])
            .map(safeToBase58)
            .filter(Boolean),
          createdAt: safeToNumber(contentAccount.createdAt),
        });
        setError(null);
      } catch (err: any) {
        console.error("获取内容失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [program, contentId]);

  return { content, loading, error };
}

/**
 * 获取所有内容列表
 */
export function useAllContents() {
  const program = useProgram();
  const [contents, setContents] = useState<ContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!program) {
      setLoading(false);
      return;
    }

    const fetchAllContents = async () => {
      try {
        setLoading(true);
        const contentAccounts = await (program.account as any).content.all();

        const contentsData = contentAccounts
          .map((account: any) => ({
            contentId: account.account.contentId.toNumber(),
            creator: account.account.creator.toBase58(),
            title: account.account.title,
            description: account.account.description,
            totalTips: account.account.totalTips.toNumber(),
            tipCount: account.account.tipCount,
            earlySupporters: account.account.earlySupporters.map((pk: any) =>
              pk.toBase58()
            ),
            createdAt: account.account.createdAt.toNumber(),
          }))
          .sort((a: any, b: any) => b.createdAt - a.createdAt); // 按时间倒序

        setContents(contentsData);
        setError(null);
      } catch (err: any) {
        console.error("获取内容列表失败:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContents();
  }, [program]);

  return { contents, loading, error, refresh: () => {} };
}
