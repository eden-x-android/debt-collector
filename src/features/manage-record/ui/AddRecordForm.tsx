"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { useAddRecord } from "../api/mutations";

export function AddRecordForm({ groupId }: { groupId: string }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(""); // datetime-local, để trống = hiện tại
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
    // datetime-local là giờ local → chuyển sang ISO có timezone để server hiểu đúng.
    const createdAt = date ? new Date(date).toISOString() : undefined;
    try {
      await addRecord.mutateAsync({
        amount: numericAmount,
        note: note.trim() || undefined,
        createdAt,
      });
      setAmount("");
      setNote("");
      setDate("");
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <Label htmlFor={`date-${groupId}`} className="text-xs text-muted-foreground">
          Ngày ghi nợ (tuỳ chọn)
        </Label>
        <Input
          id={`date-${groupId}`}
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="sm:w-56"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
