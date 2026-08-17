import { restoreRecord } from "@/entities/record/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const { id } = await ctx.params;
    await restoreRecord(id);
    return ok({ restored: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Khôi phục thất bại";
    return fail(message, 400);
  }
}
