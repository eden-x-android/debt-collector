import Link from "next/link";

import { LogoutButton } from "@/features/auth";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Ghi nợ
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Nhóm nợ
            </Link>
            <Link href="/history" className="hover:text-foreground">
              Lịch sử
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
