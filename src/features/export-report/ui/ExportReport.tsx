"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";

import { useGroups } from "@/entities/group";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { type ExportFormat, useExportReport } from "../api/use-export-report";

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "html", label: "HTML" },
  { value: "md", label: "Markdown" },
];

export function ExportReport() {
  const [open, setOpen] = useState(false);
  const { data: groups } = useGroups();
  const exportReport = useExportReport();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    // Mặc định chọn tất cả group hiện có.
    setSelected(new Set((groups ?? []).map((g) => g.id)));
    setError(null);
    setOpen(true);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allIds = (groups ?? []).map((g) => g.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds));
  }

  async function handleExport() {
    setError(null);
    if (selected.size === 0) {
      setError("Chọn ít nhất 1 nhóm để xuất");
      return;
    }
    try {
      await exportReport.mutateAsync({
        groupIds: Array.from(selected),
        format,
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xuất báo cáo thất bại");
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={openDialog}>
        <FileDown />
        Xuất báo cáo
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <Card
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Xuất báo cáo nợ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Chọn nhóm</span>
                  {allIds.length > 0 ? (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={toggleAll}
                    >
                      {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </button>
                  ) : null}
                </div>
                <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                  {allIds.length === 0 ? (
                    <p className="p-2 text-sm text-muted-foreground">
                      Chưa có nhóm nợ nào.
                    </p>
                  ) : (
                    groups?.map((g) => (
                      <Label
                        key={g.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(g.id)}
                          onChange={() => toggle(g.id)}
                          className="size-4 accent-primary"
                        />
                        <span className="flex-1 truncate">{g.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {g.records.length} khoản
                        </span>
                      </Label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium">Định dạng</span>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map((f) => (
                    <Label
                      key={f.value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-muted"
                    >
                      <input
                        type="radio"
                        name="export-format"
                        value={f.value}
                        checked={format === f.value}
                        onChange={() => setFormat(f.value)}
                        className="size-4 accent-primary"
                      />
                      {f.label}
                    </Label>
                  ))}
                </div>
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Huỷ
              </Button>
              <Button
                size="sm"
                onClick={handleExport}
                disabled={exportReport.isPending}
              >
                {exportReport.isPending ? <Spinner /> : <FileDown />}
                Tải xuống
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}
    </>
  );
}
