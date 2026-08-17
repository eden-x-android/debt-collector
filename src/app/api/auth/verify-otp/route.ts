import { z } from "zod";

import { AUTH_USERNAME } from "@/shared/config/auth";
import { fail, ok } from "@/shared/lib/api-response";
import { verifyOtp } from "@/shared/lib/otp";
import { createSession } from "@/shared/lib/session";

const schema = z.object({
  username: z.string().trim().min(1),
  code: z.string().trim().regex(/^\d{4,8}$/, "OTP không hợp lệ"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return fail("Vui lòng nhập OTP hợp lệ", 400);
    }

    if (parsed.data.username !== AUTH_USERNAME) {
      return fail("Tài khoản không tồn tại", 401);
    }

    const result = await verifyOtp(AUTH_USERNAME, parsed.data.code);
    if (!result.ok) {
      return fail(result.error, 401);
    }

    await createSession(AUTH_USERNAME);
    return ok({ authenticated: true });
  } catch (error) {
    console.error("verify-otp error:", error);
    return fail("Đăng nhập thất bại. Vui lòng thử lại.", 500);
  }
}
