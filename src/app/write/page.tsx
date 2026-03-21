import { getTodayEntries } from "./actions";
import WriteForm from "./WriteForm";
import UserMenu from "@/components/UserMenu";
import BottomNav from "@/components/BottomNav";

export default async function WritePage() {
  const { entries } = await getTodayEntries();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FDF8F2",
        paddingBottom: 80,
      }}
    >
      <UserMenu />
      <WriteForm initialEntries={entries as { id: string; content: string; created_at: string }[]} />
      <BottomNav />
    </main>
  );
}
