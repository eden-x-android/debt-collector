import Link from "next/link";

import { LogoutButton } from "@/features/auth";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

import { NavLinks } from "./NavLinks";

export function AppHeader() {
  return (
    // Nền phải ĐỤC: header dính trên cùng và nội dung trôi bên dưới nó khi
    // cuộn — không còn backdrop-filter để làm mờ như bản kính nữa.
    // Chỉ viền cạnh dưới, không bóng — override biến vì class border-*/shadow-*
    // không thắng được .brutal (xem chú thích @utility brutal trong globals.css).
    // --brutal-radius:0 — dải chạy hết bề ngang màn hình, bo góc sẽ hở ra 4 khe
    // tam giác ở hai mép trên.
    <header className="brutal sticky top-0 z-10 bg-card [--brutal-border-width:0_0_2px_0] [--brutal-radius:0] [--brutal-shadow:none]">
      {/* Khoảng cách hẹp lại trên mobile: header cao cố định 14, hết chỗ là
          chữ xuống dòng chứ không co lại được. */}
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-2 px-4 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="truncate font-display text-lg font-bold tracking-tight whitespace-nowrap"
          >
            Ghi nợ
          </Link>
          <NavLinks />
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
