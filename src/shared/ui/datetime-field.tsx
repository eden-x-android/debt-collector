"use client";

import { Calendar } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/shared/lib/utils";

const hintFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type DateTimeFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/**
 * Ô chọn ngày giờ dùng chung: icon Calendar theo style dự án (thay icon native),
 * khi trống hiển thị hint "Bây giờ: <ngày giờ hiện tại>". Không chọn → để trống,
 * phía server tự lấy thời điểm hiện tại.
 */
export function DateTimeField({
  id,
  value,
  onChange,
  className,
}: DateTimeFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  function openPicker() {
    const el = ref.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  }

  return (
    <div className={cn("relative", className)}>
      <input
        ref={ref}
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-9 w-full rounded-lg border border-input bg-background pl-3 pr-9 text-sm shadow-xs outline-none transition-colors",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "dark:bg-input/30",
          // Ẩn icon lịch mặc định của trình duyệt (webkit) để dùng icon riêng.
          "[&::-webkit-calendar-picker-indicator]:hidden",
          // Khi trống: ẩn phần mask ngày mặc định để hiện hint bên dưới.
          !value && "text-transparent",
        )}
      />
      {!value ? (
        <span
          suppressHydrationWarning
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground"
        >
          Bây giờ: {hintFmt.format(new Date())}
        </span>
      ) : null}
      <button
        type="button"
        tabIndex={-1}
        onClick={openPicker}
        aria-label="Chọn ngày giờ"
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Calendar className="size-4" />
      </button>
    </div>
  );
}
