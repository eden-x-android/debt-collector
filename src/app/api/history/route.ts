import { historyQuerySchema, listHistory } from "@/entities/record/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const url = new URL(request.url);
    // Truyền undefined khi thiếu param để zod dùng giá trị mặc định
    // (searchParams.get trả null, mà null thì .default() không áp dụng).
    const parsed = historyQuerySchema.safeParse({
      limit: url.searchParams.get("limit") ?? undefined,
      offset: url.searchParams.get("offset") ?? undefined,
    });
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Tham số không hợp lệ", 400);
    }

    const history = await listHistory(parsed.data);
    return ok(history);
  } catch (error) {
    console.error("list history error:", error);
    return fail("Không tải được lịch sử", 500);
  }
}
