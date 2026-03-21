import { getTodayEntry } from "./actions";
import WriteForm from "./WriteForm";

export default async function WritePage() {
  const { entry } = await getTodayEntry();

  return (
    <main className="min-h-screen bg-bg-base flex flex-col items-center px-4 py-16">
      <h1
        className="text-3xl text-text-primary mb-2"
        style={{ fontFamily: "'Caveat', 'Klee One', 'Huninn', serif" }}
      >
        夸夸瓶
      </h1>
      <p
        className="text-sm text-text-secondary mb-12 "
        style={{ fontFamily: "'Caveat', 'Klee One', 'Huninn', serif" }}
      >
        给今天的自己写一句话
      </p>

      <WriteForm initialEntry={entry ?? null} />
    </main>
  );
}
