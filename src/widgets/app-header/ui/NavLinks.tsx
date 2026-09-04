"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/shared/lib/utils";

const items = [
  { href: "/", label: "Nhóm nợ" },
  { href: "/history", label: "Lịch sử" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              // Pill kiểu segmented control của iOS.
              "rounded-full px-3 py-1.5 transition-colors",
              active
                ? "border border-[var(--glass-quiet-border)] bg-[var(--glass-quiet-bg)] font-medium text-foreground shadow-[inset_0_1px_0_0_var(--glass-highlight)]"
                : "border border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
