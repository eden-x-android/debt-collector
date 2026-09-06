"use client";

import { ExportReport } from "@/features/export-report";
import { CreateGroupButton } from "@/features/manage-group";
import { GroupSearch, useGroupSearch } from "@/features/search-group";
import { cn } from "@/shared/lib/utils";

/**
 * Thanh công cụ trang nhóm nợ. Khi ô tìm kiếm bung ra thì tiêu đề và các nút
 * còn lại tạm ẩn đi, nhường cả hàng cho ô nhập — trên màn hình hẹp mà giữ đủ
 * thì ô tìm kiếm chỉ còn vài chục pixel.
 */
export function GroupToolbar() {
  const searchOpen = useGroupSearch((s) => s.open);

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      {searchOpen ? null : (
        <h1 className="min-w-0 truncate font-display text-2xl font-bold tracking-tight">
          Nhóm nợ
        </h1>
      )}
      <div
        className={cn(
          "flex items-center gap-2",
          searchOpen ? "min-w-0 flex-1" : "shrink-0",
        )}
      >
        {searchOpen ? null : <CreateGroupButton />}
        <GroupSearch />
        {searchOpen ? null : <ExportReport />}
      </div>
    </div>
  );
}
