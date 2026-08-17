import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/shared/api/http";
import type { GroupWithRecordsDto } from "@/shared/types/debt";

export const groupKeys = {
  all: ["groups"] as const,
  list: () => [...groupKeys.all, "list"] as const,
};

/** Lấy danh sách group đang hoạt động (kèm record chưa done + tổng nợ). */
export function useGroups() {
  return useQuery({
    queryKey: groupKeys.list(),
    queryFn: () => apiFetch<GroupWithRecordsDto[]>("/api/groups"),
  });
}
