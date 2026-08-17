import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/shared/api/http";
import type { HistoryRecordDto } from "@/shared/types/debt";

export const historyKeys = {
  all: ["history"] as const,
  list: () => [...historyKeys.all, "list"] as const,
};

/** Lấy danh sách lịch sử (record đã done). */
export function useHistory() {
  return useQuery({
    queryKey: historyKeys.list(),
    queryFn: () => apiFetch<HistoryRecordDto[]>("/api/history"),
  });
}
