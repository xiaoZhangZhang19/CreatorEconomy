"use client";

import { useEffect } from "react";

/**
 * 客户端初始化组件
 * 处理浏览器扩展冲突和其他客户端特定的初始化逻辑
 */
export function ClientInitializer() {
  useEffect(() => {
    // 防止浏览器扩展干扰
    const protectFromExtensions = () => {
      try {
        // 防止某些扩展注入的属性导致错误
        const problemProperties = [
          "tronlinkParams",
          "tronLink",
          "_bn",
          "ethereum", // MetaMask
        ];

        problemProperties.forEach((prop) => {
          try {
            // 先检查属性是否存在
            const existingValue = (window as any)[prop];
            
            // 创建一个安全的存储位置
            const backupKey = `_safe_${prop}_backup`;
            if (existingValue !== undefined) {
              (window as any)[backupKey] = existingValue;
            }

            // 尝试删除原有属性（如果可能）
            try {
              delete (window as any)[prop];
            } catch (e) {
              // 无法删除，继续
            }

            // 重新定义属性，使用安全的 setter/getter
            try {
              Object.defineProperty(window, prop, {
                get() {
                  return (window as any)[backupKey];
                },
                set(value) {
                  try {
                    (window as any)[backupKey] = value;
                    return true; // 成功设置
                  } catch (e) {
                    // 静默处理设置错误
                    return false;
                  }
                },
                configurable: true,
                enumerable: false, // 设为不可枚举，减少被检测
              });
            } catch (e) {
              // 如果无法重新定义，尝试简单赋值
              try {
                (window as any)[prop] = existingValue;
              } catch (e2) {
                // 完全失败，静默处理
              }
            }
          } catch (e) {
            // 静默失败
            console.debug(`无法处理属性 ${prop}:`, e);
          }
        });

        // 额外的代理保护：拦截 Proxy 相关错误
        const originalProxy = window.Proxy;
        if (originalProxy) {
          try {
            (window as any).Proxy = new Proxy(originalProxy, {
              construct(target, args) {
                if (args[1] && args[1].set) {
                  const originalSet = args[1].set;
                  args[1].set = function(target: any, prop: any, value: any, receiver: any) {
                    try {
                      const result = originalSet.call(this, target, prop, value, receiver);
                      // 确保始终返回 truthy 值
                      return result !== false;
                    } catch (e) {
                      // 静默处理代理错误
                      return true;
                    }
                  };
                }
                return Reflect.construct(target, args);
              },
            });
          } catch (e) {
            // 无法包装 Proxy，恢复原始值
            (window as any).Proxy = originalProxy;
          }
        }
      } catch (e) {
        console.debug("扩展保护初始化失败:", e);
      }
    };

    // 立即执行
    protectFromExtensions();

    // 监听 DOM 加载完成后再次执行
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", protectFromExtensions);
    }

    // 定期检查和修复（防止扩展后续注入）
    const intervalId = setInterval(protectFromExtensions, 1000);

    console.log("✅ 客户端初始化完成");

    return () => {
      document.removeEventListener("DOMContentLoaded", protectFromExtensions);
      clearInterval(intervalId);
    };
  }, []);

  return null; // 这个组件不渲染任何内容
}

