// Public API (server) của entity record — dùng trong route handlers.
export {
  addRecord,
  addRecordSchema,
  listHistory,
  markRecordDone,
  purgeRecord,
  restoreRecord,
  softDeleteRecord,
} from "./record-service";
