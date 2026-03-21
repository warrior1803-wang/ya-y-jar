export type Lang = "zh" | "en";

// ── Translations ────────────────────────────────────────────────────────────

export const translations = {
  zh: {
    common: {
      appName: "夸夸瓶",
      copyright: "© 2026 夸夸瓶 · Yay Jar",
    },
    nav: {
      home: "首页",
      write: "写今天",
      history: "历史",
    },
    landing: {
      tagline: "写下今天做得好的事，需要鼓励时摇一摇取出来看 ✨",
      hint: "轻点瓶子，看看里面有什么 ✨",
      startBtn: "立即开始",
      cta: "注册后保存你自己的夸夸 →",
      examples: [
        "今天按时完成了所有任务 💪",
        "鼓起勇气和陌生人说话了 🌟",
        "今天做了一顿好吃的饭 🍳",
        "坚持运动了 30 分钟 🏃",
        "帮助了需要帮助的朋友 🤝",
      ],
    },
    home: {
      tapHint: "轻触瓶子，取出一条夸夸 ✨",
      shakeHint: "摇一摇，取出一条夸夸 ✨",
      emptyCaption: "瓶子还是空的～",
      fetchingCaption: "取出中…",
      emptyBtn: "去写第一条",
      motionBtn: "开启摇晃 ✦",
    },
    write: {
      subtitle: "给今天的自己写一句话",
      countLabel: "今天已写 {count} 条 ✨",
      placeholder: "今天又做了什么好事...",
      submitBtn: "放入瓶子",
      submittingBtn: "存入瓶子中…",
      toast: "又放入一条 🫙",
      error: "出现了一点问题，请稍后再试",
    },
    history: {
      title: "我的夸夸记录",
      emptyText: "瓶子还是空的，去写第一条吧",
      emptyBtn: "去写第一条",
    },
    slipCard: {
      drawAgain: "再抽一张 →",
    },
    userMenu: {
      logout: "退出登录",
      loggingOut: "退出中…",
    },
    login: {
      signUpSubtitle: "创建你的账号",
      signInSubtitle: "欢迎回来",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      loadingBtn: "请稍候…",
      signUpBtn: "注册",
      signInBtn: "登录",
      orDivider: "或",
      googleBtn: "使用 Google 登录",
      haveAccount: "已有账号？",
      noAccount: "还没有账号？",
      goSignIn: "去登录",
      goSignUp: "注册",
      checkEmail: "请检查邮箱，点击确认链接完成注册。",
    },
  },
  en: {
    common: {
      appName: "Yay Jar",
      copyright: "© 2026 Yay Jar · 夸夸瓶",
    },
    nav: {
      home: "Home",
      write: "Write",
      history: "Journal",
    },
    landing: {
      tagline: "Write down something you did well today — shake whenever you need a boost ✨",
      hint: "Tap the jar to see what's inside ✨",
      startBtn: "Get Started",
      cta: "Sign up to save your own yays →",
      examples: [
        "Knocked out every task on my list today 💪",
        "Pushed through the nerves and started a conversation with a stranger 🌟",
        "Cooked myself a proper meal from scratch 🍳",
        "Showed up for a 30-minute workout even when I didn't feel like it 🏃",
        "Was there for a friend who needed support today 🤝",
      ],
    },
    home: {
      tapHint: "Tap the jar to pull out a yay ✨",
      shakeHint: "Give it a shake to pull out a yay ✨",
      emptyCaption: "The jar is empty~",
      fetchingCaption: "Reaching in…",
      emptyBtn: "Write your first one",
      motionBtn: "Enable shake ✦",
    },
    write: {
      subtitle: "Write a note to yourself today",
      countLabel: "{count} yays today ✨",
      placeholder: "What good thing happened today...",
      submitBtn: "Drop it in",
      submittingBtn: "Dropping it in…",
      toast: "One more in the jar 🫙",
      error: "Something went wrong, please try again",
    },
    history: {
      title: "My Yay Journal",
      emptyText: "The jar is empty — write your first yay!",
      emptyBtn: "Write your first one",
    },
    slipCard: {
      drawAgain: "Draw another →",
    },
    userMenu: {
      logout: "Log out",
      loggingOut: "Logging out…",
    },
    login: {
      signUpSubtitle: "Create your account",
      signInSubtitle: "Welcome back",
      emailLabel: "Email",
      passwordLabel: "Password",
      loadingBtn: "Please wait…",
      signUpBtn: "Sign up",
      signInBtn: "Log in",
      orDivider: "or",
      googleBtn: "Continue with Google",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      goSignIn: "Log in",
      goSignUp: "Sign up",
      checkEmail: "Check your inbox and click the confirmation link to finish signing up.",
    },
  },
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Detect initial language: localStorage → navigator.language → zh */
export function getInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const stored = localStorage.getItem("lang");
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language.startsWith("zh") ? "zh" : "en";
}

/** Look up a dot-path key with optional {var} substitution */
export function t(
  key: string,
  lang: Lang,
  vars?: Record<string, string | number>
): string {
  const parts = key.split(".");
  let val: unknown = translations[lang];
  for (const p of parts) {
    if (val && typeof val === "object" && p in (val as object)) {
      val = (val as Record<string, unknown>)[p];
    } else {
      return key; // fallback: return raw key
    }
  }
  if (typeof val !== "string") return key;
  if (!vars) return val;
  return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** Look up a dot-path key that resolves to a string array */
export function ta(key: string, lang: Lang): string[] {
  const parts = key.split(".");
  let val: unknown = translations[lang];
  for (const p of parts) {
    if (val && typeof val === "object" && p in (val as object)) {
      val = (val as Record<string, unknown>)[p];
    } else {
      return [];
    }
  }
  if (!Array.isArray(val)) return [];
  return val as string[];
}

/** Format a date ISO string based on locale */
export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (lang === "en") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}
