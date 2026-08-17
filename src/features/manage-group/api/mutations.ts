import { useMutation, useQueryClient } from "@tanstack/react-query";

import { groupKeys } from "@/entities/group";
import { historyKeys } from "@/entities/record";
import { apiFetch, apiPost } from "@/shared/api/http";

/** Tạo group mới. */
export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      apiPost<{ id: string }>("/api/groups", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

/** Đánh dấu done cả group (toàn bộ record chuyển vào lịch sử). */
export function useMarkGroupDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      apiPost<{ done: boolean }>(`/api/groups/${groupId}/done`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}

/** Xoá group rỗng. */
export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      apiFetch<{ deleted: boolean }>(`/api/groups/${groupId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
