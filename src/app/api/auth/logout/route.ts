import { fail, ok } from "@/shared/lib/api-response";
import { deleteSession } from "@/shared/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return ok({ loggedOut: true });
  } catch (error) {
    console.error("logout error:", error);
    return fail("Đăng xuất thất bại", 500);
  }
}
