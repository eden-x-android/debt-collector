import { useMutation, useQueryClient } from "@tanstack/react-query";

import { groupKeys } from "@/entities/group";
import { historyKeys } from "@/entities/record";
import { apiFetch, apiPost } from "@/shared/api/http";

/** Khôi phục record từ lịch sử về group (active trở lại). */
export function useRestoreRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      apiPost<{ restored: boolean }>(`/api/records/${recordId}/restore`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

/** Xoá hẳn record khỏi lịch sử (không thể khôi phục). */
export function useDeleteHistoryRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      apiFetch<{ deleted: boolean }>(`/api/records/${recordId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
    },
  });
}
