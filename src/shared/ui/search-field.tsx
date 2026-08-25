"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Nhãn cho screen reader (ô không có <label> hiển thị). */
  label: string;
  className?: string;
};

/** Ô tìm kiếm dùng chung: icon kính lúp bên trái, nút xoá khi có nội dung. */
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        <Search className="size-4" />
      </span>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        // Ẩn nút xoá mặc định của webkit vì đã có nút X riêng theo style dự án.
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Xoá tìm kiếm"
          className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
