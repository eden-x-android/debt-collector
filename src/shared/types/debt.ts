/**
 * Kiểu dữ liệu domain dùng chung cho group/record.
 * Đặt ở shared vì các slice cùng layer (entities) không được import chéo nhau
 * (xem .agents/rules/coding-pattern.md).
 *
 * Số tiền (amount) đã được serialize từ Prisma Decimal → number; ngày → ISO string.
 */

export type RecordDto = {
  id: string;
  groupId: string;
  amount: number;
  note: string | null;
  createdAt: string;
  doneAt: string | null;
  deletedAt: string | null;
};

export type GroupWithRecordsDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  /** Tổng nợ = tổng amount các record chưa done trong group. */
  total: number;
  /** Chỉ gồm các record chưa done. */
  records: RecordDto[];
};

/** Một dòng trong lịch sử: record đã done kèm tên group gốc. */
export type HistoryRecordDto = RecordDto & { groupName: string };

/** Một trang lịch sử. `nextOffset` = null nghĩa là đã hết dữ liệu. */
export type HistoryPageDto = {
  items: HistoryRecordDto[];
  nextOffset: number | null;
};
