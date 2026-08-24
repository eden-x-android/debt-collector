import { useMutation } from "@tanstack/react-query";

import type { ReportFormat } from "@/shared/types/report";

async function downloadReport(
  groupIds: string[],
  format: ReportFormat,
): Promise<void> {
  const params = new URLSearchParams({ format });
  if (groupIds.length > 0) params.set("groupIds", groupIds.join(","));

  const res = await fetch(`/api/export?${params.toString()}`);
  if (!res.ok) {
    let message = "Xuất báo cáo thất bại";
    try {
      const j = await res.json();
      if (j?.error) message = j.error;
    } catch {
      // giữ message mặc định
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? `bao-cao.${format}`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Tải báo cáo cho các group đã chọn theo định dạng chỉ định. */
export function useExportReport() {
  return useMutation({
    mutationFn: (input: { groupIds: string[]; format: ReportFormat }) =>
      downloadReport(input.groupIds, input.format),
  });
}
