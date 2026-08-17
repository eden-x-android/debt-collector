// Chỉ dùng phía server. Gửi OTP qua Resend (free 100 email/ngày).
import { Resend } from "resend";

import { OTP_RECIPIENT_EMAIL, OTP_TTL_SECONDS } from "@/shared/config/auth";

const FROM =
  process.env.OTP_EMAIL_FROM ?? "Debt Collector <onboarding@resend.dev>";

/**
 * Gửi email chứa OTP tới địa chỉ hardcode.
 * Nếu chưa cấu hình RESEND_API_KEY: ở môi trường dev sẽ log ra console để
 * test luồng; ở production sẽ ném lỗi (không bao giờ log OTP ở production).
 */
export async function sendOtpEmail(code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Thiếu RESEND_API_KEY — không thể gửi OTP.");
    }
    // Dev fallback: in ra console để kiểm thử.
    console.info(`[DEV] OTP đăng nhập: ${code} (gửi tới ${OTP_RECIPIENT_EMAIL})`);
    return;
  }

  const resend = new Resend(apiKey);
  const minutes = Math.round(OTP_TTL_SECONDS / 60);

  const { error } = await resend.emails.send({
    from: FROM,
    to: OTP_RECIPIENT_EMAIL,
    subject: `Mã đăng nhập Debt Collector: ${code}`,
    text: `Mã OTP đăng nhập của bạn là ${code}. Mã có hiệu lực trong ${minutes} phút.`,
    html: `<p>Mã OTP đăng nhập của bạn là:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>Mã có hiệu lực trong ${minutes} phút.</p>`,
  });

  if (error) {
    throw new Error(`Gửi OTP thất bại: ${error.message}`);
  }
}
