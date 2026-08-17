import type { ReactNode } from "react";

import { formatVnd } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type RecordRowProps = {
  amount: number;
  note?: string | null;
  /** Dòng phụ mô tả thời gian (vd: "Tạo 17/08/2026 10:30"). */
  meta?: string;
  /** Nhãn nhỏ phía trên (vd: tên group trong lịch sử). */
  badge?: string;
  actions?: ReactNode;
  className?: string;
};

/** Dòng hiển thị 1 record nợ (presentational). Actions được truyền qua slot. */
export function RecordRow({
  amount,
  note,
  meta,
  badge,
  actions,
  className,
}: RecordRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {badge ? (
          <span className="mb-0.5 inline-block rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {badge}
          </span>
        ) : null}
        <div className="font-medium tabular-nums">{formatVnd(amount)}</div>
        {note ? (
          <p className="truncate text-sm text-muted-foreground">{note}</p>
        ) : null}
        {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      ) : null}
    </div>
  );
}
