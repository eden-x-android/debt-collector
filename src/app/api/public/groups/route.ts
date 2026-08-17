import { listActiveGroups } from "@/entities/group/server";
import { fail, ok } from "@/shared/lib/api-response";

// CÔNG KHAI (không auth): dữ liệu nhóm nợ đang hoạt động cho public board.
// Chỉ đọc, KHÔNG gồm lịch sử.
export async function GET() {
  try {
    const groups = await listActiveGroups();
    return ok(groups);
  } catch (error) {
    console.error("public groups error:", error);
    return fail("Không tải được dữ liệu", 500);
  }
}
