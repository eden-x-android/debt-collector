"use client";

import { GroupCard, usePublicGroups } from "@/entities/group";
import { RecordRow } from "@/entities/record";
import { formatDateTime } from "@/shared/lib/format";
import { Spinner } from "@/shared/ui/spinner";

/** Bảng nợ công khai, chỉ đọc — không có nút thêm/done/xoá, không gồm lịch sử. */
export function PublicBoard() {
  const { data: groups, isLoading, isError, error } = usePublicGroups();

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Đang tải...
        </div>
      ) : null}

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được dữ liệu"}
        </p>
      ) : null}

      {groups && groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa có nhóm nợ nào.</p>
      ) : null}

      {groups?.map((group) => (
        <GroupCard
          key={group.id}
          name={group.name}
          total={group.total}
          recordCount={group.records.length}
        >
          {group.records.length > 0 ? (
            <div className="space-y-2">
              {group.records.map((record) => (
                <RecordRow
                  key={record.id}
                  amount={record.amount}
                  note={record.note}
                  meta={`Tạo ${formatDateTime(record.createdAt)}`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có khoản nợ nào trong nhóm này.
            </p>
          )}
        </GroupCard>
      ))}
    </div>
  );
}
