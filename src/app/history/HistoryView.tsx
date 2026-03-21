"use client";

import Link from "next/link";
import SlipCard from "@/components/SlipCard";
import UserMenu from "@/components/UserMenu";
import BottomNav from "@/components/BottomNav";
import { useLang } from "@/i18n/LanguageContext";

const FONT = "'Caveat', 'Ma Shan Zheng', serif";
const ROTATIONS = [-2, -1, 0, 1, 2];

interface Entry {
  id: string;
  content: string;
  created_at: string;
}

export default function HistoryView({ entries }: { entries: Entry[] }) {
  const { t, formatDate } = useLang();

  return (
    <main
      style={{
        fontFamily: FONT,
        background: "#FDF8F2",
        minHeight: "100vh",
        paddingBottom: 96,
      }}
    >
      <UserMenu />

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          background: "#FDF8F2",
          borderBottom: "1px solid #EDD9C8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 16px",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(20px, 5vw, 26px)",
            color: "#3D2B1F",
            margin: 0,
          }}
        >
          {t("history.title")}
        </h1>
      </header>

      {/* Content */}
      {entries.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 16,
            textAlign: "center",
            padding: "24px",
          }}
        >
          <span style={{ fontSize: 64 }}>🫙</span>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "clamp(16px, 4vw, 20px)",
              color: "#6B4C3B",
              margin: 0,
            }}
          >
            {t("history.emptyText")}
          </p>
          <Link href="/write">
            <button
              style={{
                fontFamily: FONT,
                fontSize: 18,
                background: "#F9A875",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                padding: "12px 30px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(249,168,117,0.4)",
              }}
            >
              {t("history.emptyBtn")}
            </button>
          </Link>
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              style={{
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
                transformOrigin: "center",
              }}
            >
              <SlipCard
                content={entry.content}
                date={formatDate(entry.created_at)}
                defaultOpen
                hideReset
              />
            </li>
          ))}
        </ul>
      )}

      <BottomNav />
    </main>
  );
}
