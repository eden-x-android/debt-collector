"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useGroupSearch } from "../model/store";

/**
 * Tìm nhóm nợ: bình thường chỉ là icon kính lúp, bấm vào mới bung ra ô nhập.
 * Khi bung ra, ô nhập chiếm trọn hàng còn GroupToolbar ẩn tiêu đề và các nút
 * còn lại — nhờ vậy không cần lớp nền đục để che nút nằm dưới như trước.
 */
export function GroupSearch() {
  const query = useGroupSearch((s) => s.query);
  const setQuery = useGroupSearch((s) => s.setQuery);
  const open = useGroupSearch((s) => s.open);
  const openSearch = useGroupSearch((s) => s.openSearch);
  const closeSearch = useGroupSearch((s) => s.closeSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(false);

  // Chỉ focus khi người dùng chủ động bấm mở, không focus ở lần render đầu (ô
  // có thể đang mở sẵn do quay lại trang) — tránh cướp focus lúc mới vào trang.
  useEffect(() => {
    if (mounted.current && open) inputRef.current?.focus();
    mounted.current = true;
  }, [open]);

  if (!open) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={openSearch}
        aria-label="Tìm nhóm nợ"
        title="Tìm nhóm nợ"
      >
        <Search />
      </Button>
    );
  }

  return (
    <div className="relative min-w-0 flex-1">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        <Search className="size-4" />
      </span>
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSearch();
        }}
        // Bỏ trống rồi rời khỏi ô thì tự thu lại thành icon. Còn từ khoá thì
        // giữ nguyên, nếu không nút X sẽ biến mất trước khi kịp bấm.
        onBlur={() => {
          if (query.length === 0) closeSearch();
        }}
        placeholder="Tìm nhóm theo tên..."
        aria-label="Tìm nhóm nợ theo tên"
        // Ẩn nút xoá mặc định của webkit vì đã có nút X riêng theo style dự án.
        className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="button"
        onClick={closeSearch}
        aria-label="Đóng tìm kiếm"
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
