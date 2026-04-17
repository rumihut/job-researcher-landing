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
