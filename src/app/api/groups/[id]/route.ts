import { deleteEmptyGroup } from "@/entities/group/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const { id } = await ctx.params;
    await deleteEmptyGroup(id);
    return ok({ deleted: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Xoá group thất bại";
    return fail(message, 400);
  }
}
