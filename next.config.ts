import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Font TTF dùng cho báo cáo PNG (Satori) được đọc bằng fs lúc runtime nên
  // phải ép nó vào bundle của serverless function, không thì Vercel trả 500
  // ENOENT dù local chạy bình thường.
  outputFileTracingIncludes: {
    "/api/export": ["./assets/fonts/**"],
  },
};

export default nextConfig;
