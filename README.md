# Debt Collector — Web ghi nợ

Web quản lý ghi nợ theo nhóm (theo người): tạo group, thêm record nợ, đánh dấu
done theo record hoặc cả group (chuyển vào lịch sử), khôi phục / xoá hẳn trong
lịch sử. Đăng nhập bằng username hardcode + OTP gửi qua email.

## Tech stack

- **Next.js 16** (App Router) + TypeScript, deploy free trên **Vercel**
- Kiến trúc frontend theo **FSD** (`app` → `widgets` → `features` → `entities` → `shared`)
- **TanStack Query** (data) + **Zustand** (UI state, khi cần)
- **Tailwind CSS** + shadcn/ui (base-nova)
- **Supabase** Postgres (free) + **Prisma** ORM
- **Resend** gửi OTP email (free 100 email/ngày)
- Auth tự viết: username hardcode → OTP (TTL 5 phút, giới hạn số lần thử) → session JWT (cookie httpOnly)

## Cấu trúc thư mục (FSD)

```
src/
  app/                 # routes + API route handlers (tầng cao nhất)
    api/               # route handlers mỏng: validate → gọi service → trả JSON chuẩn
    login/ history/    # các trang
    layout.tsx page.tsx
  widgets/             # group-board, history-board, app-header
  features/            # auth, manage-group, manage-record, history (mutation + UI)
  entities/            # group, record (types, server service, query hooks, UI presentational)
  shared/              # config, lib (session/otp/mailer/format), ui, api (db/http), types
  proxy.ts             # auth guard tầng edge (redirect /login)
```

Quy ước dữ liệu: mỗi entity có 2 public API — `@/entities/x` (client: hooks + UI)
và `@/entities/x/server` (server: service dùng trong route handler).

## Thiết lập lần đầu

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo Supabase project (free)

1. Tạo project tại https://supabase.com (Free tier).
2. Bấm nút **Connect** (góc trên) → tab **Connection string**, chọn URI:
   - `DATABASE_URL` ← **Transaction pooler** (port `6543`, host `*.pooler.supabase.com`) — cho app runtime, IPv4.
   - `DIRECT_URL` ← **Direct connection** (port `5432`) — cho `prisma db push`/migrate.
   - Nếu mạng chỉ có IPv4 và Direct bị timeout → dùng **Session pooler** (IPv4, port 5432) làm `DIRECT_URL`.
   - `[PASSWORD]` là mật khẩu DB (bấm **Reset database password** nếu quên); percent-encode nếu có ký tự đặc biệt.

### 3. Tạo Resend API key (free)

1. Đăng ký https://resend.com, tạo API key tại **API Keys**.
2. Mặc định `OTP_EMAIL_FROM="Debt Collector <onboarding@resend.dev>"` dùng được
   ngay nhưng chỉ gửi tới **email chủ tài khoản Resend**. Muốn gửi tới email khác
   phải verify domain (miễn phí).
3. Email nhận OTP đang hardcode trong `src/shared/config/auth.ts`
   (`OTP_RECIPIENT_EMAIL`) — sửa lại cho đúng email của đại ca (hoặc set biến môi
   trường `OTP_RECIPIENT_EMAIL`).

### 4. Cấu hình biến môi trường

Copy `.env.example` → `.env.local` rồi điền giá trị thật:

```bash
cp .env.example .env.local
```

Sinh `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Đẩy schema lên DB

```bash
npx prisma db push     # tạo bảng theo prisma/schema.prisma
# hoặc dùng migration:
# npx prisma migrate dev --name init
```

### 6. Chạy dev

```bash
npm run dev
```

Mở http://localhost:3000 → tự chuyển sang `/login`. Nhập username `admin` → nhận OTP.

> **Mẹo dev:** nếu chưa cấu hình `RESEND_API_KEY`, OTP sẽ được **in ra console
> server** (chỉ ở môi trường dev) để test luồng đăng nhập.

## Đăng nhập

- Username hardcode: `admin` (đổi trong `src/shared/config/auth.ts`).
- OTP 6 số, hiệu lực 5 phút, tối đa 5 lần nhập sai, cooldown 60s giữa 2 lần gửi,
  tối đa 20 lần gửi/ngày (tự giới hạn để không vượt quota Resend).

## Deploy Vercel (free)

1. Push repo lên GitHub, import vào Vercel (Hobby plan).
2. Thêm các biến môi trường ở **Project Settings → Environment Variables**:
   `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET`, `RESEND_API_KEY`,
   `OTP_EMAIL_FROM` (và `OTP_RECIPIENT_EMAIL` nếu dùng).
3. Deploy. Dùng domain `*.vercel.app` free (không cấu hình domain trả phí).

## Lệnh hữu ích

```bash
npm run dev        # chạy dev
npm run build      # build production
npm run lint       # eslint
npx prisma studio  # xem/sửa dữ liệu trực quan
npx prisma generate # sinh lại Prisma client sau khi đổi schema
```

## Ràng buộc

Toàn bộ service dùng ở **bản free**. Không bật gói trả phí, không thêm service
tốn phí. Xem `.agents/rules/` để biết quy ước code, bảo mật và giới hạn free-tier.
