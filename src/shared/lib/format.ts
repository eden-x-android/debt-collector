const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Định dạng số tiền theo VND, ví dụ 1500000 → "1.500.000 ₫". */
export function formatVnd(amount: number): string {
  return vndFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Định dạng ngày giờ theo vi-VN. */
export function formatDateTime(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}
