"use client";

import { X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useDeleteGroup } from "../api/mutations";

/** Chỉ hiển thị cho group rỗng (không còn record). */
export function DeleteGroupButton({ groupId }: { groupId: string }) {
  const deleteGroup = useDeleteGroup();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => deleteGroup.mutate(groupId)}
      disabled={deleteGroup.isPending}
      title="Xoá group rỗng"
    >
      {deleteGroup.isPending ? <Spinner /> : <X />}
    </Button>
  );
}
