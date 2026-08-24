// Chỉ dùng phía server. Kết xuất báo cáo nợ ra nhiều định dạng.
import * as XLSX from "xlsx";

import type { GroupWithRecordsDto } from "@/shared/types/debt";
import type { ReportFormat } from "@/shared/types/report";

import {
  HEADERS,
  fmtDate,
  grandTotal,
  isCredit,
  numberFmt,
  stamp,
} from "./format";

export type { ReportFormat };

export type RenderedReport = {
  body: string | Uint8Array;
  contentType: string;
  filename: string;
};

// ── CSV ────────────────────────────────────────────────────────────────
function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv(groups: GroupWithRecordsDto[]): string {
  const lines: string[] = [HEADERS.join(",")];
  for (const g of groups) {
    for (const r of g.records) {
      lines.push(
        [g.name, String(r.amount), r.note ?? "", fmtDate(r.createdAt)]
          .map(csvEscape)
          .join(","),
      );
    }
    lines.push([`${g.name} — Tổng`, String(g.total), "", ""].map(csvEscape).join(","));
  }
  lines.push(["TỔNG CỘNG", String(grandTotal(groups)), "", ""].map(csvEscape).join(","));
  // BOM để Excel mở UTF-8 (tiếng Việt) đúng.
  return "﻿" + lines.join("\r\n");
}

// ── Markdown ───────────────────────────────────────────────────────────
function toMarkdown(groups: GroupWithRecordsDto[]): string {
  const out: string[] = ["# Báo cáo ghi nợ", ""];
  for (const g of groups) {
    out.push(`## ${g.name}`, "");
    out.push("| Số tiền (VND) | Ghi chú | Ngày ghi nợ |");
    out.push("| ---: | --- | --- |");
    if (g.records.length === 0) {
      out.push("| _(không có khoản nợ)_ | | |");
    }
    for (const r of g.records) {
      out.push(
        `| ${numberFmt.format(r.amount)} | ${r.note ?? ""} | ${fmtDate(r.createdAt)} |`,
      );
    }
    out.push("", `**Tổng nhóm ${g.name}: ${numberFmt.format(g.total)} ₫**`, "");
  }
  out.push(`---`, "", `**TỔNG CỘNG: ${numberFmt.format(grandTotal(groups))} ₫**`, "");
  return out.join("\n");
}

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
  .credit{color:#15803d}
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

// ── XLSX ───────────────────────────────────────────────────────────────
function toXlsx(groups: GroupWithRecordsDto[]): Uint8Array {
  const aoa: (string | number)[][] = [[...HEADERS]];
  for (const g of groups) {
    for (const r of g.records) {
      aoa.push([g.name, r.amount, r.note ?? "", fmtDate(r.createdAt)]);
    }
    aoa.push([`${g.name} — Tổng`, g.total, "", ""]);
  }
  aoa.push(["TỔNG CỘNG", grandTotal(groups), "", ""]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 22 }, { wch: 16 }, { wch: 30 }, { wch: 18 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bao cao");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as Uint8Array;
}

const META: Record<ReportFormat, { contentType: string; ext: string }> = {
  csv: { contentType: "text/csv; charset=utf-8", ext: "csv" },
  md: { contentType: "text/markdown; charset=utf-8", ext: "md" },
  html: { contentType: "text/html; charset=utf-8", ext: "html" },
  xlsx: {
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: "xlsx",
  },
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
    case "csv":
      body = toCsv(groups);
      break;
    case "md":
      body = toMarkdown(groups);
      break;
    case "html":
      body = toHtml(groups);
      break;
    case "xlsx":
      body = toXlsx(groups);
      break;
    case "png": {
      // Nạp động: request csv/xlsx không phải khởi tạo wasm của next/og.
      const { renderPng } = await import("./ReportImage");
      body = await renderPng(groups);
      break;
    }
  }
  return { body, contentType, filename };
}
