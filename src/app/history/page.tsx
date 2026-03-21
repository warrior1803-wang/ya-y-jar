import { createClient } from "@/lib/supabase/server";
import HistoryView from "./HistoryView";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("entries")
    .select("id, content, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <HistoryView entries={entries ?? []} />;
}
