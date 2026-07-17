# Debt Collector

Web ghi nợ theo group — xem chi tiết ở [AGENTS.md](./AGENTS.md).

## Stack
Next.js (App Router) + TypeScript, FSD architecture, Tailwind + shadcn/ui, Zustand + TanStack Query, Prisma + Supabase (Postgres), Resend (OTP email).

## Setup

1. Copy `.env.example` thành `.env` và điền giá trị thật:
   - **DATABASE_URL**: tạo project free tại [supabase.com](https://supabase.com) → Project Settings → Connect → ORMs → Prisma, copy connection string.
   - **RESEND_API_KEY**: tạo tài khoản free tại [resend.com](https://resend.com) (100 email/ngày), tạo API key.
   - **ADMIN_USERNAME**: username hardcode để login (mặc định `admin`).
   - **OTP_RECIPIENT_EMAIL**: email nhận OTP mỗi lần login.
   - **SESSION_SECRET**: chuỗi bí mật ký JWT session, tạo bằng `openssl rand -base64 32`.

2. Cài dependencies:
   ```bash
   npm install
   ```

3. Áp dụng schema DB lên Supabase:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Chạy dev server:
   ```bash
   npm run dev
   ```

Mở [http://localhost:3000](http://localhost:3000).

## Deploy
Deploy free trên [Vercel](https://vercel.com) (Hobby plan), khai báo lại các biến môi trường ở trên trong Vercel Project Settings.
