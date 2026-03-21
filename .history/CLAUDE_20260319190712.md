# 夸夸瓶 (Cheer Jar) — Claude Code 项目规范

## 项目简介

一个面向日常减压的自我鼓励 Web App。
用户每天记录一件值得被夸奖的小事，需要鼓励时点击/摇晃瓶子随机取出一条回顾。
中文名：夸夸瓶 / 英文名：Cheer Jar

---

## 技术栈

- **框架**：Next.js App Router + TypeScript
- **样式**：Tailwind CSS（自定义 token）
- **数据库**：Supabase（@supabase/ssr）
- **动画**：Framer Motion
- **部署**：Vercel
- **字体**：Caveat（英文）+ Ma Shan Zheng（中文）via Google Fonts

---

## 目录结构

```
src/
├── app/
│   ├── page.tsx              # 主页（瓶子 + 抽取）
│   ├── landing/page.tsx      # 落地页（未登录用户）
│   ├── write/
│   │   ├── page.tsx          # 写条目页面
│   │   └── actions.ts        # Server Action
│   ├── history/page.tsx      # 历史记录页面
│   ├── login/page.tsx        # 登录/注册页面
│   └── auth/callback/route.ts
├── components/
│   ├── GlassJar.tsx          # 玻璃瓶组件
│   ├── SlipCard.tsx          # 纸条组件
│   └── HomeClient.tsx        # 主页客户端逻辑
└── lib/
    ├── supabase/
    │   ├── client.ts         # 浏览器端 client
    │   └── server.ts         # 服务端 client
```

---

## 组件复用规范（重要）

### 瓶子点击弹出纸条

**唯一参考实现在 HomeClient.tsx**，其他页面需要相同效果时
必须复用这套逻辑，不要重新实现。

核心状态机：

```
idle → shaking → fetching → showing → idle
```

关键代码结构：

```tsx
// 1. 状态
const [jarState, setJarState] = useState<
  "idle" | "shaking" | "fetching" | "showing"
>("idle");
const [entry, setEntry] = useState<string | null>(null);
const [cardTriggered, setCardTriggered] = useState(false);
const jarCtrl = useAnimation();

// 2. 点击函数
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
  // fetch 数据或取示例纸条
  setJarState("showing");
}

// 3. 纸条展示
<AnimatePresence>
  {jarState === "showing" && entry && (
    <motion.div
      initial={{ opacity: 0, y: 160 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onAnimationComplete={() => setCardTriggered(true)}
    >
      <SlipCard content={entry} triggered={cardTriggered} />
    </motion.div>
  )}
</AnimatePresence>;
```

### GlassJar 组件

- 统一用 `src/components/GlassJar.tsx`
- 内部已有浮动动画（y: [0, -9, 0]），点击时不要和外部动画冲突
- 点击事件绑定在包裹 GlassJar 的 motion.div 上，不要绑在组件内部

### SlipCard 组件

- 统一用 `src/components/SlipCard.tsx`
- Props: `content`, `date`, `triggered`, `onDrawAgain`
- `triggered` 控制内部四阶段展开动画（shake→展宽→展高→文字淡入）
- 纸条质感：横线稿纸背景 + 左侧红色竖线 + 轻微随机旋转

---

## 路由规则（middleware.ts）

```
/landing          公开，未登录默认落地页
/login            公开
/                 需要登录，未登录 → /landing
/write            需要登录，未登录 → /landing
/history          需要登录，未登录 → /landing
已登录访问 /landing 或 /login → 自动跳转 /
```

---

## 页面流转逻辑

```
未登录 → /landing（体验示例纸条）→ /login → /
已登录 → /（主页瓶子）
  ├── 点击瓶子 → 抽取动画 → SlipCard 展示 → 关闭回主页
  ├── 写今天 → /write
  │     ├── 没写过 → 表单 → 提交成功 → router.push('/')
  │     └── 写过了 → 展示今天内容 → 按钮回主页
  └── 历史 → /history → 返回按钮回主页
```

---

## 设计系统

### 配色 Token（定义在 tailwind.config.ts 和 globals.css）

```
--color-bg-base: #FDF8F2        主页面背景
--color-bg-surface: #FFF9F4     卡片/纸条背景
--color-bg-accent: #FFF3E6      高亮区域
--color-primary: #F9A875        主按钮/CTA
--color-primary-hover: #F7935C  按钮 hover
--color-primary-soft: #FDDFC8   主色淡版背景
--color-accent-lavender: #E8DEFF 标签/日历点
--color-text-primary: #3D2B1F   主文字
--color-text-secondary: #7A5C4F 次要文字
--color-text-disabled: #C4A99A  禁用状态
--color-border: #EDD9C8         边框
--color-divider: #F3E8DC        分割线
```

### 禁止事项

- 不使用纯白 `#FFFFFF` 或纯黑 `#000000`
- 不使用蓝色系
- 不使用高饱和度颜色
- 不默认深色模式

### 字体

```css
font-family: "Caveat", "Ma Shan Zheng", serif;
```

- 英文走 Caveat，中文自动 fallback 到 Ma Shan Zheng
- 通过 `<link>` 在 layout.tsx 引入，不用 @import

### 抽取时特效

点击瓶子触发时，背景有一次柔和金色光晕脉冲：

```
from: #FDF8F2 → through: #FFE5B4 → back: #FDF8F2
duration: 800ms ease-in-out
```

---

## 数据库（Supabase）

### 表结构

```sql
-- profiles 表
id uuid, user_id uuid, created_at timestamptz

-- entries 表
id uuid, user_id uuid, content text, created_at timestamptz
```

### RLS 规则

两张表均开启 Row Level Security，用户只能读写自己的数据。

### Client 使用规则

- `createClient()` — 客户端组件（有 "use client"）
- `createServerSupabaseClient()` — Server Components / Route Handlers（需 await）

---

## 手机端摇晃功能

- 使用 `DeviceMotionEvent` 监听加速度，threshold 设为 15
- iOS 13+ 需要用户授权：`DeviceMotionEvent.requestPermission()`
- 页面上需要一个"开启摇晃"按钮触发授权请求
- 摇晃和点击调用同一个 `playAndFetch()` 函数

---

## 开发注意事项

1. 新功能优先复用现有组件，不要重新实现已有逻辑
2. 修改某个文件前先告诉我你要改哪里，确认后再动
3. 每次只做一件事，做完等确认再继续
4. 动画相关改动统一用 Framer Motion，不要混用纯 CSS keyframes
5. 数据获取：页面级用 Server Component，交互级用 Server Action 或 Client Component
