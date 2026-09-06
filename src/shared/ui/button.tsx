import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

/**
 * Khối brutal của nút: viền đặc + bóng cứng, phản hồi bằng CHUYỂN ĐỘNG chứ
 * không bằng đổi tông màu.
 *
 *   nghỉ   → bóng 2px
 *   hover  → khối nhích lên trái-trên 2px, bóng nở ra 4px (nhô lên khỏi mặt)
 *   active → khối dịch xuống đúng 2px vị trí bóng, bóng biến mất (sụp vào)
 *
 * Tổng dịch chuyển hover→active là 4px nên cú nhấn thấy rõ. Dùng class Tailwind
 * chứ không dùng @utility brutal vì bóng phải đổi theo trạng thái, mà utility
 * đặt box-shadow trực tiếp thì class shadow-* không ghi đè nổi (xem chú thích
 * @utility brutal trong globals.css).
 */
const BRUTAL =
  "border-2 border-border shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border-2 border-transparent text-sm font-bold whitespace-nowrap transition-all duration-100 outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground hover:bg-accent ${BRUTAL}`,
        outline: `bg-surface text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground ${BRUTAL}`,
        secondary: `bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground ${BRUTAL}`,
        // ghost cố ý trần trụi lúc nghỉ: nó là nút icon nhỏ nằm dày đặc trong
        // thẻ (xoá, đánh dấu xong), gắn viền + bóng cho từng cái là danh sách
        // rối ngay. Khối brutal chỉ hiện ra khi hover/focus.
        ghost:
          "hover:border-border hover:bg-accent hover:text-accent-foreground aria-expanded:border-border aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        // Khối đỏ neon + chữ đen (cả 2 theme — chữ sáng trên neon chỉ đạt
        // ~3:1). Hover sang --danger đậm hơn.
        destructive: `bg-danger-bg text-danger-foreground hover:bg-danger ${BRUTAL}`,
        link: "font-bold underline underline-offset-4 hover:no-underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
