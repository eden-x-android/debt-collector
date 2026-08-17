import {
  createGroup,
  createGroupSchema,
  listActiveGroups,
} from "@/entities/group/server";
import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const groups = await listActiveGroups();
    return ok(groups);
  } catch (error) {
    console.error("list groups error:", error);
    return fail("Không tải được danh sách group", 500);
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

  try {
    const body = await request.json().catch(() => null);
    const parsed = createGroupSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ", 400);
    }
    const created = await createGroup(parsed.data.name);
    return ok(created, { status: 201 });
  } catch (error) {
    console.error("create group error:", error);
    return fail("Tạo group thất bại", 500);
  }
}
