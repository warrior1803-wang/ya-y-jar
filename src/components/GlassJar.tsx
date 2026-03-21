"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface Note {
  id: number;
  color: string;
  rotation: number;
  left: string;
  bottom: number;
  width: number;
  height: number;
}

interface GlassJarProps {
  isShaking?: boolean;
}

const notes: Note[] = [
  { id: 1, color: "#F3CEBA", rotation: -18, left: "6%",  bottom: 5,  width: 43, height: 38 },
  { id: 2, color: "#EAC4AC", rotation:  6,  left: "33%", bottom: 3,  width: 46, height: 40 },
  { id: 3, color: "#F0C8B4", rotation:  22, left: "60%", bottom: 6,  width: 42, height: 37 },
  { id: 4, color: "#E8BEAA", rotation: -12, left: "14%", bottom: 47, width: 45, height: 38 },
  { id: 5, color: "#F5D2BC", rotation:  28, left: "43%", bottom: 45, width: 43, height: 37 },
  { id: 6, color: "#ECC0AC", rotation: -25, left: "65%", bottom: 48, width: 41, height: 36 },
  { id: 7, color: "#F2CCB8", rotation:  14, left: "20%", bottom: 89, width: 43, height: 38 },
  { id: 8, color: "#E9BDAA", rotation:  -7, left: "52%", bottom: 87, width: 42, height: 37 },
];

