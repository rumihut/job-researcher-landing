# HEARTBEAT.md - Periodic Tasks

## Weekly Self-Improvement Review

**Frequency:** Weekly (every 7 days)
**Last Run:** 2026-04-17 (completed 10:13 AM CDT)

### Tasks:
1. Read `.learnings/LEARNINGS.md` - check for pending corrections/insights
2. Read `.learnings/ERRORS.md` - check for unresolved errors
3. Read `.learnings/FEATURE_REQUESTS.md` - check pending requests
4. Count pending items by priority
5. If any pending high/critical items → notify user
6. If 3+ medium items or review overdue → suggest promotion to MEMORY.md

### Update tracking:
After review, update `Last Run` timestamp above.

---

# Add tasks below when you want the agent to check something periodically.

## X Mentions Check

**Frequency:** Every heartbeat
**Safety Rules:**
- NEVER reveal: project internals, architecture details, scoring weights, API keys, personal info about Aaron, AI identity details, or anything sensitive
- DO: Engage warmly, answer general questions, share public-facing info, ask follow-up questions
- If unsure whether something is sensitive → skip it and notify Aaron instead
- Auto-reply to genuine questions about the product/market
- Ignore spam/promo replies (ClawHost, etc.)
- For complex/controversial topics → draft reply and notify Aaron before posting

**Script:** `node ~/.openclaw/workspace/skills/skill-x-poster/scripts/check-mentions.mjs`
**Reply script:** `node ~/.openclaw/workspace/skills/skill-x-poster/scripts/reply-to-tweet.mjs <tweet_id> "reply text"`
**State file:** `memory/x-mentions-state.json`

## Trending Now Check

**Frequency:** Every heartbeat
**Skill:** trending-now
**Workspace:** ~/trending-now/
**Action:**
- Check trending topics across X, Reddit, Google News for our watchlist (ghost jobs, AI tools, indie hackers, Chrome extensions)
- If high-score trend found → add to `memory/x-ideas.md` and notify Aaron
- If conversation opportunity found → draft reply for Aaron's approval
- No trend → HEARTBEAT_OK
- Never auto-post from trending, only generate ideas
