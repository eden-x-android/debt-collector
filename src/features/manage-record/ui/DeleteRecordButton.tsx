"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useDeleteRecord } from "../api/mutations";

export function DeleteRecordButton({ recordId }: { recordId: string }) {
  const deleteRecord = useDeleteRecord();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => deleteRecord.mutate(recordId)}
      disabled={deleteRecord.isPending}
      title="Xoá khoản nợ"
    >
      {deleteRecord.isPending ? <Spinner /> : <Trash2 />}
    </Button>
  );
}
