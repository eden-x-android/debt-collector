"use client";

import type { ReportPreview } from "../api/use-preview-report";

/** Khung hiển thị bản xem trước báo cáo (HTML trong iframe, PNG là ảnh). */
export function ReportPreviewPane({ preview }: { preview: ReportPreview }) {
  if (preview.format === "png") {
    return (
      // Ảnh báo cáo có thể cao tới 4000px nên phải cuộn được trong khung.
      <div className="max-h-[60vh] overflow-auto rounded-lg border border-[var(--glass-quiet-border)] bg-white">
        {/* Ảnh do chính server sinh, kích thước biết trước ở runtime nên dùng
            <img> thường thay vì next/image (next/image cần width/height tĩnh
            hoặc fill, và tối ưu hoá là vô nghĩa với blob URL tạm). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview.url} alt="Xem trước báo cáo nợ" className="w-full" />
      </div>
    );
  }

  return (
    // sandbox="" tước mọi quyền của iframe (không script, không form, không
    // same-origin). Nội dung là HTML do server dựng và đã escape, nhưng nó chứa
    // dữ liệu người dùng nhập nên vẫn cô lập cho chắc.
    <iframe
      title="Xem trước báo cáo nợ"
      sandbox=""
      srcDoc={preview.html}
      className="h-[60vh] w-full rounded-lg border border-[var(--glass-quiet-border)] bg-white"
    />
  );
}
