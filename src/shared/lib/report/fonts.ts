// Nạp font TTF cho Satori (next/og). Chỉ chạy phía server, Node runtime.
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Phải khớp chính xác với fontFamily dùng trong ReportImage.tsx. */
export const REPORT_FONT_FAMILY = "Be Vietnam Pro";

type ReportFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
};

// Font nằm ở assets/fonts (không phải public/) vì trên Vercel thư mục public
// đi lên CDN và không đảm bảo có trong filesystem của serverless function.
// next.config.ts khai báo outputFileTracingIncludes để file được đóng gói kèm.
const FONT_DIR = path.join(process.cwd(), "assets", "fonts");

let cached: Promise<ReportFont[]> | null = null;

async function read(): Promise<ReportFont[]> {
  const [regular, bold] = await Promise.all([
    readFile(path.join(FONT_DIR, "BeVietnamPro-Regular.ttf")),
    readFile(path.join(FONT_DIR, "BeVietnamPro-Bold.ttf")),
  ]);
  // Cần cả 2 weight: Satori không tự làm faux-bold, thiếu 700 thì tiêu đề và
  // dòng tổng mất phân cấp.
  return [
    { name: REPORT_FONT_FAMILY, data: regular, weight: 400, style: "normal" },
    { name: REPORT_FONT_FAMILY, data: bold, weight: 700, style: "normal" },
  ];
}

/**
 * Đọc font một lần rồi cache theo module (tái dùng khi lambda còn nóng).
 * Cache promise thay vì buffer để 2 request đồng thời không cùng đọc đĩa;
 * lỗi thì reset cache để lần sau thử lại.
 */
export function loadReportFonts(): Promise<ReportFont[]> {
  if (!cached) {
    cached = read().catch((err) => {
      cached = null;
      throw err;
    });
  }
  return cached;
}
