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
  // Ngày ghi nợ tuỳ chọn (ISO string) — không truyền thì mặc định thời điểm hiện tại.
  createdAt: z.coerce.date().optional(),
});

export type AddRecordInput = z.infer<typeof addRecordSchema>;

function toRecordDto(r: {
  id: string;
  groupId: string;
  amount: unknown;
  note: string | null;
  createdAt: Date;
  doneAt: Date | null;
  deletedAt: Date | null;
}): RecordDto {
  return {
    id: r.id,
    groupId: r.groupId,
    amount: Number(r.amount),
    note: r.note,
    createdAt: r.createdAt.toISOString(),
    doneAt: r.doneAt ? r.doneAt.toISOString() : null,
    deletedAt: r.deletedAt ? r.deletedAt.toISOString() : null,
  };
}

/** Thêm 1 record nợ vào group. */
export async function addRecord(
  groupId: string,
  input: AddRecordInput,
): Promise<RecordDto> {
  const group = await db.group.findUnique({
    where: { id: groupId },
    select: { id: true },
  });
  if (!group) throw new Error("Không tìm thấy group");

  const record = await db.debtRecord.create({
    data: {
      groupId,
      amount: input.amount,
      note: input.note && input.note.length > 0 ? input.note : null,
      ...(input.createdAt ? { createdAt: input.createdAt } : {}),
    },
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

/**
 * Xoá 1 record đang active: soft-delete (đánh dấu deletedAt) để giữ lại trong
 * lịch sử, cho phép khôi phục hoặc xoá hẳn sau này.
 */
export async function softDeleteRecord(id: string): Promise<void> {
  const record = await db.debtRecord.findUnique({
    where: { id },
    select: { id: true, deletedAt: true },
  });
  if (!record) throw new Error("Không tìm thấy record");
  if (record.deletedAt) return; // đã xoá rồi
  await db.debtRecord.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/** Xoá hẳn 1 record khỏi DB (không thể khôi phục) — dùng trong lịch sử. */
export async function purgeRecord(id: string): Promise<void> {
  try {
    await db.debtRecord.delete({ where: { id } });
  } catch {
    throw new Error("Không tìm thấy record");
  }
}

/** Khôi phục 1 record từ lịch sử về active (bỏ cả doneAt lẫn deletedAt). */
export async function restoreRecord(id: string): Promise<void> {
  const record = await db.debtRecord.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!record) throw new Error("Không tìm thấy record");
  await db.debtRecord.update({
    where: { id },
    data: { doneAt: null, deletedAt: null },
  });
}

/**
 * Lịch sử: các record đã done HOẶC đã xoá (phẳng, kèm tên group),
 * sắp xếp theo thời điểm chuyển vào lịch sử mới nhất trước.
 */
export async function listHistory(): Promise<HistoryRecordDto[]> {
  const records = await db.debtRecord.findMany({
    where: {
      OR: [{ doneAt: { not: null } }, { deletedAt: { not: null } }],
    },
    include: { group: { select: { name: true } } },
  });
  return records
    .map((r) => ({ ...toRecordDto(r), groupName: r.group.name }))
    .sort((a, b) => {
      const ta = new Date(a.deletedAt ?? a.doneAt ?? a.createdAt).getTime();
      const tb = new Date(b.deletedAt ?? b.doneAt ?? b.createdAt).getTime();
      return tb - ta;
    });
}
