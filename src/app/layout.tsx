import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./query-provider";

// Neobrutalism cần mặt chữ giống hệt nhau trên mọi máy, nên --font-sans (xem
// globals.css) dùng thẳng Inter thay vì ưu tiên font hệ thống như bản trước.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

// Tiêu đề dùng grotesk đậm cho đúng chất neobrutalism. Chỉ nạp weight 700 —
// font này không dùng cho body nên không cần dải weight. Subset "vietnamese"
// là bắt buộc: thiếu nó thì chữ có dấu rơi về font fallback và tiêu đề sẽ lẫn
// hai mặt chữ trong cùng một dòng.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["700"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
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
