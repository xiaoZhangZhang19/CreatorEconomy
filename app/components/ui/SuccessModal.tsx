"use client";

import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "操作成功",
  message = "操作已完成",
  icon = "🎉",
}: SuccessModalProps) {
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
      <div className="relative glass-card neon-border rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 渐变顶部装饰 - 霓虹效果 */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-glow"></div>

        {/* 扫描线效果 */}
        <div className="scan-lines absolute inset-0 pointer-events-none"></div>

        {/* 内容区 */}
        <div className="p-8 text-center relative z-10">
          {/* 图标 */}
          <div className="mb-6 animate-bounce">
            <span className="text-7xl drop-shadow-2xl">{icon}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-3xl font-extrabold text-cyan-300 mb-3 neon-glow-cyan">
            {title}
          </h3>

          {/* 消息 */}
          <p className="text-lg text-cyan-100/80 mb-8 leading-relaxed">
            {message}
          </p>

          {/* 按钮 */}
          <button
            onClick={onClose}
            className="w-full glass neon-border text-cyan-300 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:neon-glow-cyan transition-all focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            确定
          </button>
        </div>

        {/* 装饰元素 - 霓虹光球 */}
        <div className="absolute top-4 right-4 opacity-20 animate-float">
          <span className="text-6xl">✨</span>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20 animate-float animation-delay-2000">
          <span className="text-6xl">💫</span>
        </div>
        
        {/* 背景光晕 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      </div>
    </div>
  );
}
