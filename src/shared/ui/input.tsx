import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // --surface: input nằm trong Card, phải nổi hơn nền thẻ một bậc mới
        // tách ra được (xem chú thích phân tầng bề mặt trong globals.css).
        "flex h-9 w-full min-w-0 rounded-md border-2 border-border bg-surface px-3 py-1 transition-shadow duration-100 outline-none",
        // 16px trên mobile: iOS Safari tự zoom cả trang khi focus input có
        // font-size < 16px, zoom xong thì layout tràn ngang.
        "text-base sm:text-sm",
        "placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground",
        // Focus đổ bóng cứng thay vì ring nhoè. Outline cứng do quy tắc
        // :focus-visible chung trong globals.css lo.
        "focus-visible:shadow-brutal-sm",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:bg-danger-bg aria-invalid:text-danger-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
