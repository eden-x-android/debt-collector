"use client";

import type { GroupWithRecordsDto } from "@/shared/types/debt";
import { type ReportFormat } from "@/shared/types/report";
import { Label } from "@/shared/ui/label";

// Thứ tự hiển thị + nhãn của các định dạng (copy trình bày, không phải domain).
const FORMATS: { value: ReportFormat; label: string }[] = [
  { value: "png", label: "Ảnh (PNG)" },
  { value: "html", label: "HTML" },
];

type ExportOptionsProps = {
  groups: GroupWithRecordsDto[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  format: ReportFormat;
  onFormatChange: (format: ReportFormat) => void;
};

/** Phần chọn nhóm + định dạng của dialog xuất báo cáo. */
export function ExportOptions({
  groups,
  selected,
  onToggle,
  onToggleAll,
  format,
  onFormatChange,
}: ExportOptionsProps) {
  const allSelected =
    groups.length > 0 && groups.every((g) => selected.has(g.id));

  return (
    <>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Chọn nhóm</span>
          {groups.length > 0 ? (
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={onToggleAll}
            >
              {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>
          ) : null}
        </div>
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-[var(--glass-quiet-border)] bg-[var(--glass-quiet-bg)] p-2">
          {groups.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">
              Chưa có nhóm nợ nào.
            </p>
          ) : (
            groups.map((g) => (
              <Label
                key={g.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={selected.has(g.id)}
                  onChange={() => onToggle(g.id)}
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
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--glass-quiet-border)] bg-[var(--glass-quiet-bg)] px-3 py-2 hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-accent"
            >
              <input
                type="radio"
                name="export-format"
                value={f.value}
                checked={format === f.value}
                onChange={() => onFormatChange(f.value)}
                className="size-4 accent-primary"
              />
              {f.label}
            </Label>
          ))}
        </div>
      </div>
    </>
  );
}
