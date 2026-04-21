# X Post Ideas & Hot Takes

Raw material for the X poster. Captured during conversations with Aaron.

## Ghost Job Market
- 43% of job postings are ghost jobs — that's not a conspiracy, it's a business model
- Companies post fake jobs to look like they're growing, appear stable to investors
- The FTC named deceptive job ads a priority enforcement area. California requires hiring intent disclosure
- $737M lost to fake job offers in the US since 2019
- 27% of LinkedIn listings show ghost job patterns
- Job seekers waste an average of 6+ hours on each fake application

## Building GhostJob
- We went from idea to published Chrome extension in under 2 weeks
- Local regex analysis gives instant results, API gives company signals — we do both with graceful fallback
- Flipped from Ghost Score (higher=worse) to Trust Score (higher=safer) — sounds obvious now but took a week to realize
- Injecting a button into LinkedIn's DOM was harder than the actual detection algorithm
- Email/password only in the extension — Google OAuth can't handle chrome.identity redirects
- 3 scans free, unlimited with Pro ($9/mo) — Stripe webhook sets your tier automatically

## Product & Design Opinions
- Every ghost job detector makes you copy-paste into their website — we scan inline on LinkedIn
- Scoring systems should match user intuition: higher = better (Trust Score > Ghost Score)
- Signal detections should quote the actual triggering text — show evidence, not just conclusions
- Chrome extensions that break when LinkedIn changes class names are fragile — go class-agnostic
- 8-second API timeout with graceful degradation — you always get an answer

## Competition & Differentiation
- GhostJobs.io has 305 users with a manual reporting tool — we do it automatically
- Competitors require copy/paste or leaving the page — we scan inline with one click
- Most detectors focus on fake companies — ghost jobs are different (real company, fake listing)

## X API Changes (Apr 20, 2026)
- Owned reads now $0.001 per request — mentions monitoring is dirt cheap
- Writing posts goes from $0.01 to $0.015 per post
- URL posts now $0.20 each — 20x the cost — we should avoid links in regular posts
- Following, likes, quote-posts removed from self-serve API tiers
- "Summoned replies" stay at $0.01 — unclear what qualifies

## AI & Automation Opinions
- Building with AI doesn't mean shipping sloppy — it means you can focus on what matters
- The best AI tools are the ones you forget are AI — they just work
- Too many "AI-powered" job tools are just GPT wrappers. Pattern matching beats LLMs for structured detection