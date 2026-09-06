"use client";

import { ArrowLeft, Eye, FileDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useGroups } from "@/entities/group";
import { type ReportFormat } from "@/shared/types/report";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Spinner } from "@/shared/ui/spinner";

import { useExportReport } from "../api/use-export-report";
import {
  revokePreview,
  usePreviewReport,
  type ReportPreview,
} from "../api/use-preview-report";
import { ExportOptions } from "./ExportOptions";
import { ReportPreviewPane } from "./ReportPreviewPane";

/** Nút "Xuất báo cáo" + dialog chọn nhóm/định dạng, kèm chế độ xem trước. */
export function ExportReport() {
  const { data: groups } = useGroups();
  const [open, setOpen] = useState(false);
  const exportReport = useExportReport();
  const previewReport = usePreviewReport();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<ReportFormat>("png");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReportPreview | null>(null);

  // Thu hồi object URL của bản xem trước cũ khi đổi bản khác hoặc rời trang.
  useEffect(() => () => revokePreview(preview), [preview]);

  const visibleGroups = groups ?? [];
  const busy = exportReport.isPending || previewReport.isPending;

  function openDialog() {
    // Mặc định không tick nhóm nào — người dùng tự chọn nhóm cần xuất.
    setSelected(new Set());
    setError(null);
    setPreview(null);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setPreview(null);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    const allSelected =
      visibleGroups.length > 0 && visibleGroups.every((g) => selected.has(g.id));
    setSelected(allSelected ? new Set() : new Set(visibleGroups.map((g) => g.id)));
  }

  /** Chặn cả 2 hành động khi chưa chọn nhóm nào. */
  function ensureSelection(): boolean {
    setError(null);
    if (selected.size === 0) {
      setError("Chọn ít nhất 1 nhóm để xuất");
      return false;
    }
    return true;
  }

  async function handlePreview() {
    if (!ensureSelection()) return;
    try {
      setPreview(
        await previewReport.mutateAsync({
          groupIds: Array.from(selected),
          format,
        }),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không tạo được bản xem trước",
      );
    }
  }

  async function handleExport() {
    if (!ensureSelection()) return;
    try {
      await exportReport.mutateAsync({ groupIds: Array.from(selected), format });
      closeDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xuất báo cáo thất bại");
    }
  }

  const downloadButton = (
    <Button size="sm" onClick={handleExport} disabled={busy}>
      {exportReport.isPending ? <Spinner /> : <FileDown />}
      Tải xuống
    </Button>
  );

  return (
    <>
      <Button variant="outline" size="sm" onClick={openDialog}>
        <FileDown />
        Xuất báo cáo
      </Button>

      <Dialog
        open={open}
        onClose={closeDialog}
        title={preview ? "Xem trước báo cáo" : "Xuất báo cáo nợ"}
        // Bản xem trước cần chỗ rộng hơn hẳn form chọn nhóm.
        className={preview ? "max-w-3xl" : undefined}
        footer={
          preview ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>
                <ArrowLeft />
                Quay lại
              </Button>
              {downloadButton}
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={closeDialog}>
                Huỷ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={busy}
              >
                {previewReport.isPending ? <Spinner /> : <Eye />}
                Xem trước
              </Button>
              {downloadButton}
            </>
          )
        }
      >
        {preview ? (
          <ReportPreviewPane preview={preview} />
        ) : (
          <ExportOptions
            groups={visibleGroups}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
            format={format}
            onFormatChange={setFormat}
          />
        )}

        {error ? (
          <p className="brutal bg-danger-bg px-3 py-2 text-sm font-bold text-danger-foreground [--brutal-shadow:var(--shadow-brutal-sm)]">
            {error}
          </p>
        ) : null}
      </Dialog>
    </>
  );
}
