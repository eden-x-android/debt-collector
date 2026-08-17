import { fail, ok } from "@/shared/lib/api-response";
import { getSession } from "@/shared/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return fail("Chưa đăng nhập", 401);
  }
  return ok({ username: session.sub });
}
