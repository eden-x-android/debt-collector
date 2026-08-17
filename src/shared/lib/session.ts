// Chỉ dùng phía server (route handlers / services). Đọc/ghi cookie httpOnly.
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import {
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/shared/config/auth";

export type SessionPayload = {
  /** subject = username đã đăng nhập. */
  sub: string;
};

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Thiếu biến môi trường SESSION_SECRET");
  }
  return new TextEncoder().encode(secret);
}

/** Ký session thành JWT (HS256). */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ sub: payload.sub })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getKey());
}

/** Giải mã & xác thực JWT; trả null nếu không hợp lệ/hết hạn. */
export async function decryptSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

/** Tạo session sau khi verify OTP thành công, set cookie httpOnly. */
export async function createSession(username: string): Promise<void> {
  const token = await encryptSession({ sub: username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/** Xoá session (logout). */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Lấy session hiện tại từ cookie; trả null nếu chưa đăng nhập. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(token);
}
