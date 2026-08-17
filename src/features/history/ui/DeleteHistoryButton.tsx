"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useDeleteHistoryRecord } from "../api/mutations";

export function DeleteHistoryButton({ recordId }: { recordId: string }) {
  const deleteRecord = useDeleteHistoryRecord();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => deleteRecord.mutate(recordId)}
      disabled={deleteRecord.isPending}
      title="Xoá hẳn khỏi lịch sử"
    >
      {deleteRecord.isPending ? <Spinner /> : <Trash2 />}
    </Button>
  );
}
