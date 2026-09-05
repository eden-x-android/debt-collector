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
    // Segmented control kiểu iOS: rãnh chìm bao cả 2 mục, mục đang chọn là con
    // trượt nổi lên. Trước đây chỉ mục active có viền nên nó trôi lơ lửng giữa
    // header, nhìn rất kỳ khi chữ bị xuống dòng trên màn hình hẹp.
    <nav className="flex shrink-0 items-center gap-0.5 rounded-full border border-[var(--glass-quiet-border)] bg-[var(--glass-quiet-bg)] p-0.5 text-sm">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              // whitespace-nowrap: chữ xuống dòng là con trượt méo ngay.
              "rounded-full px-2.5 py-1 whitespace-nowrap transition-colors sm:px-3",
              active
                ? "bg-[var(--glass-strong-bg)] font-medium text-foreground shadow-[inset_0_1px_0_0_var(--glass-highlight),0_1px_2px_oklch(0.2_0.03_265_/_10%)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
