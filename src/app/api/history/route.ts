import { listHistory } from "@/entities/record/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const history = await listHistory();
    return ok(history);
  } catch (error) {
    console.error("list history error:", error);
    return fail("Không tải được lịch sử", 500);
  }
}
