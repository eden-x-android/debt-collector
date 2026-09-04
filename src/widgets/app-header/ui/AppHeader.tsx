import Link from "next/link";

import { LogoutButton } from "@/features/auth";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

import { NavLinks } from "./NavLinks";

export function AppHeader() {
  return (
    // Lớp kính dễ thấy nhất: nội dung trôi bên dưới nó khi cuộn.
    // Chỉ cần viền cạnh dưới — override biến vì class border-* không thắng
    // được .glass (xem chú thích @utility glass trong globals.css).
    <header className="glass sticky top-0 z-10 [--glass-border-width:0_0_1px_0]">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Ghi nợ
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
