"use client";

// ⚠️ FILE TẠM — chỉ để xem giao diện khi chưa có .env.local (không DB, không
// đăng nhập). Xoá cả thư mục src/app/preview và đoạn whitelist trong proxy.ts
// khi test xong.
//
// Cách hoạt động: bọc một QueryClient riêng đã nhồi sẵn dữ liệu vào đúng cache
// key mà useGroups() dùng, kèm staleTime: Infinity nên nó không gọi /api/groups.
// Không đụng gì tới code thật.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { groupKeys } from "@/entities/group";
import { ExportReport } from "@/features/export-report";
import { CreateGroupButton } from "@/features/manage-group";
import { GroupSearch } from "@/features/search-group";
import type { GroupWithRecordsDto } from "@/shared/types/debt";
import { AppHeader } from "@/widgets/app-header";
import { GroupBoard } from "@/widgets/group-board";

function iso(day: number, hour = 10, minute = 30): string {
  return new Date(2026, 7, day, hour, minute).toISOString();
}

function mkGroup(
  id: string,
  name: string,
  records: { amount: number; note: string | null; day: number }[],
): GroupWithRecordsDto {
  return {
    id,
    name,
    createdAt: iso(1),
    updatedAt: iso(1),
    total: records.reduce((s, r) => s + r.amount, 0),
    records: records.map((r, i) => ({
      id: `${id}-${i}`,
      groupId: id,
      amount: r.amount,
      note: r.note,
      createdAt: iso(r.day),
      doneAt: null,
      deletedAt: null,
    })),
  };
}

// Dữ liệu cố ý phủ các trạng thái đáng xem: số dương, số âm (cấn trừ), nhóm âm
// ròng, ghi chú dài, nhóm rỗng, và tên có nhiều dấu tiếng Việt để soi font.
const MOCK: GroupWithRecordsDto[] = [
  mkGroup("g1", "Nguyễn Thị Ngọc Ước", [
    { amount: 1_250_000, note: "ứng trước tiền phòng", day: 3 },
    { amount: -200_000, note: "mình nợ lại tiền xăng", day: 5 },
    { amount: 500_000, note: "ăn ốc đêm — đợt 2", day: 8 },
  ]),
  mkGroup("g2", "Trần Đình Phúc", [
    { amount: -800_000, note: "mình mượn trước", day: 2 },
    { amount: 300_000, note: null, day: 6 },
  ]),
  mkGroup("g3", "Lê Hoàng Bảo Ngân", [
    { amount: 4_500_000, note: "chuyển khoản mua vé máy bay Tết", day: 4 },
  ]),
  mkGroup("g4", "Nhóm rỗng", []),
];

export function PreviewClient() {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    qc.setQueryData(groupKeys.list(), MOCK);
    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          <div className="brutal mb-4 bg-accent px-3 py-2 text-sm font-medium text-accent-foreground [--brutal-shadow:var(--shadow-brutal-sm)]">
            Trang xem thử — dữ liệu giả, không có DB. Các nút ghi dữ liệu sẽ báo
            lỗi, đó là bình thường.
          </div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="min-w-0 truncate font-display text-2xl font-bold tracking-tight">
              Nhóm nợ
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <CreateGroupButton />
              <GroupSearch />
              <ExportReport />
            </div>
          </div>
          <GroupBoard />
        </main>
      </div>
    </QueryClientProvider>
  );
}
