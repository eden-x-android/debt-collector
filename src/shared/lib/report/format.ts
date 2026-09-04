// Formatter dùng chung cho mọi định dạng báo cáo (text + ảnh).
// File này không phụ thuộc gì nên index.ts và ReportImage.tsx đều import được
// mà không tạo circular import.
import type { GroupWithRecordsDto } from "@/shared/types/debt";

const dateFmt = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const numberFmt = new Intl.NumberFormat("vi-VN");

export function fmtDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function grandTotal(groups: GroupWithRecordsDto[]): number {
  return groups.reduce((sum, g) => sum + g.total, 0);
}

/** Khoản âm = cấn trừ, làm giảm nợ. Dùng để tô màu khác trong báo cáo. */
export function isCredit(amount: number): boolean {
  return amount < 0;
}

export function stamp(): string {
  // Ngày cho tên file, theo giờ VN: YYYYMMDD
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts.replace(/-/g, "");
}

/** Ngày/giờ xuất báo cáo, hiển thị trên ảnh PNG. */
export function nowLabel(): string {
  return dateFmt.format(new Date());
}

// Dải ký tự pictographic/emoji. Dùng code point tường minh vì \p{...} cần
// target >= ES2018 (tsconfig đang ES2017).
const PICTOGRAPHIC =
  /[←-⇿⌀-➿⬀-⯿️\u{1F000}-\u{1FAFF}]/gu;

/**
 * Chuẩn hoá chuỗi trước khi vẽ lên ảnh: bỏ emoji (Satori phải fetch CDN
 * twemoji cho mỗi emoji → chậm và fail nếu lambda bị chặn network), gộp
 * khoảng trắng, và cắt độ dài (Satori không được cho wrap vì sẽ làm dòng cao
 * hơn ROW_H và lệch toàn bộ công thức chiều cao).
 */
export function sanitizeText(value: string, max: number): string {
  const clean = value.replace(PICTOGRAPHIC, "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}
