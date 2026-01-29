"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 错误抑制器组件
 * 用于拦截和静默特定的浏览器扩展相关错误
 */
export function ErrorSuppressor() {
  const pathname = usePathname();
  
  useEffect(() => {
    // 错误检查函数
    const shouldSuppress = (message: string) => {
      return (
        message.includes('MetaMask') ||
        message.includes('same key') ||
        message.includes('Encountered two children') ||
        message.includes('tronLink') ||
        message.includes('tronlinkParams') ||
        message.includes('trap returned falsish') ||
        message.includes('trap returned') ||
        message.includes('chrome-extension') ||
        message.includes('ibnejdfjmmkpcnlpebklmnkoeoihofec')
      );
    };
    
    // 劫持console.error
    const originalError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      if (shouldSuppress(message)) {
        return; // 完全静默
      }
      return originalError.apply(console, args);
    };
    
    // 劫持window.onerror
    const handleError = (event: ErrorEvent) => {
      const message = event.message || '';
      const filename = event.filename || '';
      
      if (shouldSuppress(message) || filename.includes('chrome-extension')) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
      return false;
    };
    
    window.addEventListener('error', handleError, true);
    
    // 持续监控并移除Next.js错误覆盖层
    const removeErrorOverlay = () => {
      const overlays = document.querySelectorAll('nextjs-portal');
      overlays.forEach(overlay => {
        const text = overlay.textContent || '';
        if (shouldSuppress(text)) {
          overlay.remove();
        }
      });
    };
    
    // 使用MutationObserver监控DOM变化
    const observer = new MutationObserver(() => {
      removeErrorOverlay();
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    // 每100ms检查一次
    const interval = setInterval(removeErrorOverlay, 100);
    
    // 清理函数
    return () => {
      console.error = originalError;
      window.removeEventListener('error', handleError, true);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [pathname]); // 依赖pathname，确保路由切换时重新执行
  
  return null;
}
