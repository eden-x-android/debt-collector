<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Debt Collector — Web ghi nợ

## Mô tả dự án
Web quản lý ghi nợ theo group (theo người), cho phép:
- Tạo group (ví dụ group "An") để ghi tất cả record nợ của người đó. Mỗi lần phát sinh nợ mới → thêm 1 record vào group. Group hiển thị tổng nợ = tổng các record trong group.
- Đánh dấu "done" theo từng record hoặc cả group. Record/group done chuyển vào lịch sử (không còn nhóm theo group trong lịch sử). Lịch sử cho phép khôi phục hoặc xóa hẳn.
- Lớp login: username hardcode (ví dụ `admin`), sau khi nhập đúng username → gửi OTP về 1 email hardcode, nhập OTP để đăng nhập.

## Ràng buộc
- Toàn bộ tech stack và service sử dụng phải **free** (không tốn phí).
- Kiến trúc frontend theo **FSD (Feature-Sliced Design)**.

## Tech stack
- Next.js (App Router) + TypeScript, deploy free trên Vercel
- Cấu trúc `src/` theo FSD: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
- State/data: Zustand + TanStack Query
- UI: Tailwind CSS + shadcn/ui
- DB: Supabase (Postgres free tier), Prisma ORM
- Gửi OTP email: Resend (free 100 email/ngày) hoặc Brevo (free 300 email/ngày)
- Auth: tự viết (check username hardcode, sinh OTP lưu tạm có TTL, gửi qua Resend, verify rồi set session cookie JWT)

## Rules
See [.agents/rules.md](.agents/rules.md) — shared rules for any agent tool working on this project.
