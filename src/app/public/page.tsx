import Link from "next/link";

import { PublicExportReport } from "@/features/export-report";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { PublicBoard } from "@/widgets/public-board";

export const metadata = {
  title: "Bảng nợ công khai — Ghi nợ",
};

export default function PublicPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
          <span className="font-semibold">Bảng nợ công khai</span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Nhóm nợ</h1>
            <p className="text-sm text-muted-foreground">
              Chỉ xem · không gồm lịch sử
            </p>
          </div>
          <PublicExportReport />
        </div>
        <PublicBoard />
      </main>
    </div>
  );
}
