// Kết xuất báo cáo nợ thành PNG bằng Satori (next/og). Server-only, Node runtime.
//
// Satori chỉ hỗ trợ một tập con của flexbox: không display:table, không grid,
// không float, không colspan. Vì vậy markup của toHtml() không tái dùng được và
// bảng phải dựng lại bằng flex row/column với style inline.
import { ImageResponse } from "next/og";

import type { GroupWithRecordsDto } from "@/shared/types/debt";

import { REPORT_FONT_FAMILY, loadReportFonts } from "./fonts";
import {
  fmtDate,
  grandTotal,
  isCredit,
  nowLabel,
  numberFmt,
  sanitizeText,
} from "./format";

export const CANVAS_WIDTH = 1200;

// Chiều cao ảnh tối đa: 1200×4000 ≈ 19MB RGBA, render ~0.4–2s, an toàn với
// timeout mặc định của Vercel Hobby.
const MAX_HEIGHT = 4000;

// ── Hằng số layout ─────────────────────────────────────────────────────
// Mọi khối đều đặt height tường minh để công thức chiều cao ở measure() khớp
// đúng box model Satori vẽ ra (dùng margin thay gap vì lý do này).
const PAD_X = 48;
const PAD_TOP = 44;
const PAD_BOTTOM = 44;

const TITLE_H = 104;
const GROUP_NAME_H = 40;
const GROUP_NAME_MB = 10;
const COL_HEAD_H = 32;
const COL_HEAD_MB = 6;
const ROW_H = 40;
const MORE_H = 34; // dòng "… và N khoản khác"
const SUBTOTAL_MT = 8;
const SUBTOTAL_H = 44;
const GROUP_GAP = 26;
const GRAND_MT = 24;
const GRAND_H = 64;
const SAFETY = 8; // thà cao dư vài px hơn là bị cắt mất chữ

const GROUP_FIXED_H =
  GROUP_NAME_H + GROUP_NAME_MB + COL_HEAD_H + COL_HEAD_MB + SUBTOTAL_MT + SUBTOTAL_H;

const FIXED_OVERHEAD =
  PAD_TOP + TITLE_H + GRAND_MT + GRAND_H + PAD_BOTTOM + SAFETY;

const COL_AMOUNT_W = 230;
const COL_DATE_W = 190;
const COL_GAP = 20;
const ROW_PAD_X = 12;

// Cắt cứng theo số ký tự vì Satori không được cho text wrap (wrap sẽ làm dòng
// cao hơn ROW_H và lệch toàn bộ công thức chiều cao) và cũng không dùng
// overflow:hidden được — clipPath của resvg đắt kinh khủng (đo được: chỉ riêng
// một clip ở root làm thời gian render tăng ~12x).
const NOTE_MAX = 42;
const GROUP_NAME_MAX = 40;

const C = {
  bg: "#ffffff",
  text: "#111827",
  muted: "#6b7280",
  line: "#e5e7eb",
  headBg: "#f3f4f6",
  credit: "#15803d", // số âm = cấn trừ, làm giảm nợ
  creditBg: "#ecfdf5",
} as const;

// ── View model ─────────────────────────────────────────────────────────
type PlannedRow = {
  amount: string;
  credit: boolean;
  note: string;
  date: string;
};

type PlannedGroup = {
  name: string;
  rows: PlannedRow[];
  hiddenRows: number;
  total: string;
  totalCredit: boolean;
};

export type ReportPlan = {
  height: number;
  groups: PlannedGroup[];
  hiddenGroups: number;
  grandTotal: string;
  grandCredit: boolean;
  generatedAt: string;
};

function fmtMoney(n: number): string {
  return `${numberFmt.format(n)} đ`;
}

/** Chiều cao ảnh nếu mỗi nhóm thứ i hiển thị `quota[i]` dòng. */
function measure(
  quota: number[],
  counts: number[],
  hiddenGroups: number,
): number {
  const n = quota.length;
  let h = FIXED_OVERHEAD + n * GROUP_FIXED_H + Math.max(0, n - 1) * GROUP_GAP;
  for (let i = 0; i < n; i++) {
    // Nhóm rỗng vẫn chiếm 1 dòng cho chữ "(không có khoản nợ)".
    h += Math.max(1, quota[i]) * ROW_H;
    if (quota[i] < counts[i]) h += MORE_H;
  }
  if (hiddenGroups > 0) h += MORE_H;
  return h;
}

