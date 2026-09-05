import { create } from "zustand";

type GroupSearchState = {
  query: string;
  /** Ô tìm kiếm đang bung ra hay đang thu lại thành icon. */
  open: boolean;
  setQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
};

/**
 * Trạng thái tìm nhóm nợ. Là UI state nên để ở Zustand: ô tìm kiếm nằm trên
 * thanh công cụ, việc lọc diễn ra trong GroupBoard, còn các nút khác trên thanh
 * công cụ phải tự ẩn khi ô bung ra — ba chỗ khác nhánh component nên không
 * truyền prop cho nhau được.
 */
export const useGroupSearch = create<GroupSearchState>((set) => ({
  query: "",
  open: false,
  setQuery: (query) => set({ query }),
  openSearch: () => set({ open: true }),
  // Đóng thì xoá luôn từ khoá: ô đã thu lại thành icon mà danh sách vẫn bị lọc
  // ngầm thì người dùng không hiểu vì sao thiếu nhóm.
  closeSearch: () => set({ open: false, query: "" }),
}));
