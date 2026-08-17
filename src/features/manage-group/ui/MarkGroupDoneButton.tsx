"use client";

import { CheckCheck } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useMarkGroupDone } from "../api/mutations";

export function MarkGroupDoneButton({ groupId }: { groupId: string }) {
  const markDone = useMarkGroupDone();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => markDone.mutate(groupId)}
      disabled={markDone.isPending}
      title="Đánh dấu done cả group"
    >
      {markDone.isPending ? <Spinner /> : <CheckCheck />}
      Done cả group
    </Button>
  );
}
