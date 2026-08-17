import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/shared/api/http";
import type { GroupWithRecordsDto } from "@/shared/types/debt";

export const groupKeys = {
  all: ["groups"] as const,
  list: () => [...groupKeys.all, "list"] as const,
  publicList: () => [...groupKeys.all, "public"] as const,
};

/** Lấy danh sách group đang hoạt động (kèm record chưa done + tổng nợ). */
export function useGroups() {
  return useQuery({
    queryKey: groupKeys.list(),
    queryFn: () => apiFetch<GroupWithRecordsDto[]>("/api/groups"),
  });
}

/** Bản công khai (không auth) cho public board — chỉ đọc, không gồm lịch sử. */
export function usePublicGroups() {
  return useQuery({
    queryKey: groupKeys.publicList(),
    queryFn: () => apiFetch<GroupWithRecordsDto[]>("/api/public/groups"),
  });
}
