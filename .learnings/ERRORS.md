# Errors

Command failures and integration errors.

---

## [ERR-20260411-001] content_script_regex

**Logged**: 2026-04-11T22:07:00Z
**Priority**: critical
**Status**: resolved
**Area**: frontend

### Summary
Unescaped slashes in regex `/m/f/d/v/` crashed the entire content script, making the extension non-functional.

### Error
```
SyntaxError: Invalid regular expression flags
```

### Context
- The regex was part of a substance-stripping pattern to remove EEO filler text from job descriptions
- `/m/f/d/v/` was interpreted as regex `/m/` with flags `f`, `d`, `v`
- This killed the entire IIFE, so no button, no badge, no scan — complete silent failure
- `node -c content.js` caught it immediately

### Suggested Fix
Escape forward slashes in regex: `m\/f\/d\/v` instead of `m/f/d/v`

### Metadata
- Reproducible: yes
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: regex, chrome-extension, syntax-error

---

## [ERR-20260409-001] X/Twitter Cron Job - Placeholder Content Posted

**Logged**: 2026-04-09T16:01:00Z
**Priority**: high
**Status**: resolved
**Area**: infra

### Summary
Cron job posted placeholder/template text "Thursday afternoon - How it works" instead of generated content.

### Error
```
Tweet posted: "Thursday afternoon - How it works"
URL: https://x.com/i/status/2042324375903285395
Scheduled: Thursday, April 9th, 2026 — 2:30 PM (America/Chicago)
```

### Context
- Cron job ID: `1c8b660e-cbed-4621-8223-8fc4c7b28e25`
- Theme: "How it works" (Thursday 2:30 PM slot)
- Script: `skills/skill-x-poster/scripts/post-to-x.js`
- Problem: Script has default message fallback that posted generic content when no `--message` provided
- Cron output was NOT archived to `memory/cron-outputs-archive.md` (session ended before write)

### Root Cause
1. Cron job script falls back to default message if no `--message` flag provided
2. Default message: "Building in public with @ahuts86 — What's your latest win?"
3. Actual posted content was different placeholder: "Thursday afternoon - How it works"
4. Cron job didn't generate real content based on theme
5. Output not archived — lost when isolated session ended

### Suggested Fix
1. **Remove default message fallback** — require explicit `--message` or fail
2. **Add validation** — check message is not template/placeholder text
3. **Archive output before posting** — write to file first, then post
4. **Update cron jobs** — ensure they generate real content before calling script

### Metadata
- Reproducible: yes (if cron job runs without proper message generation)
- Related Files: 
  - `skills/skill-x-poster/scripts/post-to-x.js`
  - `memory/claw-store-deployment.md` (cron job definitions)
  - `memory/cron-outputs-archive.md`
- See Also: None

---

## [ERR-20260417-001] git_push_protection

**Logged**: 2026-04-17T21:42:00Z
**Priority**: high
**Status**: resolved
**Area**: infra

### Summary
Workspace repo git push blocked by GitHub Push Protection — old secrets in memory files

### Error
```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - GITHUB PUSH PROTECTION
remote: - Push cannot contain secrets
remote: - GitHub Personal Access Token —
remote:   locations:
remote:     - memory/claw-store-deployment.md:28
remote:     - memory/claw-store-deployment.md:175
remote:     - memory/claw-store-deployment.md:183
```

### Context
- Pushing workspace repo (rumihut/job-researcher-landing)
- Old memory files contain GitHub PATs from initial setup
- These are in git history so simple file edit won't fix it — need BFG or git filter-branch to rewrite history

### Suggested Fix
1. Redact secrets from `memory/claw-store-deployment.md` and `memory/2026-04-05.md`
2. Use `git filter-branch` or BFG Repo Cleaner to remove from history
3. Or add `.gitignore` for `memory/` and force push

### Metadata
- Reproducible: yes
- Related Files: memory/claw-store-deployment.md, memory/2026-04-05.md
- Tags: github, secrets, push-protection

---

## [ERR-20260420-001] x_poster_duplicate_tweets

**Logged**: 2026-04-20T21:52:00Z
**Priority**: critical
**Status**: resolved
**Area**: infra

### Summary
X poster posted identical tweet 3 days in a row because recent-posts dedup tracker had wrong year timestamps

### Error
```
Same tweet posted Apr 18, 19, and 20:
"43% of job postings are ghost jobs and nobody's talking about it..."
```

### Context
- smart-x-poster.js had similarity check + recent posts tracker to prevent duplicates
- Tracker loaded from `memory/x-recent-posts.json` with 7-day cutoff
- Seeded timestamps used 2025 epoch (1744xxx) instead of 2026 epoch (1776xxx)
- 7-day filter removed ALL entries, leaving tracker empty — no dedup protection
- selectBestTweet deterministically picks the same "best" tweet from the same daily log every time
- Two compounding bugs: (1) wrong timestamps, (2) deterministic selection with identical inputs

### Root Cause
1. **Wrong year in timestamps**: Used JS `new Date('2025-04-17')` values instead of `new Date('2026-04-17')` — 2026 epochs start with 1776xxx, not 1744xxx
2. **Deterministic selection**: Same daily log → same accomplishments → same template pool → same "best" pick every time
3. **Soft penalty not enough**: Original similarity penalty (-10×sim) wasn't strong enough; needed hard skip at 30% overlap

### Fix Applied
1. Reseeded `x-recent-posts.json` with correct 2026 timestamps
2. Changed similarity check: `if (sim > 0.3) continue;` — hard skip instead of soft penalty
3. Added ideas log (`x-ideas.md`) as additional tweet source for variety
4. Tuned scoring: longer tweets get +4 instead of +3, questions reduced to +1

### Metadata
- Reproducible: yes (with wrong timestamps)
- Related Files: skills/skill-x-poster/scripts/smart-x-poster.js, memory/x-recent-posts.json
- Tags: x-poster, duplicate, timestamp, dedup
- Pattern-Key: x_poster.duplicate_fix

---
