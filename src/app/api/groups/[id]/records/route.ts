import { addRecord, addRecordSchema } from "@/entities/record/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const { id } = await ctx.params;
    const body = await request.json().catch(() => null);
    const parsed = addRecordSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ", 400);
    }
    const record = await addRecord(id, parsed.data.amount, parsed.data.note);
    return ok(record, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Thêm khoản nợ thất bại";
    return fail(message, 400);
  }
}
