import { z } from "zod";

import { AUTH_USERNAME } from "@/shared/config/auth";
import { fail, ok } from "@/shared/lib/api-response";
import { sendOtpEmail } from "@/shared/lib/mailer";
import { issueOtp } from "@/shared/lib/otp";

const schema = z.object({ username: z.string().trim().min(1) });

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return fail("Vui lòng nhập username", 400);
    }

    if (parsed.data.username !== AUTH_USERNAME) {
      return fail("Tài khoản không tồn tại", 401);
    }

    const issued = await issueOtp(AUTH_USERNAME);
    if (!issued.ok) {
      return fail(issued.error, 429);
    }

    await sendOtpEmail(issued.code);
    return ok({ sent: true });
  } catch (error) {
    console.error("request-otp error:", error);
    return fail("Không gửi được OTP. Vui lòng thử lại.", 500);
  }
}