/**
 * Dựng view model đã cắt/chuẩn hoá sẵn kèm chiều cao đã tính, để component chỉ
 * việc render.
 *
 * Khi báo cáo quá dài, các dòng bị cắt bớt (chia round-robin để một nhóm khổng
 * lồ không chiếm hết quota; record đã sort createdAt desc nên phần giữ lại là
 * mới nhất). QUAN TRỌNG: `g.total` và grandTotal() lấy từ tổng hợp DB, KHÔNG
 * phải cộng các dòng đang hiển thị → cắt dòng không làm sai số tổng, chỉ lược
 * bớt chi tiết.
 */
export function planReport(groups: GroupWithRecordsDto[]): ReportPlan {
  const counts = groups.map((g) => g.records.length);

  // 1) Bao nhiêu nhóm vừa khung, với tối thiểu 1 dòng mỗi nhóm.
  let shownCount = groups.length;
  while (shownCount > 1) {
    const c = counts.slice(0, shownCount);
    const q = c.map((n) => Math.min(1, n));
    if (measure(q, c, groups.length - shownCount) <= MAX_HEIGHT) break;
    shownCount--;
  }

  const shown = groups.slice(0, shownCount);
  const shownCounts = counts.slice(0, shownCount);
  const hiddenGroups = groups.length - shownCount;

  // 2) Chia phần chiều cao còn lại theo vòng tròn: mỗi lượt +1 dòng cho từng
  //    nhóm nào còn dòng chưa hiện và vẫn còn chỗ.
  const quota = shownCounts.map((n) => Math.min(1, n));
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (let i = 0; i < shownCount; i++) {
      if (quota[i] >= shownCounts[i]) continue;
      quota[i]++;
      if (measure(quota, shownCounts, hiddenGroups) <= MAX_HEIGHT) {
        progressed = true;
      } else {
        quota[i]--;
      }
    }
  }

  const plannedGroups: PlannedGroup[] = shown.map((g, i) => ({
    name: sanitizeText(g.name, GROUP_NAME_MAX),
    rows: g.records.slice(0, quota[i]).map((r) => ({
      amount: numberFmt.format(r.amount),
      credit: isCredit(r.amount),
      note: sanitizeText(r.note ?? "", NOTE_MAX),
      date: fmtDate(r.createdAt),
    })),
    hiddenRows: shownCounts[i] - quota[i],
    total: fmtMoney(g.total),
    totalCredit: isCredit(g.total),
  }));

  const total = grandTotal(groups);

  return {
    height: measure(quota, shownCounts, hiddenGroups),
    groups: plannedGroups,
    hiddenGroups,
    grandTotal: fmtMoney(total),
    grandCredit: isCredit(total),
    generatedAt: `Xuất ngày ${nowLabel()}`,
  };
}

