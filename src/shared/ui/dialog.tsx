"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Hàng nút dưới cùng (thường là Huỷ + hành động chính). */
  footer?: ReactNode;
  /** Ghi đè bề rộng, mặc định max-w-md. */
  className?: string;
};

/** Dialog dùng chung: đóng bằng Esc, bấm ra ngoài, và khoá scroll nền. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: DialogProps) {
  const titleId = useId();

  // Consumer thường truyền arrow function mới mỗi render; giữ trong ref để
  // effect dưới chỉ phụ thuộc `open`, không gỡ/gắn lại listener liên tục.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", onKeyDown);

    // Khoá scroll nền để trên mobile không kéo trang phía sau dialog.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-overlay p-4 backdrop-blur-sm fade-in duration-200"
      onClick={onClose}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          // Đục hơn Card thường: chữ phải đọc được khi dialog đè lên nội dung.
          // Override biến thay vì chồng class — xem chú thích @utility glass.
          "w-full max-w-md [--glass-bg:var(--glass-strong-bg)] [--glass-blur:32px] [--glass-fallback-bg:var(--popover)]",
          "animate-in zoom-in-95 duration-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle id={titleId}>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
        {footer ? (
          <CardFooter className="justify-end gap-2">{footer}</CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
