import { useMutation } from "@tanstack/react-query";

import type { ReportFormat } from "@/shared/types/report";

/**
 * Bản xem trước đã tải xong. HTML giữ nguyên chuỗi để nhồi vào `srcDoc` của
 * iframe (không cần blob URL); PNG phải qua object URL và bên gọi có trách
 * nhiệm revoke khi không dùng nữa — xem `revokePreview`.
 */
export type ReportPreview =
  | { format: "html"; html: string }
  | { format: "png"; url: string };

export function revokePreview(preview: ReportPreview | null): void {
  if (preview?.format === "png") URL.revokeObjectURL(preview.url);
}

async function fetchPreview(
  groupIds: string[],
  format: ReportFormat,
): Promise<ReportPreview> {
  const params = new URLSearchParams({ format });
  if (groupIds.length > 0) params.set("groupIds", groupIds.join(","));

  const res = await fetch(`/api/export?${params.toString()}`);
  if (!res.ok) {
    let message = "Không tạo được bản xem trước";
    try {
      const j = await res.json();
      if (j?.error) message = j.error;
    } catch {
      // giữ message mặc định
    }
    throw new Error(message);
  }

  if (format === "html") {
    return { format: "html", html: await res.text() };
  }
  return { format: "png", url: URL.createObjectURL(await res.blob()) };
}

/**
 * Lấy báo cáo để xem tại chỗ thay vì tải về. Dùng chung endpoint với
 * useExportReport — header Content-Disposition của nó vô hại khi đọc bằng fetch.
 */
export function usePreviewReport() {
  return useMutation({
    mutationFn: (input: { groupIds: string[]; format: ReportFormat }) =>
      fetchPreview(input.groupIds, input.format),
  });
}
