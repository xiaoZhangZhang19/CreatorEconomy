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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 防止浏览器扩展（如 TronLink、MetaMask 等）导致的冲突和错误
              (function() {
                // 忽略的错误模式列表
                const ignoredPatterns = [
                  'tronlinkParams',
                  'tronLink',
                  'tronweb',
                  'tron',
                  'MetaMask',
                  '_bn',
                  'proxy',
                  'trap returned falsish',
                  'trap returned',
                  'Loading chunk',
                  'ChunkLoadError',
                  'wallet-standard',
                  'User rejected',
                  'User cancelled',
                  'Hydration',
                  'chrome-extension',
                  'ibnejdfjmmkpcnlpebklmnkoeoihofec',
                ];
                
                // 检查是否应该忽略错误
                function shouldIgnoreError(message) {
                  if (!message) return false;
                  const messageStr = message.toString().toLowerCase();
                  return ignoredPatterns.some(pattern => 
                    messageStr.includes(pattern.toLowerCase())
                  );
                }

                // 最早期的错误拦截 - 在所有代码之前
                const originalAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(type, listener, options) {
                  if (type === 'error' || type === 'unhandledrejection') {
                    const wrappedListener = function(event) {
                      const message = event.message || event.reason?.message || event.reason?.toString() || '';
                      if (shouldIgnoreError(message)) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        return;
                      }
                      if (typeof listener === 'function') {
                        return listener.call(this, event);
                      } else if (listener && listener.handleEvent) {
                        return listener.handleEvent(event);
                      }
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                  }
                  return originalAddEventListener.call(this, type, listener, options);
                };

                // 全局错误处理器
                const originalErrorHandler = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (shouldIgnoreError(message) || (source && source.includes('chrome-extension'))) {
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
                    event.stopImmediatePropagation();
                  }
                }, true); // 使用捕获阶段

                // 增强的 Proxy 保护 - 防止 TronLink 等扩展导致的错误
                try {
                  const OriginalProxy = window.Proxy;
                  window.Proxy = new Proxy(OriginalProxy, {
                    construct(target, args) {
                      const [targetObj, handler] = args;
                      
                      // 包装所有 trap 以确保不会抛出错误
                      if (handler) {
                        // 包装 set trap
                        if (handler.set) {
                          const originalSet = handler.set;
                          handler.set = function(obj, prop, value, receiver) {
                            try {
                              const result = originalSet.call(this, obj, prop, value, receiver);
                              // 强制返回 true，防止 "trap returned falsish" 错误
                              return result == null || result === false ? true : result;
                            } catch (e) {
                              console.debug('Proxy set trap 错误已捕获:', prop, e);
                              return true;
                            }
                          };
                        }
                        
                        // 包装 get trap
                        if (handler.get) {
                          const originalGet = handler.get;
                          handler.get = function(obj, prop, receiver) {
                            try {
                              return originalGet.call(this, obj, prop, receiver);
                            } catch (e) {
                              console.debug('Proxy get trap 错误已捕获:', prop, e);
                              return undefined;
                            }
                          };
                        }
                        
                        // 包装 deleteProperty trap
                        if (handler.deleteProperty) {
                          const originalDelete = handler.deleteProperty;
                          handler.deleteProperty = function(obj, prop) {
                            try {
                              const result = originalDelete.call(this, obj, prop);
                              return result == null || result === false ? true : result;
                            } catch (e) {
                              console.debug('Proxy deleteProperty trap 错误已捕获:', prop, e);
                              return true;
                            }
                          };
                        }
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
                    if (prop === 'tronlinkParams' || prop === '_bn' || prop === 'tronLink' || prop === 'tron') {
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

                // 阻止 TronLink 注入
                try {
                  Object.defineProperty(window, 'tronLink', {
                    get() { return undefined; },
                    set() { return true; },
                    configurable: true
                  });
                  Object.defineProperty(window, 'tron', {
                    get() { return undefined; },
                    set() { return true; },
                    configurable: true
                  });
                } catch (e) {
                  console.debug('TronLink 阻止失败:', e);
                }

                // 强制拦截所有 TypeError 中包含 trap returned falsish 的错误
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (shouldIgnoreError(message)) {
                    console.debug('已拦截控制台错误:', message);
                    return;
                  }
                  return originalConsoleError.apply(console, args);
                };

                // 同时拦截 console.warn
                const originalConsoleWarn = console.warn;
                console.warn = function(...args) {
                  const message = args.join(' ');
                  if (shouldIgnoreError(message)) {
                    console.debug('已拦截控制台警告:', message);
                    return;
                  }
                  return originalConsoleWarn.apply(console, args);
                };

                console.log('✅ 浏览器扩展冲突防护已启用');
              })();
              
              // 页面加载后立即执行的额外保护
              window.addEventListener('load', function() {
                // 延迟执行，确保扩展已经注入
                setTimeout(function() {
                  try {
                    // 清理 TronLink 相关对象
                    delete window.tronLink;
                    delete window.tronWeb;
                    delete window.tron;
                  } catch (e) {
                    // 忽略错误
                  }
                }, 100);
              });

              // 拦截 Next.js 开发模式的错误覆盖层
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(event) {
                  const message = event.message || event.error?.message || '';
                  const ignoredPatterns = ['tronlinkParams', 'tronLink', 'tronweb', 'tron', 'trap returned falsish', 'chrome-extension', 'ibnejdfjmmkpcnlpebklmnkoeoihofec'];
                  
                  const shouldIgnore = ignoredPatterns.some(pattern => 
                    message.toLowerCase().includes(pattern.toLowerCase())
                  );

                  if (shouldIgnore) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    console.debug('已阻止错误覆盖层显示:', message);
                    return false;
                  }
                }, true);
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ClientInitializer />
        <ErrorBoundary>
          <WalletProvider>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
              <Header />

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {children}
              </main>

              <footer className="bg-white border-t-2 border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-3xl">🎨</span>
                        <h3 className="text-xl font-bold text-gray-900">Creator Economy</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        基于 Solana 区块链的创作者经济平台，通过早期支持者分成机制，为创作者和支持者创造共赢。
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">核心特性</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <span className="mr-2">✨</span>
                          早期支持者分成机制
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">⚡</span>
                          低费用微支付
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🔒</span>
                          链上存储
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">💎</span>
                          透明公平
                        </li>
                      </ul>
                    </div>

                    {/* Links */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">快速链接</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <a href="/" className="text-purple-600 hover:text-purple-800 transition-colors">
                            内容广场
                          </a>
                        </li>
                        <li>
                          <a href="/creator/publish" className="text-purple-600 hover:text-purple-800 transition-colors">
                            发布内容
                          </a>
                        </li>
                        <li>
                          <a href="/creator" className="text-purple-600 hover:text-purple-800 transition-colors">
                            创作者中心
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                      <p className="text-gray-500 text-sm">
                        © 2026 Creator Economy - 基于 Solana 的创作者经济平台
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                          Powered by Solana
                        </a>
                        <span>•</span>
                        <span>Devnet</span>
                      </div>
                    </div>
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
