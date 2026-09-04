// ⚠️ TRANG TẠM — chỉ để xem giao diện khi chưa có .env.local. Xoá thư mục này
// và đoạn whitelist /preview trong src/proxy.ts khi test xong.
import { notFound } from "next/navigation";

import { PreviewClient } from "./preview-client";

export const metadata = { title: "Xem thử giao diện" };

export default function PreviewPage() {
  // Chốt chặn: build production sẽ trả 404, không có cách nào lộ ra ngoài.
  if (process.env.NODE_ENV === "production") notFound();
  return <PreviewClient />;
}