// ── Component Satori ───────────────────────────────────────────────────
// Lưu ý: mọi element có nhiều hơn 1 con PHẢI có display:flex (Satori throw nếu
// thiếu), flexDirection phải khai báo tường minh (mặc định của Satori là "row",
// khác Yoga), và border phải dùng longhand.
function ReportImage({ plan }: { plan: ReportPlan }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: CANVAS_WIDTH,
        height: plan.height,
        paddingTop: PAD_TOP,
        paddingBottom: PAD_BOTTOM,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        // Bắt buộc: thiếu thì PNG trong suốt, mở trong app dark mode sẽ như
        // chữ đen trên nền đen.
        backgroundColor: C.bg,
        color: C.text,
        fontFamily: REPORT_FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: TITLE_H,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Báo cáo ghi nợ
        </div>
        <div
          style={{ display: "flex", fontSize: 20, color: C.muted, marginTop: 8 }}
        >
          {plan.generatedAt}
        </div>
      </div>

      {plan.groups.map((g, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: i === plan.groups.length - 1 ? 0 : GROUP_GAP,
          }}
        >
          <div
            style={{
              display: "flex",
              height: GROUP_NAME_H,
              marginBottom: GROUP_NAME_MB,
              alignItems: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {g.name}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: COL_HEAD_H,
              marginBottom: COL_HEAD_MB,
              alignItems: "center",
              backgroundColor: C.headBg,
              paddingLeft: ROW_PAD_X,
              paddingRight: ROW_PAD_X,
              fontSize: 17,
              fontWeight: 700,
              color: C.muted,
            }}
          >
            <div
              style={{
                display: "flex",
                width: COL_AMOUNT_W,
                justifyContent: "flex-end",
              }}
            >
              Số tiền (VND)
            </div>
            <div style={{ display: "flex", flexGrow: 1, marginLeft: COL_GAP }}>
              Ghi chú
            </div>
            <div
              style={{
                display: "flex",
                width: COL_DATE_W,
                marginLeft: COL_GAP,
                justifyContent: "flex-end",
              }}
            >
              Ngày ghi nợ
            </div>
          </div>

          {g.rows.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: ROW_H,
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: C.muted,
              }}
            >
              (không có khoản nợ)
            </div>
          ) : (
            g.rows.map((r, j) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: ROW_H,
                  alignItems: "center",
                  paddingLeft: ROW_PAD_X,
                  paddingRight: ROW_PAD_X,
                  borderBottomWidth: 1,
                  borderBottomStyle: "solid",
                  borderBottomColor: C.line,
                  fontSize: 19,
                  backgroundColor: r.credit ? C.creditBg : C.bg,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: COL_AMOUNT_W,
                    justifyContent: "flex-end",
                    fontWeight: 700,
                    color: r.credit ? C.credit : C.text,
                  }}
                >
                  {r.amount}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    marginLeft: COL_GAP,
                    color: r.note ? C.text : C.muted,
                  }}
                >
                  {r.note || "—"}
                </div>
                <div
                  style={{
                    display: "flex",
                    width: COL_DATE_W,
                    marginLeft: COL_GAP,
                    justifyContent: "flex-end",
                    fontSize: 17,
                    color: C.muted,
                  }}
                >
                  {r.date}
                </div>
              </div>
            ))
          )}

          {g.hiddenRows > 0 ? (
            <div
              style={{
                display: "flex",
                height: MORE_H,
                alignItems: "center",
                paddingLeft: ROW_PAD_X,
                fontSize: 17,
                color: C.muted,
              }}
            >
              {`… và ${g.hiddenRows} khoản khác`}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: SUBTOTAL_H,
              marginTop: SUBTOTAL_MT,
              alignItems: "center",
              paddingLeft: ROW_PAD_X,
              paddingRight: ROW_PAD_X,
              fontSize: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                width: COL_AMOUNT_W,
                justifyContent: "flex-end",
                fontWeight: 700,
                color: g.totalCredit ? C.credit : C.text,
              }}
            >
              {g.total}
            </div>
            <div style={{ display: "flex", marginLeft: COL_GAP, color: C.muted }}>
              Tổng nhóm
            </div>
          </div>
        </div>
      ))}

      {plan.hiddenGroups > 0 ? (
        <div
          style={{
            display: "flex",
            height: MORE_H,
            alignItems: "center",
            fontSize: 17,
            color: C.muted,
          }}
        >
          {`… và ${plan.hiddenGroups} nhóm khác`}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: GRAND_H,
          marginTop: GRAND_MT,
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: ROW_PAD_X,
          paddingRight: ROW_PAD_X,
          borderTopWidth: 2,
          borderTopStyle: "solid",
          borderTopColor: C.text,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex" }}>TỔNG CỘNG</div>
        <div
          style={{
            display: "flex",
            color: plan.grandCredit ? C.credit : C.text,
          }}
        >
          {plan.grandTotal}
        </div>
      </div>
    </div>
  );
}

/**
 * Kết xuất PNG. Buffer ra Uint8Array thay vì trả ImageResponse trực tiếp để
 * lỗi Satori rơi vào try/catch của route (ImageResponse render lazy theo stream
 * → throw sau khi header đã flush sẽ thành HTTP 200 với body cắt dở), và để
 * giữ header Cache-Control: no-store của route.
 */
export async function renderPng(
  groups: GroupWithRecordsDto[],
): Promise<Uint8Array> {
  const fonts = await loadReportFonts();
  const plan = planReport(groups);

  const res = new ImageResponse(<ReportImage plan={plan} />, {
    width: CANVAS_WIDTH,
    height: plan.height,
    fonts,
  });

  return new Uint8Array(await res.arrayBuffer());
}
