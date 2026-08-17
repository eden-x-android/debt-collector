import { useMutation } from "@tanstack/react-query";

import { apiPost } from "@/shared/api/http";

/** Gửi yêu cầu OTP cho username. */
export function useRequestOtp() {
  return useMutation({
    mutationFn: (username: string) =>
      apiPost<{ sent: boolean }>("/api/auth/request-otp", { username }),
  });
}

/** Xác thực OTP; thành công sẽ set session cookie phía server. */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: (input: { username: string; code: string }) =>
      apiPost<{ authenticated: boolean }>("/api/auth/verify-otp", input),
  });
}

/** Đăng xuất (xoá session cookie). */
export function useLogout() {
  return useMutation({
    mutationFn: () => apiPost<{ loggedOut: boolean }>("/api/auth/logout"),
  });
}
