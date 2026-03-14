# Lily's Playspace

A full-stack educational web app built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Deployed to Vercel at [lilysplayspace.com](https://lilysplayspace.com).

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## Project Structure

```
lilys-playspace/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── page.tsx            # Homepage (/)
│   ├── learning/
│   │   ├── page.tsx        # Learning hub (/learning)
│   │   └── pi-day/
│   │       └── page.tsx    # Pi Day game (/learning/pi-day)
├── components/
│   ├── BgShapes.tsx        # Floating pastel blob decorations
│   ├── LilyAvatar.tsx      # Lily avatar + speech bubble
│   └── WaveFooter.tsx      # Wave SVG + pink footer bar
├── lib/
│   └── supabase.ts         # Supabase client + score helpers
├── public/
│   └── lily-avatar.png     # Lily's avatar image
└── .env.local              # Environment variables (not committed)
```

---

## Setup

### 1. Install dependencies

```bash
cd lilys-playspace
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run this to create the scores table:

```sql
create table if not exists game_scores (
  id         bigint generated always as identity primary key,
  game_id    text        not null,
  score      integer     not null,
  total      integer     not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by game
create index if not exists game_scores_game_id_idx on game_scores(game_id, created_at desc);
```

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

### Add environment variables to Vercel

In your Vercel project dashboard:

1. Go to **Settings → Environment Variables**
2. Add both variables for **Production**, **Preview**, and **Development**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deploy via Git (recommended)

Push to GitHub and Vercel will auto-deploy on every push to `main`.

### Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Git & GitHub Setup

Run these commands to push to GitHub and deploy:

```bash
# 1. Initialize the repo (already done if you followed setup)
cd ~/lilys-playspace
git init
git add .
git commit -m "Initial commit: Lily's Playspace"

# 2. Create a new GitHub repo (requires GitHub CLI)
gh repo create lilys-playspace --public --source=. --remote=origin --push

# OR manually via github.com, then:
# git remote add origin https://github.com/YOUR_USERNAME/lilys-playspace.git
# git branch -M main
# git push -u origin main

# 3. Connect to Vercel (if not already connected via dashboard)
vercel link   # link to existing Vercel project
vercel --prod # deploy to production
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with Lily avatar and two section cards |
| `/learning` | Learning hub listing all available games |
| `/learning/pi-day` | Full Pi Day Adventure game with 4 sections + quiz |

---

## Supabase Schema

```sql
create table game_scores (
  id         bigint generated always as identity primary key,
  game_id    text        not null,   -- e.g. 'pi-day'
  score      integer     not null,   -- number correct
  total      integer     not null,   -- total questions
  created_at timestamptz not null default now()
);
```

Scores are saved when a player finishes the Pi Day quiz. The last score is shown on the Pi Day intro screen.
