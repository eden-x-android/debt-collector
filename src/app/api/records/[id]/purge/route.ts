import { purgeRecord } from "@/entities/record/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

// Xoá hẳn record khỏi lịch sử (không thể khôi phục).
export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const { id } = await ctx.params;
    await purgeRecord(id);
    return ok({ purged: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Xoá hẳn thất bại";
    return fail(message, 400);
  }
}
