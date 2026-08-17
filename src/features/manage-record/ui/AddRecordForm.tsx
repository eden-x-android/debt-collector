"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";

import { useAddRecord } from "../api/mutations";

export function AddRecordForm({ groupId }: { groupId: string }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addRecord = useAddRecord(groupId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Số tiền phải lớn hơn 0");
      return;
    }
    try {
      await addRecord.mutateAsync({
        amount: numericAmount,
        note: note.trim() || undefined,
      });
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thêm khoản nợ thất bại");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="Số tiền"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="sm:w-40"
        />
        <Input
          placeholder="Ghi chú (tuỳ chọn)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={255}
          className="flex-1"
        />
        <Button type="submit" disabled={addRecord.isPending}>
          {addRecord.isPending ? <Spinner /> : <Plus />}
          Thêm
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
