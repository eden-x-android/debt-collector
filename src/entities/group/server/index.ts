// Public API (server) của entity group — dùng trong route handlers.
export {
  createGroup,
  createGroupSchema,
  deleteEmptyGroup,
  listActiveGroups,
  markGroupDone,
} from "./group-service";
