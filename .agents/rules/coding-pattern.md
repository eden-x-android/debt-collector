# Coding Pattern

## FSD Architecture
- Layer order (imports may only flow downward): `app` → `pages` → `widgets` → `features` → `entities` → `shared`.
- A lower layer must never import from a higher layer. Within the same layer, slices from different domains must not import each other directly except through `shared`.
- Each slice (feature/entity/widget) exposes a single Public API via `index.ts` — never import a slice's internal file directly (e.g. `features/mark-done/model.ts` instead of `features/mark-done/index.ts` is wrong).

## Data & State
- Data fetching/mutation goes through **TanStack Query**, placed in `entities/*/api` or `features/*/api`. UI components must not call `fetch`/APIs directly.
- **Zustand** is only for client/UI state (current session, modal/filter state...), never for caching server data — that's TanStack Query's job.

## Backend (Next.js route handlers)
- Route handlers only receive the request, validate, call a service, and return a response — no complex business logic directly inside the route handler.
- Business logic (total debt calculation, group/record handling, OTP handling...) lives in a dedicated service layer (`shared/api` or a `server/` folder per entity).
- Error handling: try/catch at the API boundary, return a normalized response shape `{ success, data?, error? }`. UI shows errors via toast/error state, never throws raw errors to the user.

## General
- Don't create an abstraction/generic layer until there are at least 2 real use cases needing it — avoid over-engineering.
- Don't add features or refactor beyond the scope of the current task.
