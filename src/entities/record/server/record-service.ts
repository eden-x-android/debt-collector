// Service layer cho DebtRecord — business logic + lịch sử, chỉ chạy phía server.
import { z } from "zod";

import { db } from "@/shared/api/db";
import type { HistoryRecordDto, RecordDto } from "@/shared/types/debt";

export const addRecordSchema = z.object({
  amount: z
    .number({ error: "Số tiền không hợp lệ" })
    .positive("Số tiền phải lớn hơn 0")
    .max(1_000_000_000_000, "Số tiền quá lớn"),
  note: z.string().trim().max(255).optional(),
});

function toRecordDto(r: {
  id: string;
  groupId: string;
  amount: unknown;
  note: string | null;
  createdAt: Date;
  doneAt: Date | null;
}): RecordDto {
  return {
    id: r.id,
    groupId: r.groupId,
    amount: Number(r.amount),
    note: r.note,
    createdAt: r.createdAt.toISOString(),
    doneAt: r.doneAt ? r.doneAt.toISOString() : null,
  };
}

/** Thêm 1 record nợ vào group. */
export async function addRecord(
  groupId: string,
  amount: number,
  note?: string,
): Promise<RecordDto> {
  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { id: true },
  });
  if (!group) throw new Error("Không tìm thấy group");

  const record = await db.debtRecord.create({
    data: { groupId, amount, note: note && note.length > 0 ? note : null },
  });
  return toRecordDto(record);
}

/** Đánh dấu done 1 record (chuyển vào lịch sử). */
export async function markRecordDone(id: string): Promise<void> {
  const record = await db.debtRecord.findUnique({
    where: { id },
    select: { id: true, doneAt: true },
  });
  if (!record) throw new Error("Không tìm thấy record");
  if (record.doneAt) return; // đã done rồi, bỏ qua
  await db.debtRecord.update({
    where: { id },
    data: { doneAt: new Date() },
  });
}

/** Xoá hẳn 1 record (áp dụng cho record active lẫn record trong lịch sử). */
export async function deleteRecord(id: string): Promise<void> {
  try {
    await db.debtRecord.delete({ where: { id } });
  } catch {
    throw new Error("Không tìm thấy record");
  }
}

/** Khôi phục 1 record từ lịch sử về trạng thái active (bỏ doneAt). */
export async function restoreRecord(id: string): Promise<void> {
  const record = await db.debtRecord.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!record) throw new Error("Không tìm thấy record");
  await db.debtRecord.update({
    where: { id },
    data: { doneAt: null },
  });
}

/** Danh sách lịch sử: các record đã done (phẳng, kèm tên group), mới nhất trước. */
export async function listHistory(): Promise<HistoryRecordDto[]> {
  const records = await db.debtRecord.findMany({
    where: { doneAt: { not: null } },
    orderBy: { doneAt: "desc" },
    include: { group: { select: { name: true } } },
  });
  return records.map((r) => ({
    ...toRecordDto(r),
    groupName: r.group.name,
  }));
}
