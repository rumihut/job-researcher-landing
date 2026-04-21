# Critical Deployment Info — Claw Store & X Automation

## Repository Setup

**Vercel Deployment Source:**
- **Repo:** `ahuts/neon-claw-landing` (NOT rumihut/job-researcher-landing)
- **Live URL:** `claw.hatchedpixel.com`
- **Subdomain:** `claw.hatchedpixel.com` (linked from hatchedpixel.com menu)

## Workflow for Store Updates

**When updating the store:**
1. Edit files in local repo: `C:\Users\Rumi\.openclaw\workspace\neon-claw-temp\`
2. Commit and push to: `ahuts/neon-claw-landing` (origin/main)
3. Vercel auto-deploys on push to main branch
4. Verify at: `claw.hatchedpixel.com`

**DO NOT push to:** `rumihut/job-researcher-landing` (that repo is backup/archived)

## Store Branding (Current)

**Tagline:** "Ready to automate your workflow?"
**Header:** "OpenClaw Skills" (not "The Store")
**Positioning:** Premium AI automation skills, not just job researcher

## Files to Update for Store Changes

- `src/components/FooterCTA.tsx` — Footer CTA text
- `src/components/ProductsSection.tsx` — Store header, products
- `src/components/HeroSection.tsx` — Homepage hero
- `src/components/Navigation.tsx` — Navigation menu

## Product Layout (CRITICAL)

**2 Available Now (with Stripe links):**
1. Job Researcher Skill ($29) — https://buy.stripe.com/5kQ7sNfbib7acq08Nz4F205
2. X/Twitter Autopilot ($15) — https://buy.stripe.com/8x2cN77IQ2AE1Lm6Fr4F206

**8 Coming Soon (faded, non-clickable):**
- Lead Researcher Agent
- Automation Blueprints
- Conversion Script Pack
- Voice AI Setup Guide
- Chatbot Builder Kit
- High-Converting Funnels
- Analytics & Tracking Guide
- Email Sequence Vault

## X Posting Automation

**Working Directory:** `C:\Users\Rumi\.openclaw\workspace\skills\skill-x-poster\scripts\`
**Command:** `node post-to-x.js --message "Your tweet here"`

**X API Credentials (in script):**
- Consumer Key: [REDACTED — see local config]
- Access Token: [REDACTED — see local config]

**IMPORTANT:** Script has default message if none provided. Always use `--message` flag.

## Critical Backups

**ZIP Files:** `C:\Users\Rumi\.openclaw\workspace\skill-backups-temp\`
- `skill-x-autopilot-v1.0.0.zip` (8KB) — Extract to restore skill

**Skill Directories:** `C:\Users\Rumi\.openclaw\workspace\skills\`
- `job-researcher/` — Job research skill
- `skill-x-poster/` — X posting skill (RESTORE FROM ZIP IF LOST)

## Disaster Recovery

**IF SKILL-X-POSTER IS LOST:**
1. Check `skill-backups-temp\skill-x-autopilot-v1.0.0.zip`
2. Extract to `skills\skill-x-poster\`
3. Verify scripts are present

**IF ZIP IS LOST:**
1. Check Git history in `skill-backups` repo
2. Or recreate from memory (I have the code)

## Git Reset WARNING

**NEVER `git reset --hard` without checking what's in later commits!**
- Lost skill-x-poster (2026-04-03)
- Lost all cron jobs (had to recreate)
- Lost ZIP files (recovered from backup)

**Always:** `git log --oneline -5` before reset to see what will be lost

## Cron Jobs (Working) — UPDATED April 4, 2026

**Location:** OpenClaw cron system
**Session:** isolated
**Target:** 8349268493 (Telegram)
**Status:** ✅ Working with ~1 hour delay
**All jobs now use ABSOLUTE PATHS to avoid "file not found" errors

### Maintenance Jobs (Daily)
| Job Name | Cron ID | Time (CDT) | Purpose |
|----------|---------|------------|---------|
| CEO-brief | `efdff867-3574-4286-b79e-adc0b8f588ba` | 7:00 AM | Morning priorities, blockers, status |
| Tweet-ideas | `3549c2d2-95de-40ba-9e4c-98e2064ad50f` | 8:00 AM | Suggest 2-3 tweet ideas |
| Daily-improvement | `c25334a2-ef23-49d4-971c-29580ed35e9e` | 12:00 PM | Review MEMORY.md, suggest improvements |
| Daily-journal | `ef251194-2160-4e43-a243-4bd917a706b6` | 10:00 PM | Log today's activity |
| Todo-rollover | `125bc954-21eb-4458-8408-c89ead63720f` | 11:00 PM | Archive completed, roll over incomplete |

### X Posting Jobs (Weekly Schedule)
| Day | Time (CDT) | Theme | Cron ID | Post Type |
|-----|------------|-------|---------|-----------|
| **Monday** | 9:30 AM | New Week, New Build | `90b8ec73-ac78-4765-8a96-7402d7daec73` | Progress + goals |
| | 2:30 PM | — | `fa8c97af-e220-4f20-988a-e323a80a2dc6` | Behind the scenes |
| **Tuesday** | 10:00 AM | Teach Tuesday | `bbbfe681-deac-4a3c-bd42-0de6ea79f5b1` | Educational tip |
| | 3:00 PM | — | `6b4661a9-0071-4b25-9e6f-73715e31a631` | Product feature |
| **Wednesday** | 9:00 AM | **Winsday** | `ff12865b-2bb6-4391-9e4d-c399f5747e22` | Celebrate win/milestone |
| | 2:00 PM | — | `298f2786-5f85-469b-8e2f-aba0961e73c5` | Community question |
| **Thursday** | 9:30 AM | Technical Deep Dive | `0f3ccbd3-4278-4ed7-a1bd-c6e01e9c3dac` | Technical content |
| | 2:30 PM | — | `1c8b660e-cbed-4621-8223-8fc4c7b28e25` | How it works |
| **Friday** | 10:30 AM | Feature Friday | `072852d9-89ec-4f4c-b770-918d8c09d0ed` | Week recap |
| | 3:00 PM | — | `ee6f3bc7-858d-409f-81cf-40a6ff9a6a5a` | Poll / Next week tease |
| **Saturday** | 10:00 AM | Weekend Build | `fd837554-4bdc-45ae-bb38-4752f2f7c3d4` | Casual update |
| **Sunday** | 6:00 PM | Strategy Sunday | `7e2b1891-2d6a-4d53-bc52-deac68d3f1cb` | Reflection |

**Total: 17 cron jobs | Session: isolated | Telegram: 8349268493**

**Note:** EOD-X-DM-capture REMOVED — X API restrictions prevent checking DMs

## Important Notes

- Vercel auto-deploys on every push to main
- Build time: ~30-60 seconds
- Check Vercel dashboard for deployment status
- Use `git status` before committing
- **ALWAYS** backup skills before major git operations
- X posting requires `--message` flag (no file input support yet)
- **CRITICAL:** Always write cron job outputs to `memory/cron-outputs-archive.md` — otherwise they're lost when the session ends

---

## Cron Job Output Archiving — NEW April 5, 2026

**Problem:** Cron jobs run in isolated sessions. Their outputs are sent to chat but not saved to memory files. When the session ends, that context is lost.

**Solution:** After every cron job execution, append the full output to `memory/cron-outputs-archive.md`

### Archive Format:
```markdown
## [Date] — [Job Name] ([Time])

