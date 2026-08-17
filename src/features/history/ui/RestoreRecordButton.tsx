"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useRestoreRecord } from "../api/mutations";

export function RestoreRecordButton({ recordId }: { recordId: string }) {
  const restore = useRestoreRecord();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => restore.mutate(recordId)}
      disabled={restore.isPending}
      title="Khôi phục về group"
    >
      {restore.isPending ? <Spinner /> : <RotateCcw />}
      Khôi phục
    </Button>
  );
}
