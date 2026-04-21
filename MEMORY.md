# MEMORY.md - Long-Term Memory

## Active Projects

### GhostJob (Job Ghost Detector SaaS)
**Status:** Stripe integrated ✅ | Chrome Web Store submitted for review ✅ | Dashboard built via Lovable Cloud | Save-to-Dashboard live ✅ | Auth (email/password) in extension ✅ | Token refresh ✅ | Scan limits (3/mo free) ✅ | Multi-TLD careers check ✅ | Duplicate save prevention ✅
**Priority:** High
**Next Steps:**
- [x] ✅ Point jobghost.io at Vercel (completed Apr 18 by Aaron)
- [ ] 🔴 Chrome Web Store review follow-up (submitted Apr 14, Day 7+ — MEMORY.md previously marked approved but no human session confirmed. Aaron must verify dashboard status.)
- [ ] Clean old secrets from memory files to unblock git push (claw-store-deployment.md, 2026-04-05.md)
- [ ] Test new personality-driven X poster via cron auto-run
- [ ] Record demo video (60 sec LinkedIn walkthrough)
- [ ] Connect extension Save-to-Dashboard to Lovable Cloud backend
- [ ] Real-world testing on LinkedIn (location + salary extraction)
- [ ] Polish extension icons (functional but need refinement)
- [ ] Narrow host_permissions to linkedin.com/jobs/*
- [ ] "View Dashboard" link in popup
- [ ] Scan history in popup (last 5 scans)
- [ ] SPA navigation testing (MutationObserver stability)
- [ ] Switch to Supabase later if Lovable Cloud hits limits

**Key Details:**
- Domain: jobghost.io ✅ (connected to Vercel, Apr 18)
- V4: Self-contained architecture — local scoring with API fallback
- Trust Score (higher = safer, 0-100 scale)
- Quote extraction shows actual text from postings for each signal
- Extension injects "Scan for Ghost Jobs" button next to LinkedIn Save button
- Modal overlay with red/yellow/green flags and detailed signal breakdowns
- Chrome Web Store: Published (Public visibility) ✅

**Backend: Lovable Cloud** (not Supabase — see decision below)
- Lovable auto-created tables: profiles, saved_jobs, scan_signals
- Dashboard built with auth, saved jobs, signal details
- Can migrate to Supabase later if needed (schema documented)

**Competitive Edge:** Only tool that injects directly into LinkedIn inline — competitors all require copy/paste or leaving the page

**Market Context:**
- ~43% of job postings are ghost jobs (2024-2025 research)
- Competitors: JobScamScore, Inteller.ai, Trouvr, Deghost, Lumen, Subspace
- $737M lost to fake job offers in US since 2019

## Key Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| Apr 8 | Hybrid approach: Extension + Web Dashboard | Extension for scanning, dashboard for tracking saved jobs |
| Apr 8 | Regex-based local analysis | Avoid API costs, instant results, works offline |
| Apr 8 | Modal overlay for results | Better UX than inline - doesn't squeeze buttons together |
| Apr 8 | Inject button next to LinkedIn Save | Most natural placement, follows user flow |
| Apr 13 | Lovable Cloud over Supabase for MVP | Lovable auto-built dashboard+backend; less setup, ship faster. Migrate later if needed |
| Apr 14 | Chrome Web Store: Unlisted visibility | Prevents random discovery before paywall; link-only access until auth is ready |
| Apr 14 | vercel.json SPA rewrites added | Fixes /privacy and all client-side routes returning 404 on Vercel |

## Lessons Learned

### LinkedIn Scraping
- LinkedIn renders content server-side differently than client-side
- Must extract data from actual DOM, not fetch HTML directly
- SPA constantly re-renders - need MutationObserver to keep button visible
- Button injection selectors: `[class*="save"]` → flex row container

### Chrome Extension Development
- Content scripts lose context when extension is reloaded - requires page refresh
- Modal overlay (`position: fixed, z-index: 99999`) works better than inline injection
- Use `chrome.runtime.sendMessage` for popup → content script → background flow

### Regex Patterns
- Experience requirements: Use specific patterns like `/\d{1,2}\+?\s*years?\s*(?:of\s*)?experience/i`
- Avoid catching years (2026) or salary figures ($60k) as "experience"
- Sanity check: max 50 years experience

### X Poster
- Smart poster regex: `(?=###|##|---|$)` stops at `###` subheadings — use `(?=\n##\s)` instead
- PowerShell truncates messages at colons in command args — use `--file` flag with temp file instead
- Template tweets ("Building in public:") are weak — multi-item emoji bullets score higher

## Preferences

### Workflow
1. **Lovable** for UI scaffolding + backend (currently using Lovable Cloud)
2. **GitHub** for version control (ahuts/job-guard-pro)
3. **Vercel** for deployment
4. **Supabase** for database (future migration from Lovable Cloud)

### Code Style
- Prefer explicit over implicit
- Add logging for debugging extension issues
- Handle SPA navigation with MutationObserver

## Ongoing TODOs

### Chrome Extension
- [x] Button injection on LinkedIn job pages
- [x] Local regex-based scoring
- [x] Detailed signal explanations with icons
- [x] Modal overlay for results
- [x] Save to Dashboard functionality
- [x] Trust Score (flipped: higher = safer)
- [x] Quote extraction per signal
- [x] Location extraction (class-agnostic, · separator)
- [x] Salary detection (3-tier: span → desc → body)
- [x] Icons for Chrome Web Store (16x16, 48x48, 128x128)
- [x] Store listing description + privacy policy page
- [x] Chrome Web Store submission (April 14, 2026)
- [x] X poster regex fix (section terminator)
- [x] X poster colon truncation fix (--file flag)
- [x] X poster tweet generation rewrite (multi-item, emoji)
- [x] Save to Dashboard via Supabase REST API
- [x] Extension auth (email/password)
- [x] Token refresh on 401
- [x] Scan limits (3/month free, unlimited signed in)
- [x] Multi-TLD careers page check (.com/.io/.co/.org/.net/.ai)
- [x] Duplicate save prevention
- [ ] Chrome Web Store review — submitted Apr 14; status uncertain (needs Aaron to verify dashboard)
- [ ] Connect extension Save-to-Dashboard to Lovable Cloud
- [ ] Real-world LinkedIn testing (location + salary on live pages)
- [ ] Polish extension icons
- [ ] Narrow host_permissions to linkedin.com/jobs/*
- [ ] "View Dashboard" link in popup
- [ ] Scan history in popup (last 5 scans)
- [ ] SPA navigation testing (MutationObserver stability)
- [x] Domain: point jobghost.io at Vercel ✅ (Apr 18, Aaron)

### Web Dashboard (Lovable Cloud)
- [x] Auth (email/password + Google OAuth)
- [x] Saved jobs list with Trust Score badges
- [x] Signal detail expansion (red/yellow/green with quotes)
- [x] Free tier limit (3 scans/month)
- [ ] Connect extension to dashboard backend
- [ ] Upgrade CTA for Pro ($9/mo)
- [ ] Historical trends
- [x] Stripe integration ✅

## Notes

**GhostJob Signals Tracked:**
- Red flags: Reposted job, urgency language, unrealistic experience, vague salary, generic description, high experience for entry-level
- Yellow flags: No salary listed, no team/manager, vague location, AI language, culture buzzwords, stale listing (30+ days)
- Green flags: Salary transparency, benefits mentioned, flexible work, hiring manager contact, clear requirements

**User:** Aaron (ahuts86) - prefers pragmatic solutions, values working code over perfect theory

---

*Last updated: April 19, 2026 11:00 PM (todo rollover)*