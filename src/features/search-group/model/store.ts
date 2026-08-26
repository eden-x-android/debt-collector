import { create } from "zustand";

type GroupSearchState = {
  query: string;
  setQuery: (query: string) => void;
};

/**
 * Từ khoá lọc nhóm nợ. Là UI state nên để ở Zustand: ô tìm kiếm nằm trên thanh
 * công cụ còn việc lọc diễn ra trong GroupBoard — hai chỗ khác nhánh component
 * nên không truyền prop cho nhau được.
 */
export const useGroupSearch = create<GroupSearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
