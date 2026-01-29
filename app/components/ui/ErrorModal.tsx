"use client";

import { useEffect } from "react";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  icon?: string;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "操作失败",
  message,
  icon = "😕",
}: ErrorModalProps) {
  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* 背景遮罩 - Space Tech */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{background: 'rgba(10, 10, 31, 0.9)'}}
        onClick={onClose}
      />

      {/* 对话框 - Space Tech */}
      <div className="relative glass-card rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
        style={{borderColor: 'rgba(255, 0, 110, 0.5)', boxShadow: '0 0 40px rgba(255, 0, 110, 0.3), inset 0 0 20px rgba(255, 0, 110, 0.1)'}}>
        {/* 渐变顶部装饰 - 红色/粉色主题 */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 animate-glow"></div>

        {/* 扫描线效果 */}
        <div className="scan-lines absolute inset-0 pointer-events-none"></div>

        {/* 内容区 */}
        <div className="p-8 text-center relative z-10">
          {/* 图标 */}
          <div className="mb-6">
            <span className="text-7xl drop-shadow-2xl">{icon}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-3xl font-extrabold text-pink-300 mb-3 neon-glow-pink">
            {title}
          </h3>

          {/* 消息 */}
          <p className="text-lg text-pink-100/80 mb-8 leading-relaxed">
            {message}
          </p>

          {/* 按钮 */}
          <button
            onClick={onClose}
            className="w-full glass text-pink-300 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-pink-500/50"
            style={{
              border: '1px solid rgba(255, 0, 110, 0.5)',
              boxShadow: '0 0 20px rgba(255, 0, 110, 0.3), inset 0 0 20px rgba(255, 0, 110, 0.1)'
            }}
          >
            我知道了
          </button>
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-4 right-4 opacity-20 animate-float">
          <span className="text-6xl">⚠️</span>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20 animate-float animation-delay-2000">
          <span className="text-6xl">❌</span>
        </div>
        
        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      </div>
    </div>
  );
}
