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
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 对话框 */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* 渐变顶部装饰 */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600" />

        {/* 内容区 */}
        <div className="p-8 text-center">
          {/* 图标 */}
          <div className="mb-6 animate-bounce">
            <span className="text-7xl">{icon}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
            {title}
          </h3>

          {/* 消息 */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* 按钮 */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            确定
          </button>
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-4 right-4 opacity-10">
          <span className="text-6xl">✨</span>
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <span className="text-6xl">💫</span>
        </div>
      </div>
    </div>
  );
}

