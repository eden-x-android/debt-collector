"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { useCreateGroup } from "../api/mutations";

/** Icon "+" trên thanh công cụ, bấm vào mở dialog nhập tên nhóm nợ mới. */
export function CreateGroupButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createGroup = useCreateGroup();

  function openDialog() {
    setName("");
    setError(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createGroup.mutateAsync(trimmed);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo nhóm nợ thất bại");
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={openDialog}
        aria-label="Thêm nhóm nợ"
        title="Thêm nhóm nợ"
      >
        <Plus />
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm nhóm nợ"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button
              type="submit"
              form="create-group-form"
              size="sm"
              disabled={createGroup.isPending || name.trim().length === 0}
            >
              {createGroup.isPending ? <Spinner /> : <Plus />}
              Tạo nhóm
            </Button>
          </>
        }
      >
        {/* form có id để nút submit ở footer (ngoài form) vẫn gửi được. */}
        <form id="create-group-form" onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="create-group-name" className="text-sm">
            Tên nhóm
          </Label>
          <Input
            id="create-group-name"
            autoFocus
            placeholder="vd: An"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </form>
      </Dialog>
    </>
  );
}
