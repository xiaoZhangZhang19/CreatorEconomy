import type { Metadata } from "next";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClientInitializer } from "@/components/ClientInitializer";
import { Header } from "@/components/Header";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Creator Economy - 创作者经济平台",
  description: "基于 Solana 的创作者经济平台，支持早期支持者分成机制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 防止浏览器扩展（如 TronLink、MetaMask 等）导致的冲突和错误
              (function() {
                // 忽略的错误模式列表
                const ignoredPatterns = [
                  'tronlinkParams',
                  'tronLink',
                  'MetaMask',
                  '_bn',
                  'proxy',
                  'trap returned falsish',
                  'Loading chunk',
                  'ChunkLoadError',
                  'wallet-standard',
                  'User rejected',
                  'User cancelled',
                  'Hydration',
                ];
                
                // 检查是否应该忽略错误
                function shouldIgnoreError(message) {
                  if (!message) return false;
                  const messageStr = message.toString().toLowerCase();
                  return ignoredPatterns.some(pattern => 
                    messageStr.includes(pattern.toLowerCase())
                  );
                }

                // 全局错误处理器
                const originalErrorHandler = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (shouldIgnoreError(message)) {
                    console.debug('已忽略的扩展错误:', message);
                    return true; // 阻止错误传播
                  }
                  if (originalErrorHandler) {
                    return originalErrorHandler.apply(this, arguments);
                  }
                  return false;
                };

                // 捕获未处理的 Promise 拒绝
                window.addEventListener('unhandledrejection', function(event) {
                  const message = event.reason?.message || event.reason?.toString() || '';
                  if (shouldIgnoreError(message)) {
                    console.debug('已忽略的 Promise 错误:', message);
                    event.preventDefault();
                  }
                });

                // 增强的 Proxy 保护
                try {
                  const OriginalProxy = window.Proxy;
                  window.Proxy = new Proxy(OriginalProxy, {
                    construct(target, args) {
                      const [targetObj, handler] = args;
                      
                      // 包装 set trap 以确保总是返回 true
                      if (handler && handler.set) {
                        const originalSet = handler.set;
                        handler.set = function(obj, prop, value, receiver) {
                          try {
                            const result = originalSet.call(this, obj, prop, value, receiver);
                            // 强制返回 true，防止 "trap returned falsish" 错误
                            return result === false ? true : result;
                          } catch (e) {
                            console.debug('Proxy set trap 错误已捕获:', prop, e);
                            return true;
                          }
                        };
                      }
                      
                      return Reflect.construct(target, args);
                    }
                  });
                } catch (e) {
                  console.debug('Proxy 包装失败:', e);
                }

                // 防止扩展修改 Object.defineProperty
                try {
                  const originalDefineProperty = Object.defineProperty;
                  const nativeCode = originalDefineProperty.toString();
                  
                  Object.defineProperty = function(obj, prop, descriptor) {
                    // 拦截可能导致问题的属性设置
                    if (prop === 'tronlinkParams' || prop === '_bn' || prop === 'tronLink') {
                      try {
                        return originalDefineProperty.call(this, obj, prop, {
                          ...descriptor,
                          configurable: true,
                          writable: true,
                        });
                      } catch (e) {
                        console.debug('defineProperty 错误已捕获:', prop, e);
                        return obj;
                      }
                    }
                    return originalDefineProperty.call(this, obj, prop, descriptor);
                  };
                  
                  // 保持 native code 标识
                  try {
                    Object.defineProperty(Object.defineProperty, 'toString', {
                      value: function() { return nativeCode; }
                    });
                  } catch (e) {
                    // 忽略
                  }
                } catch (e) {
                  console.debug('defineProperty 包装失败:', e);
                }

                console.log('✅ 浏览器扩展冲突防护已启用');
              })();
            `,
          }}
        />
      </head>
      <body>
        <ClientInitializer />
        <ErrorBoundary>
          <WalletProvider>
            <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-gray-500 text-sm">
                  <p>
                    © 2024 Creator Economy - 基于 Solana 的创作者经济平台
                  </p>
                  <p className="mt-2">
                    早期支持者分成机制 | 低费用微支付 | 链上存储
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
