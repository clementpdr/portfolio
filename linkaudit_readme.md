# LinkAudit

> Backlink monitoring and brand mention alerts — built for indie hackers, creators, and small agencies who don't need a $129/month SEO suite.

---

## What is LinkAudit?

LinkAudit is a focused backlink monitoring tool. It watches your domain, alerts you the moment you gain or lose a backlink, and catches brand mentions that don't include a link (so you can reclaim them).

That's it. No keyword research. No site audit. No rank tracker. Just the four things that actually matter for 80% of people who care about backlinks:

1. **New backlink alert** — someone linked to you
2. **Lost backlink alert** — a link disappeared
3. **Unlinked mention alert** — someone mentioned your brand without linking
4. **A clean history dashboard** to review everything

---

## Why it exists

The backlink monitoring market has a gap at the bottom. Tools like Ahrefs ($129/month), Semrush ($139/month), and Brand24 ($199/month) are excellent — and overkill for a solo founder or a blogger who just wants to know when someone cites them.

Google Alerts is free and nearly useless (it doesn't cover backlinks and the data is unreliable). Awario ($29/month) is social-first, not SEO-first. Linkstant (~$9/month) sends alerts but provides zero context on the link.

LinkAudit fills the gap: real backlink data, meaningful context per alert, unlinked mention detection, and a price that makes sense for people who aren't running 50-client SEO agencies.

---

## Stack

| Layer           | Tool                     | Why                                                   |
| --------------- | ------------------------ | ----------------------------------------------------- |
| Frontend        | Next.js 14 (App Router)  | Full-stack React, easy deployment on Vercel           |
| Styling         | Tailwind CSS             | Utility-first, fast to iterate                        |
| Database        | Supabase (PostgreSQL)    | Auth included, Row Level Security, generous free tier |
| Backlink data   | DataForSEO Backlinks API | ~100x cheaper than Ahrefs API, 2T+ links indexed      |
| Email alerts    | Resend + React Email     | Developer-friendly, reliable transactional emails     |
| Slack alerts    | Slack Incoming Webhooks  | User pastes their webhook URL, zero cost on our end   |
| Scheduled scans | Vercel Cron Jobs         | Runs domain scans every 12 hours per user             |
| Payments        | Stripe Billing           | Subscriptions, upgrades, customer portal              |
| Deployment      | Vercel                   | Frontend + API routes in one place                    |

---

## Architecture overview

```
User browser
    │
    ▼
Next.js app (Vercel)
    ├── /app          → Pages (dashboard, onboarding, settings)
    ├── /api          → API routes (scan trigger, webhook handler, Stripe)
    └── /components   → UI components
    │
    ▼
Supabase (PostgreSQL)
    ├── users
    ├── domains        → domains being monitored per user
    ├── backlinks      → known backlink state (snapshot per scan)
    └── events         → new/lost/mention events, used for alerts and dashboard
    │
    ▼
Vercel Cron (every 12h)
    └── For each active domain:
          1. Query DataForSEO Backlinks API
          2. Diff against last known state in DB
          3. Write new events
          4. Trigger alerts (email via Resend, Slack via webhook)
```

---

## Data source: DataForSEO

DataForSEO is the backbone of the product. It's the API layer behind many well-known SEO tools, available directly to developers at a fraction of the cost.

**Pricing that makes the model work:**

- $0.02 per API request
- $0.00003 per row of backlink data returned
- $100/month minimum commitment (shared across all API products)

For a typical user with one domain scanned twice a day, the data cost is roughly **$1–3/month**. That's what makes a $9/month plan financially viable with healthy margins.

**Limitation to be honest about:** DataForSEO's backlink index is smaller than Ahrefs'. For large sites with millions of backlinks, Ahrefs wins on completeness. For the typical LinkAudit user (indie founder, blogger, small agency), the coverage is more than sufficient and detection latency is 1–3 days for most new links.

---

## Local development

### Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine)
- A DataForSEO account (starts with $1 free credit)
- A Stripe account (test mode)
- A Resend account (free tier: 3,000 emails/month)

### Setup

```bash
# Clone the repo
git clone git@github.com:clementpdr/linkaudit.git
cd linkaudit

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env.local
```

### Environment variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# DataForSEO
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=

# Resend
RESEND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=        # random string to protect cron endpoints
```

### Run locally

```bash
npm run dev
# → http://localhost:3000
```

### Database

Schema migrations live in `/supabase/migrations`. Apply them via the Supabase CLI:

```bash
npx supabase db push
```

---

## Key database tables

```sql
-- Users managed by Supabase Auth

-- Domains to monitor
CREATE TABLE domains (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users NOT NULL,
  url         text NOT NULL,
  label       text,
  plan        text DEFAULT 'free',  -- 'free' | 'solo' | 'pro'
  created_at  timestamptz DEFAULT now()
);

-- Snapshot of known backlinks (updated each scan)
CREATE TABLE backlinks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id        uuid REFERENCES domains NOT NULL,
  source_url       text NOT NULL,
  source_domain    text NOT NULL,
  domain_rating    int,
  anchor           text,
  link_type        text,  -- 'dofollow' | 'nofollow'
  first_seen_at    timestamptz DEFAULT now(),
  last_seen_at     timestamptz DEFAULT now(),
  status           text DEFAULT 'active'  -- 'active' | 'lost'
);

