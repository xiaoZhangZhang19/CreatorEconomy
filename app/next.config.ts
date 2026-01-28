import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    
    // Ignore specific wallet adapters that cause issues
    config.externals = config.externals || [];
    config.externals.push({
      'pino-pretty': 'pino-pretty',
    });
    
    // Add ignore plugin for problematic wallet adapters
    config.ignoreWarnings = [
      { module: /node_modules\/pino/ },
    ];
    
    return config;
  },
  // Suppress hydration warnings
  reactStrictMode: false,
  
  // 优化代码分割和块加载
  experimental: {
    optimizePackageImports: ['@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
  },
  
  // 增加构建输出配置
  productionBrowserSourceMaps: false,
};

export default nextConfig;
