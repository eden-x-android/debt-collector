import { HistoryBoard } from "@/widgets/history-board";
import { AppHeader } from "@/widgets/app-header";

export default function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Lịch sử</h1>
        <HistoryBoard />
      </main>
    </div>
  );
}
