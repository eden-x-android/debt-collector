/**
 * Định dạng xuất báo cáo — nguồn duy nhất cho cả client và server.
 * Đặt ở shared/types (không phải shared/lib/report) vì module đó là server-only
 * (import `next/og`), client không được kéo vào bundle.
 */

export const REPORT_FORMATS = ["html", "png"] as const;

export type ReportFormat = (typeof REPORT_FORMATS)[number];
