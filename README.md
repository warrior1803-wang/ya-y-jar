# Yay Jar · 夸夸瓶

**Yay Jar** is a personal encouragement app — write down small wins from your day, then shake the jar whenever you need a boost.

> 把每天做得好的事情放进瓶子里，需要鼓励时随机抽取一条。

---

## Features

- **Write daily entries** — capture things you did well, up to 200 characters each, multiple entries per day
- **Shake to draw** — tap or shake the jar to pull out a random encouragement slip
- **History journal** — browse all past entries in a scrollable card list
- **Auth** — email/password sign-up and Google OAuth via Supabase
- **i18n** — full Chinese / English toggle, preference persisted in localStorage
- **Mobile-first** — safe-area insets, 44 px touch targets, shake gesture via DeviceMotion API

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Backend / Auth | Supabase (Postgres + Auth) |
| Deployment | Vercel |

---

## Getting Started

**Prerequisites:** Node.js 18+, a Supabase project

```bash
# 1. Clone the repo
git clone https://github.com/your-username/encouragement-jar.git
cd encouragement-jar

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key (see below)

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root with the following keys. Values are found in your Supabase project under **Project Settings → API**.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Deployment

Deploy to [Vercel](https://vercel.com) with zero configuration — import the repo and add the two environment variables above in **Project Settings → Environment Variables**.

---

## License

MIT
