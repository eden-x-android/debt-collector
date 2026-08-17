import Link from "next/link";

import { LogoutButton } from "@/features/auth";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

import { NavLinks } from "./NavLinks";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Ghi nợ
          </Link>
          <NavLinks />
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/public"
            target="_blank"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Bảng công khai ↗
          </Link>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
