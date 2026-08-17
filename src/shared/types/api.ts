/** Kiểu response chuẩn hoá cho toàn bộ API route. */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
