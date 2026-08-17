"use client";

import { usePublicGroups } from "@/entities/group";

import { ExportPanel } from "./ExportPanel";

/** Nút xuất báo cáo cho public board (endpoint công khai, không auth). */
export function PublicExportReport() {
  const { data } = usePublicGroups();
  return <ExportPanel groups={data} exportPath="/api/public/export" />;
}
