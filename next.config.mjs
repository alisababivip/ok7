// const TerserPlugin = require('terser-webpack-plugin');
import TerserPlugin from "terser-webpack-plugin";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import JavaScriptObfuscator from "webpack-obfuscator";
/** @type {import('next').NextConfig} */
let nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false, // Tắt để tránh conflicts với custom plugins
    cpus: 1, // Giảm CPU usage để ổn định
    webpackBuildWorker: false, // Tắt để tránh DataCloneError với custom plugins
    // Tắt parallel options khi không dùng workers
    // parallelServerCompiles: false,
    // parallelServerBuildTraces: false,
  },
  reactStrictMode: false,
  trailingSlash: false,
  images: {
    loader: "custom",
    loaderFile: "./jsdevlivr.js",
    minimumCacheTTL: 43200,
  },
  async rewrites() {
    return [
      {
        source: "/account/:path*",
        destination: "/src/app/account/:path*", 
      },
      {
        source: "/api/:path*",
        destination: "https://betapi.spaceplus.live/api/:path*",
      },
    ];
  },
  productionBrowserSourceMaps: false,
  webpack(config, { isServer, webpack }) {
    // Chỉ áp dụng optimization cho client-side production build
    if (!isServer && process.env.NODE_ENV === "production") {
      // Cấu hình TerserPlugin an toàn hơn
      config.optimization.minimizer.push(
        new TerserPlugin({
          parallel: false, // Tắt parallel để tránh worker issues
          terserOptions: {
            compress: {
              drop_console: true, // Xóa console.log trong production
              drop_debugger: true,
            },
            mangle: true,
            format: {
              comments: false, // Xóa comments
            },
          },
          extractComments: false,
        })
      );

      // Cấu hình JavaScriptObfuscator cẩn thận hơn
      try {
        config.plugins.push(
          new JavaScriptObfuscator(
            {
              rotateStringArray: true,
              stringArray: true,
              stringArrayThreshold: 0.5, // Giảm từ 0.75 để tránh quá tải
              splitStrings: true,
              simplify: true,
              compact: true,
              controlFlowFlattening: false, // Tắt để tránh lỗi
              deadCodeInjection: false, // Tắt để tránh lỗi
            },
            ["**/node_modules/**"] // Exclude node_modules
          )
        );
      } catch (error) {
        console.warn("JavaScript obfuscation disabled due to error:", error.message);
      }
    }

    // Server-side configuration
    if (isServer) {
      config.resolve.alias["fs"] = false;
      config.resolve.alias["net"] = false;
      config.resolve.alias["tls"] = false;
    }

    return config;
  },
};
// Cấu hình cho development
if (process.env.NODE_ENV === "development") {
  try {
    await setupDevPlatform();
  } catch (error) {
    console.warn("Cloudflare setup failed:", error.message);
  }
  
  // Thêm remotePatterns cho images
  nextConfig.images.remotePatterns = [
    {
      protocol: "https",
      hostname: "cdn.jsdelivr.net",
      pathname: "**",
    },
    {
      protocol: "https", 
      hostname: "gwfd.qatgwawm.net",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "qk3x72.katawee.net",
      pathname: "**", 
    },
    {
      protocol: "https",
      hostname: "via.placeholder.com",
      pathname: "**",
    },
  ];
}

export default nextConfig;
