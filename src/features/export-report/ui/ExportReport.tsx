"use client";

import { useGroups } from "@/entities/group";

import { ExportPanel } from "./ExportPanel";

/** Nút xuất báo cáo cho trang có đăng nhập (dùng endpoint có auth). */
export function ExportReport() {
  const { data } = useGroups();
  return <ExportPanel groups={data} exportPath="/api/export" />;
}
