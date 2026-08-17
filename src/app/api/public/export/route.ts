import { z } from "zod";

import { getReportGroups } from "@/entities/group/server";
import { fail } from "@/shared/lib/api-response";
import { renderReport, type ReportFormat } from "@/shared/lib/report";

const formatSchema = z.enum(["csv", "md", "html", "xlsx"]);

// CÔNG KHAI (không auth): xuất báo cáo nhóm nợ đang hoạt động (không gồm lịch sử).
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const parsedFormat = formatSchema.safeParse(url.searchParams.get("format"));
    if (!parsedFormat.success) {
      return fail("Định dạng không hợp lệ", 400);
    }
    const format: ReportFormat = parsedFormat.data;

    const idsParam = url.searchParams.get("groupIds")?.trim();
    const groupIds = idsParam ? idsParam.split(",").filter(Boolean) : [];

    const groups = await getReportGroups(groupIds);
    if (groups.length === 0) {
      return fail("Không có nhóm nợ nào để xuất", 400);
    }

    const { body, contentType, filename } = renderReport(groups, format);
    return new Response(body as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("public export error:", error);
    return fail("Xuất báo cáo thất bại", 500);
  }
}
