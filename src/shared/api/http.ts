import type { ApiResponse } from "@/shared/types/api";

/**
 * Wrapper fetch phía client: luôn parse response theo shape chuẩn
 * { success, data?, error? } và ném Error khi thất bại để TanStack Query bắt.
 */
export async function apiFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  let json: ApiResponse<T> | null = null;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json || json.success === false) {
    const message =
      json && json.success === false ? json.error : "Đã có lỗi xảy ra";
    throw new Error(message);
  }

  return json.data;
}

/** Helper gọi POST với body JSON. */
export function apiPost<T>(input: string, body?: unknown): Promise<T> {
  return apiFetch<T>(input, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
