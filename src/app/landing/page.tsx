"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { GlassJar } from "@/components/GlassJar";
import SlipCard from "@/components/SlipCard";
import { useLang } from "@/i18n/LanguageContext";

const FONT = "'Caveat', 'Ma Shan Zheng', serif";

export default function LandingPage() {
  const { lang, setLang, t, ta, formatDate } = useLang();
  const jarCtrl = useAnimation();

  const [jarState, setJarState] = useState<"idle" | "shaking" | "fetching" | "showing">("idle");
  const [entry, setEntry] = useState<string | null>(null);
  const [cardTriggered, setCardTriggered] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  async function playAndFetch() {
    if (jarState !== "idle") return;
    setCardTriggered(false);
    setEntry(null);
    setJarState("shaking");
    await jarCtrl.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    setJarState("fetching");
    const examples = ta("landing.examples");
    const random = examples[Math.floor(Math.random() * examples.length)];
    setEntry(random);
    setJarState("showing");
  }

  return (
    <main
      style={{
        fontFamily: FONT,
        background: "#FDF8F2",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Lang toggle — top-left */}
      <button
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
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
          zIndex: 50,
        }}
      >
        {lang === "zh" ? "EN" : "中文"}
      </button>

      {/* App name */}
      <h1
        style={{
          fontFamily: "'Playfair Display', 'Ma Shan Zheng', serif",
          fontSize: "clamp(32px, 7vw, 56px)",
          color: "#3D2B1F",
          letterSpacing: "0.04em",
          margin: "0 0 32px",
          lineHeight: 1.1,
        }}
      >
        {t("common.appName")}
      </h1>

      {/* Card slot */}
      <div
        style={{
          minHeight: 180,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          {jarState === "showing" && entry && (
            <motion.div
              key={entry}
              initial={{ opacity: 0, y: 160 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60, transition: { duration: 0.25 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => setCardTriggered(true)}
            >
              <SlipCard
                content={entry}
                date={formatDate(new Date().toISOString())}
                triggered={cardTriggered}
                onOpen={() => setCtaVisible(true)}
                onReset={() => {
                  setCardTriggered(false);
                  setEntry(null);
                  setJarState("idle");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Jar */}
      <motion.div
        animate={jarCtrl}
        onClick={jarState === "idle" ? playAndFetch : undefined}
        style={{ cursor: jarState === "idle" ? "pointer" : "default" }}
        whileTap={jarState === "idle" ? { scale: 0.97 } : {}}
      >
        <GlassJar isShaking={jarState === "shaking" || jarState === "fetching"} />
      </motion.div>

      {/* Hint / CTA — mutually exclusive */}
      <AnimatePresence mode="wait">
        {jarState === "idle" && !ctaVisible && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: FONT,
              fontSize: "clamp(14px, 3vw, 17px)",
              color: "#C4A99A",
              margin: "24px 0 0",
              textAlign: "center",
            }}
          >
            {t("landing.hint")}
          </motion.p>
        )}

        {ctaVisible && (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <p
              style={{
                fontFamily: FONT,
                fontSize: "clamp(14px, 3vw, 17px)",
                color: "#C4A99A",
                margin: 0,
              }}
            >
              {t("landing.cta")}
            </p>
            <Link href="/login">
              <button
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(16px, 4vw, 19px)",
                  background: "#F9A875",
                  color: "#fff",
                  border: "none",
                  borderRadius: 28,
                  padding: "13px 36px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(249,168,117,0.45)",
                }}
              >
                {t("landing.startBtn")}
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copyright */}
      <p
        style={{
          position: "fixed",
          bottom: 12,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 12,
          color: "#D9C5B8",
          margin: 0,
          pointerEvents: "none",
        }}
      >
        {t("common.copyright")}
      </p>
    </main>
  );
}
