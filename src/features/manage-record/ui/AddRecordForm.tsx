"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DateTimeField } from "@/shared/ui/datetime-field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { useAddRecord } from "../api/mutations";

// Khớp cap của Decimal(14,2) trong prisma/schema.prisma.
const AMOUNT_LIMIT = 999_999_999_999;

export function AddRecordForm({ groupId }: { groupId: string }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(""); // datetime-local, để trống = hiện tại
  const [error, setError] = useState<string | null>(null);
  const addRecord = useAddRecord(groupId);

  /**
   * Đảo dấu: nợ ↔ cấn trừ. Cần cho mobile vì bàn phím số trên iOS không có
   * dấu "-". Ô trống thì no-op — type="number" không giữ được value "-"
   * (browser sanitize về ""), nên phải gõ số trước rồi mới bấm ±.
   */
  function toggleSign() {
    setAmount((v) => (!v ? v : v.startsWith("-") ? v.slice(1) : `-${v}`));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const numericAmount = Number(amount);
    if (!amount.trim() || !Number.isFinite(numericAmount)) {
      setError("Nhập số tiền hợp lệ");
      return;
    }
    if (numericAmount === 0) {
      setError("Số tiền không được bằng 0");
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

  const negative = amount.startsWith("-");

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleSign}
            aria-label="Đảo dấu (nợ / cấn trừ)"
            title="Đảo dấu: nợ ↔ cấn trừ"
          >
            ±
          </Button>
          <Input
            type="number"
            min={-AMOUNT_LIMIT}
            max={AMOUNT_LIMIT}
            step="any"
            placeholder="Số tiền"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              "flex-1 sm:w-40 sm:flex-none",
              negative && "text-emerald-600 dark:text-emerald-400",
            )}
          />
        </div>
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
        <DateTimeField
          id={`date-${groupId}`}
          value={date}
          onChange={setDate}
          className="sm:w-64"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
