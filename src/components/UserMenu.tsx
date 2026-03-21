"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GearSix } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/i18n/LanguageContext";

const FONT = "'Caveat', 'Ma Shan Zheng', serif";

export default function UserMenu() {
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/landing");
  }

  const signOutLabel = signingOut ? t("userMenu.loggingOut") : t("userMenu.logout");

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 600,
          color: "#7A5C4F",
          transition: "background 0.15s",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#FFF3E6";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        {lang === "zh" ? "EN" : "中文"}
      </button>

      {/* Gear button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: open ? "#FFF3E6" : "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
          color: "#7A5C4F",
        }}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = "#FFF3E6";
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <GearSix size={22} weight="regular" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85, y: -4 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.85, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              transformOrigin: "top right",
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              minWidth: 180,
              maxWidth: "calc(100vw - 32px)",
              background: "#FFF9F4",
              borderRadius: 10,
              border: "1px solid #EDD9C8",
              boxShadow: "0 4px 20px rgba(61,43,31,0.10)",
              overflow: "hidden",
            }}
          >
            {email && (
              <div
                style={{
                  padding: "10px 14px 8px",
                  fontFamily: FONT,
                  fontSize: 13,
                  color: "#7A5C4F",
                  wordBreak: "break-all",
                }}
              >
                {email}
              </div>
            )}
            <div style={{ height: 1, background: "#F3E8DC", margin: "0 10px" }} />
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontFamily: FONT,
                fontSize: 15,
                color: "#3D2B1F",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: signingOut ? "default" : "pointer",
                opacity: signingOut ? 0.5 : 1,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#FFF3E6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              {signOutLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
