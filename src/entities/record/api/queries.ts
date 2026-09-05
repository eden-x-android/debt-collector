import { useInfiniteQuery } from "@tanstack/react-query";

import { apiFetch } from "@/shared/api/http";
import type { HistoryPageDto } from "@/shared/types/debt";

/** Số dòng lịch sử tải mỗi lần bấm "Tải thêm". */
export const HISTORY_PAGE_SIZE = 20;

export const historyKeys = {
  all: ["history"] as const,
  list: () => [...historyKeys.all, "list"] as const,
};

/** Lịch sử (record đã done/đã xoá), tải dần theo trang. */
export function useHistory() {
  return useInfiniteQuery({
    queryKey: historyKeys.list(),
    queryFn: ({ pageParam }) =>
      apiFetch<HistoryPageDto>(
        `/api/history?limit=${HISTORY_PAGE_SIZE}&offset=${pageParam}`,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}
