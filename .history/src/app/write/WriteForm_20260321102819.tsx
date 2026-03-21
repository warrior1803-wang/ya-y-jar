"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import SlipCard from "@/components/SlipCard";
import { submitEntry } from "./actions";

const MAX = 200;
const FONT = "'Caveat', 'Ma Shan Zheng', serif";
const LINE_H = 25;

interface Entry {
  id: string;
  content: string;
  created_at: string;
}

interface WriteFormProps {
  initialEntries: Entry[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export default function WriteForm({ initialEntries }: WriteFormProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    const result = await submitEntry(text);

    if (result.success && result.entry) {
      setEntries((prev) => [result.entry!, ...prev]);
      setText("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.refresh();
      }, 1500);
    } else {
      setError(result.error ?? "出现了一点问题，请稍后再试");
    }

    setLoading(false);
  }

  return (
    <>
      {/* Fixed header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "#FDF8F2",
          borderBottom: "1px solid #F3E8DC",
          padding: "14px 16px 12px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(22px, 5vw, 28px)",
            color: "#3D2B1F",
            margin: "0 0 4px",
            lineHeight: 1.2,
          }}
        >
          夸夸瓶
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            color: "#7A5C4F",
            margin: entries.length > 0 ? "0 0 6px" : 0,
          }}
        >
          给今天的自己写一句话
        </p>
        {entries.length > 0 && (
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              color: "#7A5C4F",
              margin: 0,
            }}
          >
            今天已写 {entries.length} 条 ✨
          </p>
        )}
      </header>

      {/* Scrollable content — paddingTop clears the fixed header */}
      <div
        style={{
          paddingTop: entries.length > 0 ? 116 : 92,
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Existing entries */}
        {entries.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              width: "100%",
            }}
          >
            {entries.map((entry) => (
              <SlipCard
                key={entry.id}
                content={entry.content}
                date={formatDate(entry.created_at)}
                defaultOpen
                hideReset
              />
            ))}
          </div>
        )}

        {/* Write form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 384,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ position: "relative", transform: "rotate(-0.5deg)" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX))}
              placeholder="今天又做了什么好事..."
              rows={7}
              className="w-full resize-none rounded-[4px] pl-6 pr-4 pt-3 pb-8 text-[18px] text-text-primary placeholder:text-text-disabled focus:outline-none"
              style={{
                fontFamily: FONT,
                lineHeight: `${LINE_H}px`,
                backgroundColor: "#FFF9F4",
                backgroundImage: `repeating-linear-gradient(
                  transparent 0px, transparent ${LINE_H - 1}px, #EDD9C8 ${LINE_H}px
                )`,
                backgroundPositionY: "12px",
                borderLeft: "2px solid #FFB3B3",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "1px solid #EDD9C8",
                boxShadow: "2px 4px 12px rgba(61,43,31,0.08)",
              }}
            />
            <span
              className="absolute bottom-2 right-3 text-xs text-text-disabled select-none"
              style={{ fontFamily: FONT }}
            >
              {MAX - text.length}
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-400" style={{ fontFamily: FONT }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="py-2.5 rounded-[4px] bg-primary hover:bg-primary-hover text-bg-base font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: FONT }}
          >
            {loading ? "存入瓶子中…" : "放入瓶子"}
          </button>
        </form>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <div
            style={{
              position: "fixed",
              bottom: 96,
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                fontFamily: FONT,
                fontSize: 16,
                color: "#3D2B1F",
                background: "#FDDFC8",
                borderRadius: 24,
                padding: "10px 24px",
                boxShadow: "0 4px 16px rgba(61,43,31,0.12)",
                whiteSpace: "nowrap",
              }}
            >
              又放入一条 🫙
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
