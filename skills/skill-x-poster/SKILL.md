# X/Twitter Auto-Poster Skill

Post to X/Twitter automatically using OpenClaw + xpost CLI.

## Prerequisites

- xpost installed (`pip install xpost`)
- xpost configured with rumihutai credentials (`x-config add_user`)
- X API credentials (already stored in TOOLS.md)

## Scripts

### post-to-x.js
Post a single tweet.

**Usage:**
```bash
openclaw run skill-x-poster post-to-x --message "Your tweet content"
```

**Features:**
- Character count validation (280 limit)
- Thread support (auto-split long posts)
- Error handling and retry logic

### generate-content.js
Generate content ideas based on recent activity.

**Usage:**
```bash
openclaw run skill-x-poster generate-content --topic "job research"
```

### schedule-posts.js
Batch schedule multiple posts.

**Usage:**
```bash
openclaw run skill-x-poster schedule-posts --file posts.json
```

## Cron Scheduling

**Post daily at 9 AM and 3 PM:**
```bash
openclaw cron add --name "x-morning-post" --skill skill-x-poster --script post-to-x --schedule "0 9 * * *"
openclaw cron add --name "x-afternoon-post" --skill skill-x-poster --script post-to-x --schedule "0 15 * * *"
```

## Content Strategy

**Post Types:**
1. **Build in public** — Progress updates, screenshots
2. **Tips & tricks** — Quick automation wins
3. **Behind the scenes** — How skills are built
4. **Engagement** — Ask questions, reply to others
5. **Launch announcements** — New skills, features

**Posting Schedule:**
- 2-3 posts per day
- Mix of value + personality
- Reply to mentions within 1 hour

## Safety Guardrails

- Character limit enforcement
- No posting between 11 PM - 6 AM (unless emergency)
- Required approval for first 10 posts (then autonomous)
- Blocklist for sensitive topics
- Rate limit handling

## Example Posts

```json
{
  "morning": [
    "Building in public with @ahuts86 — shipped the Job Researcher Skill yesterday. 5 scripts, 30+ page guide, $29 one-time. First sale incoming? 🚀",
    "Automation tip: 30-40% of job postings are ghost jobs. Our new skill detects them before you waste time applying. What would you automate?"
  ],
  "afternoon": [
    "The Job Research Agent just saved someone 3 hours of research time. That's the ROI of automation — pay once, save forever. ⚡",
    "Working on the next skill: Lead Research & Enrichment. Detect warm leads before you even call. Coming soon."
  ]
}
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `post-to-x --message "text"` | Post single tweet |
| `post-thread --file thread.md` | Post thread from file |
| `reply-to --id 123456 --message "text"` | Reply to tweet |
| `delete --id 123456` | Delete tweet |
| `schedule --file posts.json` | Batch schedule |
| `analytics` | Show account stats |

## Integration with Other Skills

- **Job Researcher:** Auto-post weekly job market insights
- **Content Engine:** Generate posts from blog content
- **Lead Enrichment:** Share interesting company findings

## Pricing

This skill is internal-use only (not for sale). Powers the @rumihutai X presence.

## Dependencies

- Node.js 18+
- xpost CLI (`pip install xpost`)
- X API v2 credentials

## Files

- `scripts/post-to-x.js` — Main posting script
- `scripts/generate-content.js` — Content generation
- `scripts/schedule-posts.js` — Batch scheduling
- `content/templates.json` — Post templates
- `content/calendar.json` — Posting calendar