export function GlassJar({ isShaking = false }: GlassJarProps) {
  const [hoveredNote, setHoveredNote] = useState<number | null>(null);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
        animate={isShaking ? { y: 0 } : { y: [0, -6, 0] }}
        transition={
          isShaking
            ? { duration: 0.15, ease: "easeOut" }
            : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* ── Lid cap (pill shape) ── */}
        <div
          style={{
            position: "relative",
            width: 152,
            height: 36,
            borderRadius: 19,
            background: "linear-gradient(170deg, #F8E868 0%, #EAC918 35%, #D2A410 65%, #B88808 100%)",
            boxShadow: `
              0 4px 12px rgba(0,0,0,0.32),
              inset 0 2px 5px rgba(255,255,255,0.48),
              inset 0 -2px 5px rgba(0,0,0,0.22),
              inset -2px 0 5px rgba(0,0,0,0.12)
            `,
            zIndex: 21,
          }}
        >
          {/* Lid cap highlight blob */}
          <div
            style={{
              position: "absolute",
              left: "14%",
              top: "14%",
              width: "48%",
              height: "42%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.32)",
              filter: "blur(4px)",
            }}
          />
        </div>

        {/* ── Lid connector ── */}
        <div
          style={{
            width: 172,
            height: 14,
            marginTop: -2,
            background: "linear-gradient(to bottom, #C49010 0%, #A87808 55%, #946808 100%)",
            boxShadow: "0 3px 7px rgba(0,0,0,0.30), inset 0 1px 2px rgba(255,255,255,0.15)",
            zIndex: 20,
          }}
        />

        {/* ── Jar body ── */}
        <div
          style={{
            position: "relative",
            width: 162,
            height: 216,
            zIndex: 10,
          }}
        >
          {/* Glass surface */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "0 0 26px 26px",
              /* warm cream glass fill */
              background: "linear-gradient(155deg, rgba(255,248,236,0.82) 0%, rgba(255,242,220,0.70) 100%)",
              backdropFilter: "blur(8px) saturate(1.1)",
              WebkitBackdropFilter: "blur(8px) saturate(1.1)",
              border: "1.5px solid rgba(255,255,255,0.45)",
              borderTop: "1px solid rgba(255,255,255,0.25)",
              boxShadow: `
                inset -9px -5px 24px rgba(255,255,255,0.18),
                inset  6px  6px 20px rgba(0,0,0,0.03),
                inset 0 -16px 30px rgba(255,240,210,0.12),
                0 18px 44px rgba(0,0,0,0.16),
                0 0 0 1px rgba(255,255,255,0.12)
              `,
              overflow: "hidden",
            }}
          >
            {/* ─ Animated liquid shimmer ─ */}
            <motion.div
              style={{ position: "absolute", inset: 0 }}
              animate={{
                background: [
                  "radial-gradient(ellipse 65% 45% at 22% 26%, rgba(255,255,255,0.22) 0%, transparent 60%)",
                  "radial-gradient(ellipse 65% 45% at 80% 70%, rgba(255,255,255,0.22) 0%, transparent 60%)",
                  "radial-gradient(ellipse 65% 45% at 48% 48%, rgba(255,255,255,0.22) 0%, transparent 60%)",
                  "radial-gradient(ellipse 65% 45% at 24% 78%, rgba(255,255,255,0.22) 0%, transparent 60%)",
                  "radial-gradient(ellipse 65% 45% at 22% 26%, rgba(255,255,255,0.22) 0%, transparent 60%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* ─ Left edge specular highlight ─ */}
            <div
              style={{
                position: "absolute",
                left: "7%",
                top: "3%",
                width: "16%",
                height: "68%",
                borderRadius: "50%",
                background:
                  "linear-gradient(148deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.14) 50%, transparent 100%)",
                filter: "blur(9px)",
              }}
            />

            {/* ─ Right edge subtle highlight ─ */}
            <div
              style={{
                position: "absolute",
                right: "6%",
                top: "8%",
                width: "9%",
                height: "42%",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.20)",
                filter: "blur(6px)",
              }}
            />

            {/* ─ Bottom inner glow / refraction ─ */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "8%",
                right: "8%",
                height: 56,
                borderRadius: "0 0 22px 22px",
                background: "linear-gradient(to top, rgba(255,245,220,0.20), transparent)",
                filter: "blur(4px)",
              }}
            />

            {/* ─ Warm amber inner tint ─ */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 105%, rgba(255,225,170,0.18) 0%, transparent 65%)",
              }}
            />

            {/* ─ Notes area ─ */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 154,
                padding: "0 9px 11px 9px",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    style={{
                      position: "absolute",
                      left: note.left,
                      bottom: note.bottom,
                      width: note.width,
                      height: note.height,
                      zIndex: hoveredNote === note.id ? 50 : index,
                      cursor: "pointer",
                    }}
                    initial={{ scale: 0, rotate: note.rotation }}
                    animate={{
                      scale: hoveredNote === note.id ? 1.28 : 1,
                      rotate: hoveredNote === note.id ? 0 : note.rotation,
                      y: hoveredNote === note.id ? -10 : 0,
                    }}
                    whileInView={{
                      scale: [0, 1.14, 1],
                      transition: {
                        delay: index * 0.10,
                        duration: 0.48,
                        ease: "backOut",
                      },
                    }}
                    transition={{ type: "spring", stiffness: 290, damping: 22 }}
                    onHoverStart={() => setHoveredNote(note.id)}
                    onHoverEnd={() => setHoveredNote(null)}
                  >
                    {/* Paper drop shadow */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 3,
                        background: "rgba(0,0,0,0.15)",
                        filter: "blur(4px)",
                        transform: "translateY(4px) scale(0.90)",
                      }}
                    />

                    {/* Paper body */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: 3,
                        backgroundColor: note.color,
                        boxShadow: `
                          0 1px 5px rgba(0,0,0,0.10),
                          inset 0 1px 2px rgba(255,255,255,0.68),
                          inset 0 -1px 1px rgba(0,0,0,0.07)
                        `,
                        overflow: "hidden",
                      }}
                    >
                      {/* Horizontal fold crease */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: "50%",
                          height: 1,
                          background:
                            "linear-gradient(to right, transparent 5%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.10) 70%, transparent 95%)",
                          transform: "translateY(-0.5px)",
                        }}
                      />
                      {/* Vertical fold crease */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: "50%",
                          width: 1,
                          background:
                            "linear-gradient(to bottom, transparent 5%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.08) 70%, transparent 95%)",
                          transform: "translateX(-0.5px)",
                        }}
                      />
                      {/* Paper surface sheen */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(138deg, rgba(255,255,255,0.32) 0%, transparent 52%)",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ─ Thin left-edge glass rim highlight ─ */}
          <div
            style={{
              position: "absolute",
              left: 2,
              top: 0,
              width: 2,
              height: "72%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.12), transparent)",
              borderRadius: "0 0 2px 2px",
            }}
          />
          {/* ─ Thin right-edge glass rim highlight ─ */}
          <div
            style={{
              position: "absolute",
              right: 2,
              top: 0,
              width: 2,
              height: "48%",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.30), transparent)",
              borderRadius: "0 0 2px 2px",
            }}
          />
        </div>

        {/* ── Floating drop shadow ── */}
        <motion.div
          style={{
            width: 141,
            height: 11,
            marginTop: 6,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.24) 0%, transparent 70%)",
            filter: "blur(7px)",
          }}
          animate={
            isShaking
              ? { scaleX: 1, opacity: 0.24 }
              : { scaleX: [1, 1.08, 1], opacity: [0.24, 0.34, 0.24] }
          }
          transition={
            isShaking
              ? { duration: 0.15 }
              : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
    </div>
  );
}
