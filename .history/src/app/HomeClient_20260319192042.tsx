"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GlassJar } from "@/components/GlassJar";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import SlipCard from "@/components/SlipCard";
import { getRandomEntry } from "./actions";
import { createClient } from "@/lib/supabase/client";

const FONT = "'Caveat', 'Ma Shan Zheng', serif";
const SHAKE_THRESHOLD = 15;
const SHAKE_COOLDOWN_MS = 1500;

type JarState = "idle" | "shaking" | "fetching" | "showing";
type MotionPerm = "unknown" | "granted" | "denied";

interface Entry {
  id: string;
  content: string;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

const NAV = [
  { href: "/", icon: "🫙", label: "首页" },
  { href: "/write", icon: "✏️", label: "写今天" },
  { href: "/history", icon: "📖", label: "历史" },
];

export default function HomeClient({
  initialHasEntries,
}: {
  initialHasEntries: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const jarCtrl = useAnimation();
  const [signingOut, setSigningOut] = useState(false);

  const [jarState, setJarState] = useState<JarState>("idle");
  const [entry, setEntry] = useState<Entry | null>(null);
  const [cardTriggered, setCardTriggered] = useState(false);
  const [hasEntries, setHasEntries] = useState(initialHasEntries);
  const [motionPerm, setMotionPerm] = useState<MotionPerm>("unknown");

  const jarStateRef = useRef<JarState>("idle");
  const cooldownRef = useRef(false);
  const playRef = useRef<() => void>(() => {});

  // Detect iOS (only client-side)
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // ── Core shake/click handler ──────────────────────────────────────────────
  async function playAndFetch() {
    if (jarStateRef.current !== "idle" || cooldownRef.current) return;
    cooldownRef.current = true;
    setTimeout(() => {
      cooldownRef.current = false;
    }, SHAKE_COOLDOWN_MS);

    jarStateRef.current = "shaking";
    setJarState("shaking");
    setEntry(null);
    setCardTriggered(false);

    await jarCtrl.start({
      x: [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });

    jarStateRef.current = "fetching";
    setJarState("fetching");

    const result = await getRandomEntry();

    if (!result.hasEntries) {
      setHasEntries(false);
      jarStateRef.current = "idle";
      setJarState("idle");
      return;
    }

    setEntry(result.entry);
    jarStateRef.current = "showing";
    setJarState("showing");
  }

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/landing");
  }

  // Keep ref fresh so motion listener never has stale closure
  useEffect(() => {
    playRef.current = playAndFetch;
  });

  // ── Motion permission (iOS) ───────────────────────────────────────────────
  async function requestMotionPermission() {
    const DM = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DM.requestPermission === "function") {
      const res = await DM.requestPermission();
      setMotionPerm(res === "granted" ? "granted" : "denied");
    } else {
      setMotionPerm("granted");
    }
  }

  // Auto-grant on non-iOS devices that support motion
  useEffect(() => {
    if (typeof DeviceMotionEvent === "undefined") return;
    const needsPermission =
      typeof (DeviceMotionEvent as unknown as { requestPermission?: unknown })
        .requestPermission === "function";
    if (!needsPermission) setMotionPerm("granted");
  }, []);

  // ── Device motion listener ────────────────────────────────────────────────
  useEffect(() => {
    if (motionPerm !== "granted" || typeof DeviceMotionEvent === "undefined")
      return;

    let lastX = 0,
      lastY = 0,
      lastZ = 0,
      lastTime = 0;

    function onMotion(e: DeviceMotionEvent) {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const now = Date.now();
      if (now - lastTime < 100) return;

      const dx = Math.abs((acc.x ?? 0) - lastX);
      const dy = Math.abs((acc.y ?? 0) - lastY);
      const dz = Math.abs((acc.z ?? 0) - lastZ);
      lastX = acc.x ?? 0;
      lastY = acc.y ?? 0;
      lastZ = acc.z ?? 0;
      lastTime = now;

      if (dx + dy + dz > SHAKE_THRESHOLD) playRef.current();
    }

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [motionPerm]);

  // ── Derived UI state ──────────────────────────────────────────────────────
  const canTrigger = hasEntries && jarState === "idle";

  let caption = "轻触瓶子，取出一条夸夸 ✨";
  if (motionPerm === "granted") caption = "摇一摇，取出一条夸夸 ✨";
  if (!hasEntries) caption = "瓶子还是空的～";
  if (jarState === "fetching") caption = "取出中…";

  return (
    <main
      className="min-h-screen bg-bg-base flex flex-col select-none"
      style={{ position: "relative" }}
    >
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontFamily: FONT,
          fontSize: 13,
          color: "#C4A99A",
          background: "none",
          border: "none",
          cursor: signingOut ? "default" : "pointer",
          opacity: signingOut ? 0.5 : 1,
          padding: "4px 8px",
          zIndex: 10,
        }}
      >
        {signingOut ? "退出中…" : "退出登陆"}
      </button>
      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-4">
        {/* Card slot — fixed height so jar doesn't jump when card appears */}
        <div
          className="flex items-end justify-center"
          style={{ minHeight: "180px" }}
        >
          <AnimatePresence mode="wait">
            {jarState === "showing" && entry && (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 160 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60, transition: { duration: 0.25 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onAnimationComplete={() => setCardTriggered(true)}
              >
                <SlipCard
                  content={entry.content}
                  date={formatDate(entry.created_at)}
                  triggered={cardTriggered}
                  onReset={() => {
                    setCardTriggered(false);
                    setEntry(null);
                    jarStateRef.current = "idle";
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
          onClick={canTrigger ? playAndFetch : undefined}
          style={{ cursor: canTrigger ? "pointer" : "default" }}
          whileTap={canTrigger ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <GlassJar
            isShaking={jarState === "shaking" || jarState === "fetching"}
          />
        </motion.div>

        {/* Caption */}
        <p className="text-sm text-text-secondary" style={{ fontFamily: FONT }}>
          {caption}
        </p>

        {/* Empty state CTA */}
        {!hasEntries && (
          <Link
            href="/write"
            className="px-5 py-2 rounded-sm bg-primary hover:bg-primary-hover text-bg-base text-sm transition-colors"
            style={{ fontFamily: FONT }}
          >
            去写第一条
          </Link>
        )}

        {/* iOS motion permission button */}
        {isIOS && motionPerm === "unknown" && hasEntries && (
          <button
            onClick={requestMotionPermission}
            className="text-sm text-text-secondary border border-border rounded-sm px-4 py-1.5 hover:bg-bg-accent transition-colors"
            style={{ fontFamily: FONT }}
          >
            开启摇晃 ✦
          </button>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <nav
        className="flex border-t border-divider bg-bg-surface"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors"
              style={{
                fontFamily: FONT,
                color: active ? "#F9A875" : "#7A5C4F",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </main>
  );
}
