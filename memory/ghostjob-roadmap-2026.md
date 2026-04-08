# GhostJob (Ghost Job Detector) — Business Plan & Roadmap

**Created:** April 4, 2026  
**Status:** In Progress (Lovable build started)  
**Domain:** TBD (ghostjob.io preferred)  
**Tech Stack:** Lovable → GitHub → Vercel, Supabase (DB + Auth), Stripe

---

## The Problem

43% of job postings are "ghost jobs" — listings with no real hiring intent. Job seekers waste 10+ hours per week applying to fake listings. Companies post ghost jobs for:
- Building talent pipelines
- Compliance (internal candidates pre-selected)
- Investor optics (appearing to grow)
- Employee retention pressure

**Pain:** Apply → hear nothing → false hope → wasted time

---

## The Solution

**GhostJob** — SaaS tool that scores job postings 0-100 for legitimacy

### Core Value Prop
Paste any job URL → instant "Ghost Score" → apply with confidence or skip

### Product Tiers

| Feature | Free | Pro ($9/mo) |
|---------|------|-------------|
| Job scans | 3/month | Unlimited |
| Ghost Score | ✅ | ✅ |
| Red flag breakdown | Basic (3 signals) | Full (10+ signals) |
| Save jobs | ❌ | Unlimited |
| Application tracker | ❌ | ✅ |
| Weekly reports | ❌ | ✅ |
| Chrome extension | ❌ | Future unlock |

---

## Ghost Score Algorithm (0-100)

### Posting Signals (Easy)
| Signal | Weight | Detection Method |
|--------|--------|------------------|
| Posted 30+ days ago | +30 | LinkedIn postedAt timestamp |
| Reposted multiple times | +25 | Track job ID changes |
| No salary range | +20 | Check salary field existence |
| Vague description | +15 | Word count, buzzword density |
| Unrealistic requirements | +10 | Years exp vs tech age |

### Company Signals (Requires external data)
| Signal | Weight | Detection Method |
|--------|--------|------------------|
| Recent layoffs | +25 | layoffs.fyi API, news |
| Role not on careers page | +20 | Scrape company /careers |
| Multiple identical listings | +15 | Same title, different IDs |
| No recent hires on LinkedIn | +10 | LinkedIn People search |
| Low Glassdoor activity | +5 | Glassdoor data (if available) |

### Application Signals (Requires user data)
| Signal | Weight | Detection Method |
|--------|--------|------------------|
| Zero response after 2 weeks | +20 | User reports, email tracking |
| No ATS confirmation | +10 | Email parsing |

**Scoring:**
- 0-30: Probably real (green)
- 31-60: Proceed with caution (yellow)
- 61-80: Likely ghost (orange)
- 81-100: Almost certainly fake (red)

---

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | Lovable → GitHub | Rapid UI, clean React export |
| Backend/Auth | Supabase | PostgreSQL + Google OAuth |
| Scraping | Puppeteer/Playwright | LinkedIn/Indeed job extraction |
| Hosting | Vercel | Deploy, serverless functions |
| Payments | Stripe | Subscription billing |
| Domain | ghostjob.io (preferred) | Branding |

---

## 3-Month Roadmap (April → June 2026)

### Month 1: MVP (April)
**Goal:** Ship working web app with core scoring

| Week | Tasks |
|------|-------|
| 1 | Lovable landing page → GitHub → Vercel |
| 2 | Supabase setup, auth (Google sign-in), DB schema |
| 3 | LinkedIn scraper (Puppeteer), 4-5 signals |
| 4 | Ghost score algorithm, Stripe integration |

**Target:** 10 beta users, 3 paying customers

---

### Month 2: Growth (May)
**Goal:** Content marketing, iterate on scoring, add company signals

- Add layoffs data, careers page checking
- SEO content: "How to spot ghost jobs" 
- X/Twitter threads about job market
- User interviews, improve UX
- Affiliate program (30% commission)

**Target:** $500-1,000 MRR, 50+ users

---

### Month 3: Scale (June)
**Goal:** Chrome extension prep, premium features, partnerships

- Application tracker (save jobs, statuses, reminders)
- Weekly email reports
- Chrome extension MVP
- Partnerships: career coaches, resume writers
- Case studies from successful users

**Target:** $1,500-3,000 MRR, 100+ users

---

## 6-Month Vision (October 2026)

**Target:** $3,000-5,000 MRR, sustainable growth

**By then:**
- 3 pricing tiers solidified
- Chrome extension launched
- 3-5 content pieces ranking in search
- Word-of-mouth / referral engine working
- Decision: double down, raise, or pivot

---

## Parallel Revenue Streams

### 1. OpenClaw Skill (Existing)
- **Job Researcher Skill** — $29 one-time
- Sold on claw.hatchedpixel.com
- DIY version for power users
- Leads to SaaS for convenience

### 2. SaaS (GhostJob)
- Subscription model, recurring revenue
- Main focus for scalability

### 3. Future: Chrome Extension
- Freemium upsell to Pro
- Distribution via Chrome Web Store

---

## Key Metrics to Track

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| MRR | $0 | $1,500 | $3,000-5,000 |
| Users | 10 | 100 | 300+ |
| Free→Pro conversion | — | 5% | 8% |
| Ghost score accuracy | Manual validation | 70%+ | 80%+ |
| Churn | — | <15% | <10% |

---

## Competitors / Inspiration

| Tool | What They Do | Our Edge |
|------|--------------|----------|
| inteller.ai | AI career advisor + job scanning | Simpler, focused on ghost jobs only |
| ResuTrack | Resume tracking + ghost detection | We're pre-application, not post |
| Jobscan | Resume optimization | Different problem (ATS vs ghost jobs) |

**Unique angle:** Dead-simple ghost score + actionable red flags, not overwhelming features.

---

## Open Questions / TODOs

- [ ] Finalize domain (ghostjob.io?)
- [ ] Set up Supabase project
- [ ] LinkedIn scraping: handle rate limits, anti-bot
- [ ] Layoffs data source (layoffs.fyi API?)
- [ ] Stripe pricing: $9/mo or tiered?
- [ ] Chrome extension: build in Month 3 or later?

---

## Notes

**Decision made April 4, 2026:**
- Start with web app, NOT Chrome extension (extension later)
- Focus on LinkedIn first (largest job market)
- Keep OpenClaw skill as separate channel
- Build in Lovable → export to GitHub → Vercel

**Aaron building Lovable site now. Next step: GitHub export + Supabase setup.**

---

*Last updated: April 4, 2026 by Rumi*
