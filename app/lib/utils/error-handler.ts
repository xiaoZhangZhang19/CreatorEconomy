/**
 * 全局错误处理工具
 * 用于处理浏览器扩展（如 TronLink、MetaMask）引起的冲突
 */

/**
 * 检查是否是可以忽略的错误
 */
export function isIgnorableError(error: Error | string): boolean {
  const message = typeof error === "string" ? error : error.message || "";
  const errorName = typeof error === "object" ? error.name : "";

  const ignorablePatterns = [
    "tronlinkParams",
    "MetaMask",
    "_bn",
    "proxy",
    "Loading chunk",
    "ChunkLoadError",
  ];

  return ignorablePatterns.some(
    (pattern) =>
      message.includes(pattern) ||
      errorName.includes(pattern)
  );
}

/**
 * 初始化全局错误处理器（仅在客户端）
 */
export function initializeErrorHandlers() {
  if (typeof window === "undefined") return;

  // 处理未捕获的错误
  const originalErrorHandler = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (message && isIgnorableError(message.toString())) {
      return true; // 阻止错误传播
    }
    if (originalErrorHandler) {
      return originalErrorHandler.apply(this, arguments as any);
    }
    return false;
  };

  // 处理未处理的 Promise 拒绝
  window.addEventListener("unhandledrejection", function (event) {
    if (event.reason && isIgnorableError(event.reason)) {
      event.preventDefault();
    }
  });

  console.log("✅ 全局错误处理器已初始化");
}

