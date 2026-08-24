import { z } from "zod";

import { getReportGroups } from "@/entities/group/server";
import { fail } from "@/shared/lib/api-response";
import { renderReport, type ReportFormat } from "@/shared/lib/report";
import { getSession } from "@/shared/lib/session";
import { REPORT_FORMATS } from "@/shared/types/report";

// Render PNG (Satori + resvg) tốn thời gian hơn các định dạng text; nới trần
// thời gian chạy. Route phải ở Node runtime (mặc định) vì Prisma cần Node.
export const maxDuration = 30;

const formatSchema = z.enum(REPORT_FORMATS);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return fail("Chưa đăng nhập", 401);

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

    const { body, contentType, filename } = await renderReport(groups, format);

    return new Response(body as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("export error:", error);
    return fail("Xuất báo cáo thất bại", 500);
  }
}
