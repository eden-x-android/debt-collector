// Dấu thanh/dấu mũ tiếng Việt mà NFD tách ra (combining diacritical marks).
// Viết bằng escape \u vì các ký tự này vô hình trong editor, dễ hỏng khi sửa.
const COMBINING_MARKS = /[\u0300-\u036f]/g;

/**
 * Chuẩn hoá chuỗi để so khớp khi tìm kiếm: bỏ dấu tiếng Việt, không phân biệt
 * hoa/thường, gộp khoảng trắng. Nhờ vậy gõ "nguyen uoc" vẫn khớp "Nguyễn Ước".
 */
export function normalizeForSearch(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(COMBINING_MARKS, "")
      // đ/Đ không tách được bằng NFD nên phải map tay.
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Query rỗng = khớp tất cả. So khớp theo từng từ (mọi từ đều phải xuất hiện,
 * không cần liền nhau) để gõ "nguyen uoc" vẫn ra "Nguyễn Thị Ngọc Ước" —
 * nhóm ở app này đặt theo tên người nên hay bị bỏ qua tên đệm.
 */
export function matchesSearch(haystack: string, query: string): boolean {
  const q = normalizeForSearch(query);
  if (!q) return true;
  const target = normalizeForSearch(haystack);
  return q.split(" ").every((token) => target.includes(token));
}
