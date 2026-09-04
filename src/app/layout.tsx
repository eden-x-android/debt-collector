import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./query-provider";

// Liquid Glass được thiết kế quanh SF Pro. SF Pro không phát hành trên Google
// Fonts, nên --font-sans (xem globals.css) ưu tiên -apple-system để lấy SF thật
// trên iPhone/Mac, và rơi về Inter ở nơi khác — Inter là bản gần SF nhất và có
// đủ dấu tiếng Việt.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "Ghi nợ — Debt Collector",
  description: "Quản lý ghi nợ theo nhóm",
  icons: { icon: "/assets/icon.svg" },
};

// Chạy trước khi hydrate để set theme ngay, tránh nháy sáng→tối.
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
