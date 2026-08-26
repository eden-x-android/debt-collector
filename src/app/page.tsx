import { ExportReport } from "@/features/export-report";
import { CreateGroupButton } from "@/features/manage-group";
import { GroupSearch } from "@/features/search-group";
import { GroupBoard } from "@/widgets/group-board";
import { AppHeader } from "@/widgets/app-header";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-xl font-semibold">Nhóm nợ</h1>
          <div className="flex shrink-0 items-center gap-2">
            <CreateGroupButton />
            <GroupSearch />
            <ExportReport />
          </div>
        </div>
        <GroupBoard />
      </main>
    </div>
  );
}
