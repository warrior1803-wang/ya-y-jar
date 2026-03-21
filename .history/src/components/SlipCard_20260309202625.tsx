"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

type Phase = "folded" | "expanding" | "open";

export interface SlipCardProps {
  content: string;
  date: string;
  /** Setting to true starts the unfold animation */
  triggered?: boolean;
  onOpen?: () => void;
  /** Called after internal reset so parent can clear triggered */
  onReset?: () => void;
}

const FONT = "'Caveat', 'Ma Shan Zheng', serif";
const LINE_H = 25;
const PAPER_PT = 16;

export default function SlipCard({
  content,
  date,
  triggered,
  onOpen,
  onReset,
}: SlipCardProps) {
  const [phase, setPhase] = useState<Phase>("folded");
  const phaseRef = useRef<Phase>("folded"); // avoid stale closures in async animation
  const containerCtrl = useAnimation();
  const textCtrl = useAnimation();
  const rotation = useRef((Math.random() * 2 - 1).toFixed(2)); // fixed on mount

  async function startAnimation() {
    if (phaseRef.current !== "folded") return;
    phaseRef.current = "expanding";

    // Phase 1 — shake (0–200ms)
    await containerCtrl.start({
      x: [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.2, ease: "easeInOut" },
    });

    // Remove folded overlay
    setPhase("expanding");

    // Phase 2 — expand width (200–500ms)
    await containerCtrl.start({
      width: 320,
      x: 0,
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
    });

    // Phase 3 — expand height + apply rotation (500–800ms)
    await containerCtrl.start({
      height: "auto",
      rotate: parseFloat(rotation.current),
      transition: { duration: 0.3, ease: "easeOut" },
    });

    // Phase 4 — text fade in (800–1200ms)
    await textCtrl.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    });

    phaseRef.current = "open";
    setPhase("open");
    onOpen?.();
  }

  async function reset() {
    await textCtrl.start({ opacity: 0, y: 8, transition: { duration: 0.15 } });
    containerCtrl.set({ width: 60, height: 60, rotate: 0, x: 0 });
    phaseRef.current = "folded";
    setPhase("folded");
    onReset?.();
  }

  // External trigger — runs once per false→true edge
  const triggeredHandled = useRef(false);
  useEffect(() => {
    if (triggered && !triggeredHandled.current) {
      triggeredHandled.current = true;
      startAnimation();
    }
    if (!triggered) triggeredHandled.current = false;
  }, [triggered]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFolded = phase === "folded";

  return (
    <motion.div
      animate={containerCtrl}
      initial={{ width: 60, height: 60, rotate: 0 }}
      onClick={isFolded ? startAnimation : undefined}
      style={{
        overflow: "hidden",
        position: "relative",
        borderRadius: "4px",
        cursor: isFolded ? "pointer" : "default",
        transformOrigin: "left center",
      }}
    >
      {/* ── Paper (always rendered; container clips it until expanded) ── */}
      <div
        style={{
          width: "320px",
          backgroundColor: "#FFF9F4",
          backgroundImage: `repeating-linear-gradient(
            transparent 0px, transparent ${LINE_H - 1}px, #EDD9C8 ${LINE_H}px
          )`,
          backgroundPositionY: `${PAPER_PT}px`,
          borderLeft: "2px solid #FFB3B3",
          boxShadow: "2px 4px 12px rgba(61,43,31,0.08)",
          borderRadius: "4px",
          paddingLeft: "24px",
          paddingRight: "20px",
          paddingTop: `${PAPER_PT}px`,
          paddingBottom: "20px",
        }}
      >
        <motion.div animate={textCtrl} initial={{ opacity: 0, y: 8 }}>
          {/* Date — top right */}
          <p
            style={{
              textAlign: "right",
              fontSize: "12px",
              color: "#C4A99A",
              fontFamily: FONT,
              marginBottom: "8px",
            }}
          >
            {date}
          </p>

          {/* Content */}
          <p
            style={{
              fontFamily: FONT,
              fontSize: "18px",
              lineHeight: `${LINE_H}px`,
              color: "#3D2B1F",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </p>

          {/* 再抽一张 — bottom right, appears with text */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "14px",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              style={{
                fontFamily: FONT,
                fontSize: "13px",
                color: "#C4A99A",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 0",
                letterSpacing: "0.02em",
              }}
            >
              再抽一张 →
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Folded overlay (exits when expanding begins) ── */}
      <AnimatePresence>
        {isFolded && (
          <motion.div
            key="fold"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#FFF9F4",
              boxShadow:
                "inset 0 0 0 2px #EDD9C8, 2px 2px 0 #EDD9C8, 4px 4px 0 #E8D4BE",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              userSelect: "none",
            }}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
