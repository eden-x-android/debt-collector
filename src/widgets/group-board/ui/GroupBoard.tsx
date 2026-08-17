"use client";

import { GroupCard, useGroups } from "@/entities/group";
import { RecordRow } from "@/entities/record";
import {
  CreateGroupForm,
  DeleteGroupButton,
  MarkGroupDoneButton,
} from "@/features/manage-group";
import {
  AddRecordForm,
  DeleteRecordButton,
  MarkRecordDoneButton,
} from "@/features/manage-record";
import { formatDateTime } from "@/shared/lib/format";
import { Spinner } from "@/shared/ui/spinner";

export function GroupBoard() {
  const { data: groups, isLoading, isError, error } = useGroups();

  return (
    <div className="space-y-6">
      <CreateGroupForm />

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
        <p className="text-sm text-muted-foreground">
          Chưa có nhóm nợ nào. Tạo nhóm đầu tiên ở trên.
        </p>
      ) : null}

      <div className="space-y-4">
        {groups?.map((group) => (
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
