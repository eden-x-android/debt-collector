"use client";

import { useMemo } from "react";

import { GroupCard, useGroups } from "@/entities/group";
import { RecordRow } from "@/entities/record";
import { DeleteGroupButton, MarkGroupDoneButton } from "@/features/manage-group";
import {
  AddRecordForm,
  DeleteRecordButton,
  MarkRecordDoneButton,
} from "@/features/manage-record";
import { useGroupSearch } from "@/features/search-group";
import { formatDateTime } from "@/shared/lib/format";
import { matchesSearch } from "@/shared/lib/search";
import { Spinner } from "@/shared/ui/spinner";

export function GroupBoard() {
  const { data: groups, isLoading, isError, error } = useGroups();
  const query = useGroupSearch((s) => s.query);

  // Lọc phía client trên dữ liệu đã tải sẵn — không gọi thêm API.
  const visibleGroups = useMemo(
    () => (groups ?? []).filter((g) => matchesSearch(g.name, query)),
    [groups, query],
  );
  const filtering = query.trim().length > 0;

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Đang tải...
        </div>
      ) : null}

      {isError ? (
        <p className="brutal bg-danger-bg px-3 py-2 text-sm font-bold text-danger-foreground [--brutal-shadow:var(--shadow-brutal-sm)]">
          {error instanceof Error ? error.message : "Không tải được dữ liệu"}
        </p>
      ) : null}

      {groups && groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Chưa có nhóm nợ nào. Bấm nút + ở trên để tạo nhóm đầu tiên.
        </p>
      ) : null}

      {filtering && groups && groups.length > 0 ? (
        visibleGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Không tìm thấy nhóm nào khớp &ldquo;{query.trim()}&rdquo;.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {visibleGroups.length}/{groups.length} nhóm khớp
          </p>
        )
      ) : null}

      <div className="space-y-4">
        {visibleGroups.map((group) => (
          <GroupCard
            key={group.id}
            name={group.name}
            total={group.total}
            recordCount={group.records.length}
            headerActions={
              <>
                {group.records.length > 0 ? (
                  <MarkGroupDoneButton groupId={group.id} />
                ) : (
                  <DeleteGroupButton groupId={group.id} />
                )}
              </>
            }
          >
            <AddRecordForm groupId={group.id} />

            {group.records.length > 0 ? (
              <div className="space-y-2">
                {group.records.map((record) => (
                  <RecordRow
                    key={record.id}
                    amount={record.amount}
                    note={record.note}
                    meta={`Tạo ${formatDateTime(record.createdAt)}`}
                    actions={
                      <>
                        <MarkRecordDoneButton recordId={record.id} />
                        <DeleteRecordButton recordId={record.id} />
                      </>
                    }
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
    </div>
  );
}