### Source: Cron job `[cron-id]`

**Session:** Agent spawned via cron (isolated session)

### Full Output:
[Copy entire cron output here]

### Generated Content:
- Tweet ideas: [list them]
- Reports: [summarize]
- Action items: [list]
```

### Daily Log Integration:
Reference the archive in daily logs:
```markdown
### ✅ Deliverables from Cron
- **3 Tweet ideas generated** (see `memory/cron-outputs-archive.md`)
- Tweet #3 selected and posted
```

## GitHub Authentication — SOLVED April 5, 2026

**Problem:** SSH keys don't work across accounts, deploy keys are single-repo only

**Solution:** GitHub Personal Access Token (PAT) for ahuts account

**Token:** `[REDACTED — see 1Password or local config]`
- **Scope:** `repo` (full control of private repositories)
- **Account:** ahuts (Aaron's account)
- **Status:** ✅ Active, no expiration

**Usage:**
```bash
# Set remote with PAT embedded (one-time per repo)
git remote set-url origin https://ahuts:<PAT>@github.com/ahuts/REPO_NAME.git

# Now pushes work seamlessly
git push origin main
```

**Benefits:**
- ✅ No SSH agent issues
- ✅ Works for any ahuts repo
- ✅ Can create new repos
- ✅ No manual intervention needed
- ✅ "Set and forget"

**When to use:**
- All ahuts repos (neon-claw-landing, job-guard-pro, future projects)
- Creating new repositories
- Any GitHub API operations

**Security:**
- Token is stored in workspace memory (not in code)
- Scoped to repo access only
- Can be revoked/replaced if needed

---

**Last Updated:** 2026-04-05 by Rumi
**Critical Events:** Git auth bottleneck resolved, full repo access enabled
**Critical Events:** Git reset disaster (2026-04-03), Skill recovery (2026-04-04)
