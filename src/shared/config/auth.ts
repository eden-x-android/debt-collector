/**
 * Cấu hình auth dùng chung (không chứa secret).
 *
 * Theo yêu cầu nghiệp vụ: username và email nhận OTP được hardcode.
 * Đây là 2 giá trị hardcode DUY NHẤT được phép (xem .agents/rules/security.md).
 */

/** Username hardcode để đăng nhập (đặt khó đoán để tránh spam OTP). */
export const AUTH_USERNAME = "admin1891999";

/** Email nhận OTP (hardcode, cho phép override qua env khi cần). */
export const OTP_RECIPIENT_EMAIL =
  process.env.OTP_RECIPIENT_EMAIL ?? "toanthai.me@gmail.com";

/** Tên cookie chứa session JWT. */
export const SESSION_COOKIE_NAME = "dc_session";

/** Thời gian sống của session (7 ngày). */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

/** Số chữ số của OTP. */
export const OTP_LENGTH = 6;

/** Thời gian sống của OTP (5 phút). */
export const OTP_TTL_SECONDS = 5 * 60;

/** Số lần nhập sai OTP tối đa trước khi buộc xin mã mới. */
export const OTP_MAX_ATTEMPTS = 5;

/** Khoảng chờ tối thiểu giữa 2 lần gửi OTP (giây). */
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

/**
 * Số lần gửi OTP tối đa trong 24h — tự giới hạn để không vượt hạn mức
 * free của Resend (100 email/ngày) và chống spam.
 */
export const OTP_MAX_SENDS_PER_DAY = 20;
