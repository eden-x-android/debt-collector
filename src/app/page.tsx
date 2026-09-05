import { GroupBoard } from "@/widgets/group-board";
import { GroupToolbar } from "@/widgets/group-toolbar";
import { AppHeader } from "@/widgets/app-header";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <GroupToolbar />
        <GroupBoard />
      </main>
    </div>
  );
}
