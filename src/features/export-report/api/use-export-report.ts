import { useMutation } from "@tanstack/react-query";

export type ExportFormat = "csv" | "md" | "html" | "xlsx";

async function downloadReport(
  groupIds: string[],
  format: ExportFormat,
  path: string,
): Promise<void> {
  const params = new URLSearchParams({ format });
  if (groupIds.length > 0) params.set("groupIds", groupIds.join(","));

  const res = await fetch(`${path}?${params.toString()}`);
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

/**
 * Tải báo cáo cho các group đã chọn theo định dạng chỉ định.
 * `path` mặc định là endpoint có auth; public board truyền "/api/public/export".
 */
export function useExportReport(path = "/api/export") {
  return useMutation({
    mutationFn: (input: { groupIds: string[]; format: ExportFormat }) =>
      downloadReport(input.groupIds, input.format, path),
  });
}
