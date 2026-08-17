// Chỉ dùng phía server. Sinh/lưu/xác thực OTP với TTL + giới hạn số lần thử.
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

import { db } from "@/shared/api/db";
import {
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS_PER_DAY,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
} from "@/shared/config/auth";

export type IssueOtpResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; error: string };

/** Sinh OTP số ngẫu nhiên an toàn (crypto), độ dài OTP_LENGTH. */
function generateCode(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

/** Hash OTP bằng HMAC-SHA256 (khoá = SESSION_SECRET) — không lưu code thô. */
function hashCode(code: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Thiếu biến môi trường SESSION_SECRET");
  }
  return createHmac("sha256", secret).update(code).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Cấp OTP mới cho username: kiểm tra cooldown & hạn mức ngày, tạo bản ghi
 * challenge (lưu hash), trả code thô để gửi email.
 */
export async function issueOtp(username: string): Promise<IssueOtpResult> {
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const sendsLast24h = await db.otpChallenge.count({
    where: { username, createdAt: { gte: since } },
  });
  if (sendsLast24h >= OTP_MAX_SENDS_PER_DAY) {
    return {
      ok: false,
      error: "Đã vượt số lần gửi OTP trong ngày. Vui lòng thử lại sau.",
    };
  }

  const latest = await db.otpChallenge.findFirst({
    where: { username },
    orderBy: { createdAt: "desc" },
  });
  if (latest) {
    const elapsed = (now.getTime() - latest.createdAt.getTime()) / 1000;
    if (elapsed < OTP_RESEND_COOLDOWN_SECONDS) {
      const wait = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed);
      return { ok: false, error: `Vui lòng chờ ${wait}s trước khi gửi lại OTP.` };
    }
  }

  const code = generateCode();
  await db.otpChallenge.create({
    data: {
      username,
      codeHash: hashCode(code),
      expiresAt: new Date(now.getTime() + OTP_TTL_SECONDS * 1000),
    },
  });

  return { ok: true, code };
}

/**
 * Xác thực OTP: lấy challenge mới nhất chưa dùng, kiểm tra hạn & số lần thử.
 * Sai → tăng attempts (đạt ngưỡng thì vô hiệu hoá). Đúng → đánh dấu đã dùng.
 */
export async function verifyOtp(
  username: string,
  code: string,
): Promise<VerifyOtpResult> {
  const challenge = await db.otpChallenge.findFirst({
    where: { username, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { ok: false, error: "Không tìm thấy OTP hợp lệ. Vui lòng xin mã mới." };
  }

  if (challenge.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "OTP đã hết hạn. Vui lòng xin mã mới." };
  }

  if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
    await db.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });
    return { ok: false, error: "Nhập sai quá số lần cho phép. Vui lòng xin mã mới." };
  }

  const matched = safeEqualHex(challenge.codeHash, hashCode(code));
  if (!matched) {
    await db.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    const remaining = OTP_MAX_ATTEMPTS - (challenge.attempts + 1);
    return {
      ok: false,
      error:
        remaining > 0
          ? `OTP không đúng. Còn ${remaining} lần thử.`
          : "OTP không đúng. Vui lòng xin mã mới.",
    };
  }

  await db.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });
  return { ok: true };
}