-- Events (new links, lost links, unlinked mentions)
CREATE TABLE events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id   uuid REFERENCES domains NOT NULL,
  type        text NOT NULL,  -- 'new_backlink' | 'lost_backlink' | 'mention'
  source_url  text,
  source_domain text,
  domain_rating int,
  context     text,           -- surrounding text snippet for mentions
  alerted_at  timestamptz,
  created_at  timestamptz DEFAULT now()
);
```

---

## Pricing tiers

|                   | Free    | Solo      | Pro       |
| ----------------- | ------- | --------- | --------- |
| Domains           | 1       | 1         | 5         |
| Alerts/month      | 10      | Unlimited | Unlimited |
| Slack alerts      | ✗       | ✓         | ✓         |
| Unlinked mentions | ✗       | ✓         | ✓         |
| CSV export        | ✗       | ✓         | ✓         |
| History           | 30 days | 6 months  | 1 year    |
| API access        | ✗       | ✗         | ✓         |
| Price             | €0      | €9/month  | €19/month |

---

## Roadmap

### MVP (weeks 1–6)

- [ ] Onboarding: add domain, first scan result shown immediately
- [ ] Cron scan: detect new and lost backlinks
- [ ] Email alerts via Resend
- [ ] Dashboard: event timeline
- [ ] Stripe integration: Free → Solo upgrade

### V1 (weeks 7–12)

- [ ] Slack webhook alerts
- [ ] Unlinked mention detection (DataForSEO Content Analysis API)
- [ ] Multi-domain support (Pro plan)
- [ ] CSV export
- [ ] Chrome extension for quick domain lookup

### V2 (months 4–6)

- [ ] Public API for Pro users
- [ ] White-label PDF monthly report
- [ ] Link reclaim email template generator
- [ ] Competitor domain monitoring (watch their new backlinks too)

---

## Cost structure at 50 active users

| Item                        | Monthly cost  |
| --------------------------- | ------------- |
| Vercel Pro                  | $20           |
| Supabase Pro                | $25           |
| DataForSEO (50 users × ~$2) | $100          |
| Resend                      | $0–20         |
| Domain + misc               | $5            |
| **Total**                   | **~$150–170** |

At 50 users on the Solo plan (€9/month): **€450 MRR → ~80% gross margin after infra costs.**

---

## Contributing

This project is built in the open. Issues and PRs welcome. For major changes, open an issue first to discuss direction.

---

## License

MIT
