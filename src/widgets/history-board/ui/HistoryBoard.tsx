"use client";

import { RecordRow, useHistory } from "@/entities/record";
import {
  DeleteHistoryButton,
  RestoreRecordButton,
} from "@/features/history";
import { formatDateTime } from "@/shared/lib/format";
import { Spinner } from "@/shared/ui/spinner";

export function HistoryBoard() {
  const { data: history, isLoading, isError, error } = useHistory();

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Đang tải...
        </div>
      ) : null}

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Không tải được lịch sử"}
        </p>
      ) : null}

      {history && history.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Lịch sử trống. Các khoản đã đánh dấu done sẽ xuất hiện ở đây.
        </p>
      ) : null}

      <div className="space-y-2">
        {history?.map((record) => (
          <RecordRow
            key={record.id}
            amount={record.amount}
            note={record.note}
            badge={record.groupName}
            meta={record.doneAt ? `Done ${formatDateTime(record.doneAt)}` : undefined}
            actions={
              <>
                <RestoreRecordButton recordId={record.id} />
                <DeleteHistoryButton recordId={record.id} />
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
