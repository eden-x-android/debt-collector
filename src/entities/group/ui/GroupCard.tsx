import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { formatVnd, isCredit } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

type GroupCardProps = {
  name: string;
  total: number;
  recordCount: number;
  headerActions?: ReactNode;
  children?: ReactNode;
};

/** Card hiển thị 1 group + tổng nợ (presentational). Nội dung/nút qua slot. */
export function GroupCard({
  name,
  total,
  recordCount,
  headerActions,
  children,
}: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {recordCount} khoản ·{" "}
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  // Tổng âm = bị cấn trừ vượt số nợ.
                  isCredit(total)
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground",
                )}
              >
                {formatVnd(total)}
              </span>
            </p>
          </div>
          {headerActions ? (
            <div className="flex shrink-0 items-center gap-1">
              {headerActions}
            </div>
          ) : null}
        </div>
      </CardHeader>
      {children ? <CardContent className="space-y-2">{children}</CardContent> : null}
    </Card>
  );
}
