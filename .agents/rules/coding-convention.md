# Coding Convention

- TypeScript strict mode is mandatory. Avoid `any` unless truly unavoidable — if used, add a comment explaining why.
- Format with Prettier, lint with ESLint (`next/core-web-vitals` + `@typescript-eslint`). Code must pass lint before being considered done.
- Naming:
  - Components/types/interfaces: PascalCase (`DebtGroupCard`, `DebtRecord`).
  - Variables, functions, hooks: camelCase (`useDebtGroups`, `totalAmount`).
  - Component files: PascalCase (`DebtGroupCard.tsx`); other files (hooks, utils, config): kebab-case or camelCase following Next.js conventions.
  - Folders: kebab-case.
- Imports: use absolute imports via the `@/` alias (avoid relative paths like `../../../`).
- Components: function components + hooks only, no class components.
- A file should have a single clear responsibility; if a component/hook exceeds ~150 lines, consider splitting it.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`...).
