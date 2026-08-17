import { ExportReport } from "@/features/export-report";
import { GroupBoard } from "@/widgets/group-board";
import { AppHeader } from "@/widgets/app-header";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Nhóm nợ</h1>
          <ExportReport />
        </div>
        <GroupBoard />
      </main>
    </div>
  );
}
