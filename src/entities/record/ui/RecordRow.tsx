import type { ReactNode } from "react";

import { formatVnd, isCredit } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type RecordRowProps = {
  amount: number;
  note?: string | null;
  /** Dòng phụ mô tả thời gian (vd: "Tạo 17/08/2026 10:30"). */
  meta?: ReactNode;
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
        // --surface: bậc nổi hơn --card của GroupCard bọc ngoài ở CẢ hai theme
        // (xem chú thích phân tầng bề mặt trong globals.css). Bóng và bán kính
        // đều nhỏ hơn thẻ cha một bậc — góc trong mà cùng bán kính với góc
        // ngoài thì nhìn phồng ra.
        "brutal flex items-start justify-between gap-3 bg-surface px-3 py-2 [--brutal-radius:var(--radius-md)] [--brutal-shadow:var(--shadow-brutal-sm)]",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {badge ? (
          <span className="mb-1 inline-block rounded-sm border-2 border-border bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
            {badge}
          </span>
        ) : null}
        <div
          className={cn(
            "font-bold tabular-nums",
            // Khoản âm = cấn trừ → khối xanh neon cho dễ phân biệt với khoản
            // nợ. Là KHỐI chứ không phải chữ xanh, và chữ phải ép về
            // --success-foreground (đen) ở CẢ hai theme — chữ sáng mặc định của
            // dark đè lên nền neon chỉ đạt ~1.2:1 (xem chú thích globals.css).
            isCredit(amount) &&
              "inline-block rounded-sm border-2 border-border bg-success-bg px-1.5 text-success-foreground",
          )}
        >
          {formatVnd(amount)}
        </div>
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
