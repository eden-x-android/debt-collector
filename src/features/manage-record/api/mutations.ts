import { useMutation, useQueryClient } from "@tanstack/react-query";

import { groupKeys } from "@/entities/group";
import { historyKeys } from "@/entities/record";
import { apiFetch, apiPost } from "@/shared/api/http";
import type { RecordDto } from "@/shared/types/debt";

/** Thêm khoản nợ vào group. */
export function useAddRecord(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { amount: number; note?: string; createdAt?: string }) =>
      apiPost<RecordDto>(`/api/groups/${groupId}/records`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

/** Đánh dấu done 1 record (chuyển vào lịch sử). */
export function useMarkRecordDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      apiPost<{ done: boolean }>(`/api/records/${recordId}/done`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}

/** Xoá 1 record đang active (soft-delete → chuyển vào lịch sử). */
export function useDeleteRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      apiFetch<{ deleted: boolean }>(`/api/records/${recordId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}
