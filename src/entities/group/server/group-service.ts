// Service layer cho Group — chứa business logic, chỉ chạy phía server.
import { z } from "zod";

import { db } from "@/shared/api/db";
import type { GroupWithRecordsDto } from "@/shared/types/debt";

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, "Tên nhóm không được để trống").max(100),
});

/**
 * Danh sách group đang hoạt động cho màn hình chính.
 * Hiển thị group còn record chưa done, hoặc group mới tạo chưa có record nào.
 * Group đã done hết record (record nằm trong lịch sử) sẽ bị ẩn.
 */
export async function listActiveGroups(): Promise<GroupWithRecordsDto[]> {
  const groups = await db.group.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      records: {
        where: { doneAt: null },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { records: true } },
    },
  });

  return groups
    .filter((g) => g._count.records === 0 || g.records.length > 0)
    .map((g) => ({
      id: g.id,
      name: g.name,
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
      total: g.records.reduce((sum, r) => sum + Number(r.amount), 0),
      records: g.records.map((r) => ({
        id: r.id,
        groupId: r.groupId,
        amount: Number(r.amount),
        note: r.note,
        createdAt: r.createdAt.toISOString(),
        doneAt: null,
      })),
    }));
}

/** Tạo group mới. */
export async function createGroup(name: string): Promise<{ id: string }> {
  const group = await db.group.create({ data: { name } });
  return { id: group.id };
}

/**
 * Đánh dấu done cả group: set doneAt cho toàn bộ record chưa done trong group.
 * Toàn bộ record của group sẽ chuyển vào lịch sử.
 */
export async function markGroupDone(groupId: string): Promise<void> {
  const result = await db.debtRecord.updateMany({
    where: { groupId, doneAt: null },
    data: { doneAt: new Date() },
  });
  if (result.count === 0) {
    // Group không tồn tại hoặc không còn record active.
    const exists = await db.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });
    if (!exists) throw new Error("Không tìm thấy group");
  }
}

/**
 * Xoá group rỗng (không còn record nào). Dùng để dọn group tạo nhầm.
 * Không cho xoá group còn record để tránh mất dữ liệu lịch sử.
 */
export async function deleteEmptyGroup(groupId: string): Promise<void> {
  const count = await db.debtRecord.count({ where: { groupId } });
  if (count > 0) {
    throw new Error("Chỉ có thể xoá group không còn record nào");
  }
  await db.group.delete({ where: { id: groupId } });
}
