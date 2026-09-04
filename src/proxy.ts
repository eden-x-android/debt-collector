import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/shared/config/auth";

// Kiểm tra nhanh (optimistic) session ở tầng proxy — chỉ đọc cookie, không query DB.
// Bảo vệ thật sự vẫn nằm ở từng API route (getSession).
async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Route duy nhất không cần đăng nhập.
  const isLoginRoute = pathname === "/login";

  // ⚠️ TẠM: cho vào /preview để xem giao diện khi chưa có .env.local.
  // Chỉ ở dev — production vẫn bị chặn ở đây, và trang đó cũng tự notFound().
  // Xoá 3 dòng này cùng thư mục src/app/preview khi test xong.
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/preview")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authed = await hasValidSession(token);

  // Chưa đăng nhập mà vào route được bảo vệ → chuyển tới /login.
  if (!authed && !isLoginRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đã đăng nhập mà vào /login → chuyển về trang chính.
  if (authed && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Chạy proxy trên mọi route, trừ api, nội bộ _next, và mọi file tĩnh
  // (đường dẫn có phần mở rộng, vd .svg/.png/.ico — gồm /assets/icon.svg, favicon).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
