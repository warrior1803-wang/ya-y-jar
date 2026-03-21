"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/i18n/LanguageContext";

const FONT = "'Caveat', 'Ma Shan Zheng', serif";

const NAV_KEYS = [
  { href: "/", icon: "🫙", labelKey: "nav.home" },
  { href: "/write", icon: "✏️", labelKey: "nav.write" },
  { href: "/history", icon: "📖", labelKey: "nav.history" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "#FFF9F4",
        borderTop: "1px solid #F3E8DC",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 40,
      }}
    >
      {NAV_KEYS.map(({ href, icon, labelKey }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "10px 0 8px",
              fontFamily: FONT,
              fontSize: 13,
              color: active ? "#F9A875" : "#7A5C4F",
              fontWeight: active ? 600 : 400,
              textDecoration: "none",
              transition: "color 0.15s",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
            <span>{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
