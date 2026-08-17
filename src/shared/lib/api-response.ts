import { NextResponse } from "next/server";

import type { ApiResponse } from "@/shared/types/api";

/** Trả về response thành công dạng { success: true, data }. */
export function ok<T>(data: T, init?: ResponseInit): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, init);
}

/** Trả về response lỗi dạng { success: false, error } với status tương ứng. */
export function fail(error: string, status = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error }, { status });
}
