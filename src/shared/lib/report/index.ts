// Chỉ dùng phía server. Kết xuất báo cáo nợ ra HTML hoặc ảnh PNG.
import type { GroupWithRecordsDto } from "@/shared/types/debt";
import type { ReportFormat } from "@/shared/types/report";

import { fmtDate, grandTotal, isCredit, numberFmt, stamp } from "./format";

export type { ReportFormat };

export type RenderedReport = {
  body: string | Uint8Array;
  contentType: string;
  filename: string;
};

// ── HTML ───────────────────────────────────────────────────────────────
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Class cho ô số tiền — khoản âm (cấn trừ) tô xanh. */
function numClass(amount: number): string {
  return isCredit(amount) ? "num credit" : "num";
}

function toHtml(groups: GroupWithRecordsDto[]): string {
  const sections = groups
    .map((g) => {
      const rows =
        g.records.length === 0
          ? `<tr><td colspan="3" class="muted">(không có khoản nợ)</td></tr>`
          : g.records
              .map(
                (r) =>
                  `<tr><td class="${numClass(r.amount)}">${numberFmt.format(
                    r.amount,
                  )}</td><td>${esc(r.note ?? "")}</td><td>${esc(
                    fmtDate(r.createdAt),
                  )}</td></tr>`,
              )
              .join("");
      return `<h2>${esc(g.name)}</h2>
<table>
  <thead><tr><th class="num">Số tiền (VND)</th><th>Ghi chú</th><th>Ngày ghi nợ</th></tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr><td class="${numClass(g.total)} total">${numberFmt.format(
    g.total,
  )}</td><td colspan="2">Tổng nhóm</td></tr></tfoot>
</table>`;
    })
    .join("\n");

  const total = grandTotal(groups);

  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<title>Báo cáo ghi nợ</title>
<style>
  body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:800px;margin:24px auto;padding:0 16px;color:#111}
  h1{font-size:22px} h2{font-size:16px;margin-top:24px}
  table{border-collapse:collapse;width:100%;margin-top:8px;font-size:14px}
  th,td{border:1px solid #ddd;padding:6px 10px;text-align:left}
  th{background:#f5f5f5}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  .total{font-weight:600}
  .credit{color:#00763a}
  .muted{color:#888;text-align:center}
  .grand{margin-top:24px;font-size:16px;font-weight:700}
</style></head>
<body>
<h1>Báo cáo ghi nợ</h1>
${sections}
<p class="grand${isCredit(total) ? " credit" : ""}">TỔNG CỘNG: ${numberFmt.format(
    total,
  )} ₫</p>
</body></html>`;
}

const META: Record<ReportFormat, { contentType: string; ext: string }> = {
  html: { contentType: "text/html; charset=utf-8", ext: "html" },
  png: { contentType: "image/png", ext: "png" },
};

/** Kết xuất báo cáo theo định dạng yêu cầu. */
export async function renderReport(
  groups: GroupWithRecordsDto[],
  format: ReportFormat,
): Promise<RenderedReport> {
  const { contentType, ext } = META[format];
  const filename = `bao-cao-no-${stamp()}.${ext}`;
  let body: string | Uint8Array;
  switch (format) {
    case "html":
      body = toHtml(groups);
      break;
    case "png": {
      // Nạp động: request HTML không phải khởi tạo wasm của next/og.
      const { renderPng } = await import("./ReportImage");
      body = await renderPng(groups);
      break;
    }
  }
  return { body, contentType, filename };
}
