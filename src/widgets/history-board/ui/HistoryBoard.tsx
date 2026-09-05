"use client";

import { RecordRow, useHistory } from "@/entities/record";
import { DeleteHistoryButton, RestoreRecordButton } from "@/features/history";
import { formatDateTime } from "@/shared/lib/format";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

export function HistoryBoard() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHistory();

  const records = data?.pages.flatMap((page) => page.items) ?? [];

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

      {data && records.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Lịch sử trống. Các khoản đã đánh dấu done sẽ xuất hiện ở đây.
        </p>
      ) : null}

      <div className="space-y-2">
        {records.map((record) => (
          <RecordRow
            key={record.id}
            amount={record.amount}
            note={record.note}
            badge={record.groupName}
            // Tách 2 dòng thay vì nối bằng dấu ·: ghép lại thì trên mobile câu
            // vẫn tự xuống dòng, nhưng ngắt ở chỗ ngẫu nhiên giữa ngày giờ.
            meta={
              <>
                <span className="block">
                  Ghi nợ {formatDateTime(record.createdAt)}
                </span>
                {record.deletedAt ? (
                  <span className="block">
                    Đã xoá {formatDateTime(record.deletedAt)}
                  </span>
                ) : record.doneAt ? (
                  <span className="block">
                    Đã xong {formatDateTime(record.doneAt)}
                  </span>
                ) : null}
              </>
            }
            actions={
              <>
                <RestoreRecordButton recordId={record.id} />
                <DeleteHistoryButton recordId={record.id} />
              </>
            }
          />
        ))}
      </div>

      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? <Spinner /> : null}
            Tải thêm
          </Button>
        </div>
      ) : null}
    </div>
  );
}
