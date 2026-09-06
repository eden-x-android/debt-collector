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
    // Segmented control: rãnh vuông bao cả 2 mục, mục đang chọn là khối vàng
    // đặc. Rãnh bao cả hai (chứ không chỉ viền quanh mục active) để nút không
    // trôi lơ lửng giữa header khi chữ bị xuống dòng trên màn hình hẹp.
    <nav className="flex shrink-0 items-center gap-0.5 rounded-md border-2 border-border bg-surface p-0.5 text-sm">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              // whitespace-nowrap: chữ xuống dòng là khối méo ngay.
              "rounded-sm px-2.5 py-1 whitespace-nowrap transition-colors duration-100 sm:px-3",
              active
                ? "bg-accent font-bold text-accent-foreground"
                : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
