"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    // 检查是否是可忽略的错误
    const ignorablePatterns = [
      "tronlinkParams",
      "tronLink",
      "tron",
      "MetaMask",
      "_bn",
      "proxy",
      "trap returned falsish",
      "trap returned",
      "Loading chunk",
      "ChunkLoadError",
      "User rejected",
      "User cancelled",
      "wallet-standard",
    ];

    const errorMessage = error.message?.toLowerCase() || "";
    const errorName = error.name?.toLowerCase() || "";

    const isIgnorable = ignorablePatterns.some((pattern) =>
      errorMessage.includes(pattern.toLowerCase()) ||
      errorName.includes(pattern.toLowerCase())
    );

    if (isIgnorable) {
      return { hasError: false, error: undefined, errorCount: 0 };
    }

    return { hasError: true, error, errorCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 忽略钱包相关的已知错误和块加载错误
    const ignorablePatterns = [
      "tronlinkParams",
      "tronLink",
      "tron",
      "MetaMask",
      "_bn",
      "proxy",
      "trap returned falsish",
      "trap returned",
      "Loading chunk",
      "ChunkLoadError",
      "User rejected",
      "User cancelled",
      "wallet-standard",
    ];

    const errorMessage = error.message?.toLowerCase() || "";
    const errorName = error.name?.toLowerCase() || "";

    const isIgnorable = ignorablePatterns.some((pattern) =>
      errorMessage.includes(pattern.toLowerCase()) ||
      errorName.includes(pattern.toLowerCase())
    );

    if (isIgnorable) {
      this.setState({ hasError: false, error: undefined });
      
      // 如果是块加载错误，尝试重新加载页面
      if (
        error.message?.includes("Loading chunk") ||
        error.name === "ChunkLoadError"
      ) {
        console.warn("检测到块加载错误，建议刷新页面");
      }
      return;
    }

    console.error("Error boundary caught:", error, errorInfo);

    // 如果错误太频繁，自动刷新页面
    const newErrorCount = this.state.errorCount + 1;
    this.setState({ errorCount: newErrorCount });

    if (newErrorCount >= 3) {
      console.warn("检测到多个错误，自动刷新页面...");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-red-600 mb-4">出错了</h2>
              <p className="text-gray-700 mb-4">
                应用遇到了一个错误，请刷新页面重试。
              </p>
              {this.state.error && (
                <details className="mb-4 text-sm text-gray-600">
                  <summary className="cursor-pointer hover:text-gray-800">
                    错误详情
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                刷新页面
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

