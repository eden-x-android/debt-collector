"use client";

import { Check } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useMarkRecordDone } from "../api/mutations";

export function MarkRecordDoneButton({ recordId }: { recordId: string }) {
  const markDone = useMarkRecordDone();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => markDone.mutate(recordId)}
      disabled={markDone.isPending}
      title="Đánh dấu done"
    >
      {markDone.isPending ? <Spinner /> : <Check />}
    </Button>
  );
}
