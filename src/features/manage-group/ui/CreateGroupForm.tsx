"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";

import { useCreateGroup } from "../api/mutations";

export function CreateGroupForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createGroup = useCreateGroup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await createGroup.mutateAsync(trimmed);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo group thất bại");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Tên group (vd: An)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />
        <Button
          type="submit"
          disabled={createGroup.isPending || name.trim().length === 0}
        >
          {createGroup.isPending ? <Spinner /> : <Plus />}
          Tạo group
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
