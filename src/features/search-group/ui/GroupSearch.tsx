"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useGroupSearch } from "../model/store";

/**
 * Tìm nhóm nợ: bình thường chỉ là icon kính lúp, bấm vào mới bung ra ô nhập.
 * Ô nhập nổi đè lên thanh công cụ (không chiếm chỗ) nên tiêu đề và nút xuất
 * báo cáo không bị bóp lại trên màn hình hẹp.
 */
export function GroupSearch() {
  const query = useGroupSearch((s) => s.query);
  const setQuery = useGroupSearch((s) => s.setQuery);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Còn từ khoá thì luôn mở: tránh trường hợp danh sách đang bị lọc mà người
  // dùng chỉ thấy mỗi cái icon, không hiểu vì sao thiếu nhóm.
  const open = expanded || query.length > 0;

  // Chỉ focus khi người dùng chủ động bấm mở (expanded), không focus khi ô mở
  // sẵn vì còn từ khoá cũ — tránh cướp focus lúc mới vào trang.
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  function close() {
    setQuery("");
    setExpanded(false);
  }

  return (
    <div className="relative flex size-8 shrink-0 items-center justify-end">
      {open ? (
        // Nền ĐỤC là bắt buộc, và là ngoại lệ có chủ ý giữa một giao diện toàn
        // kính: ô input bên trong có nền bán trong, nên nếu khối này cũng trong
        // thì nút + nằm dưới sẽ lộ xuyên qua ô search. Kính mờ cũng không cứu
        // được — vẫn thấy lờ mờ bóng cái nút.
        <div className="absolute top-1/2 right-0 z-20 w-[min(18rem,calc(100vw-2rem))] -translate-y-1/2 rounded-lg border border-[var(--glass-border)] bg-popover shadow-lg">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
            <Search className="size-4" />
          </span>
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            // Bỏ trống rồi rời khỏi ô thì tự thu lại thành icon.
            onBlur={() => {
              if (query.length === 0) setExpanded(false);
            }}
            placeholder="Tìm nhóm theo tên..."
            aria-label="Tìm nhóm nợ theo tên"
            // Ẩn nút xoá mặc định của webkit vì đã có nút X riêng theo style dự án.
            className="pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Đóng tìm kiếm"
            className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setExpanded(true)}
          aria-label="Tìm nhóm nợ"
          title="Tìm nhóm nợ"
        >
          <Search />
        </Button>
      )}
    </div>
  );
}
