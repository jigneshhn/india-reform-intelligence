# India Reform Intelligence

Production-ready civic platform tracking India's challenges — with a **Daily Corruption** tab pulling stories from major Indian newspapers and AI step-by-step reform solutions.

## Features

- **Daily Corruption Watch** — Stories from 12+ Indian newspapers (The Hindu, Indian Express, TOI, HT, NDTV, ET, etc.)
- **Step-by-step AI solutions** — 4-phase corruption reform roadmaps (immediate → long-term)
- **Live Issues Feed** — Cross-sector news monitoring
- **12 Sector Dashboard** — Rankings, gaps, and analysis
- **Hindi + English** — Full UI i18n (extensible to all Indian languages)
- **Mobile responsive** — Collapsible sidebar, touch-friendly layout
- **Production ready** — Docker, Vercel, caching, SEO, security headers

## Quick Start (Development)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Production

### Vercel (Recommended — use this now)

**Step 1 — Push to GitHub**

```bash
# Create a new repo at github.com/new (name: india-reform-intelligence)
git remote add origin https://github.com/YOUR_USERNAME/india-reform-intelligence.git
git branch -M main
git push -u origin main
```

**Step 2 — Deploy on Vercel**

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub
2. Click **Import** on `india-reform-intelligence`
3. Add environment variable:
   - `NEXT_PUBLIC_SITE_URL` = `https://india-reform-intelligence.vercel.app` (use your actual Vercel URL after first deploy)
4. Click **Deploy** — live in ~2 minutes

**Alternative — deploy without GitHub (CLI)**

```bash
npx vercel
# Follow prompts, then:
npx vercel --prod
```

### Custom domain (when you buy one later)

1. Vercel dashboard → your project → **Settings** → **Domains**
2. Add your domain (e.g. `indiareform.org` or `www.indiareform.org`)
3. At your domain registrar (GoDaddy, Namecheap, etc.), add the DNS records Vercel shows you (usually an `A` record or `CNAME`)
4. Update env var in Vercel: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
5. Redeploy (or wait for auto-redeploy) — SSL certificate is automatic

No code changes needed when switching domains; only the env var and DNS.

### Docker

```bash
docker compose up --build
```

### Manual

```bash
npm run build
npm start
```

## Adding More Languages (Future)

1. Create `src/i18n/locales/ta.ts` (Tamil), `te.ts` (Telugu), etc.
2. Add locale to `src/i18n/types.ts` → `SUPPORTED_LOCALES`
3. Register in `src/i18n/index.ts` dictionaries
4. Add option in `LanguageSwitcher.tsx`

Planned: Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/corruption` | GET | Daily corruption feed from newspapers |
| `/api/news` | GET | Live sector news |
| `/api/sectors` | GET | Sector benchmark data |
| `/api/analyze` | POST | AI analysis (`mode: "step-by-step"`, `locale: "hi"`) |

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- RSS feeds (no API keys required)
- Built-in expert AI analysis (optional xAI/Grok API)