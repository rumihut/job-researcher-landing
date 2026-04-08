# X/Twitter Autopilot Guide

**Your AI-Powered Social Media Presence**

Run your X/Twitter account autonomously with OpenClaw. Post, reply, and engage — all from your local machine.

---

## Table of Contents

1. [What This Skill Does](#what-this-skill-does)
2. [Why X Automation Matters](#why-x-automation-matters)
3. [Quick Start](#quick-start)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Content Strategy](#content-strategy)
6. [Safety & Guardrails](#safety--guardrails)
7. [Troubleshooting](#troubleshooting)
8. [Advanced: Cron Scheduling](#advanced-cron-scheduling)

---

## What This Skill Does

The X/Twitter Autopilot Skill gives your OpenClaw agent the ability to:

✅ **Post tweets** — Autonomously or on command  
✅ **Reply to mentions** — Engage with your community  
✅ **Like & retweet** — Stay active in your niche  
✅ **Follow strategically** — Grow your network  
✅ **Schedule content** — Set up recurring posts  

**No monthly fees.** No expensive tools. Just your OpenClaw setup + this skill.

---

## Why X Automation Matters

### The Problem
Building an audience on X takes 2-3 hours/day of:
- Writing posts
- Replying to mentions
- Engaging with others
- Staying consistent

Most people quit before seeing results.

### The Solution
Automation doesn't replace you — it amplifies you:

- **Show up daily** without being glued to your phone
- **Reply promptly** to build relationships
- **Test content** faster with more posts
- **Focus on strategy** while the agent handles execution

---

## Quick Start

**Already have credentials? Skip to Step 4.**

```bash
# 1. Post your first tweet
node scripts/post-to-x.js --message "Hello world from my AI!"

# 2. Check your X timeline
# Your post should appear instantly

# 3. Celebrate! You're now autonomous.
```

---

## Step-by-Step Setup

### Step 1: Create X Developer Account

1. Go to https://developer.x.com
2. Sign in with your X account
3. Click "Apply for Developer Account"
4. Choose "Free" tier (works for our use case)
5. Fill out the form (describe your project)
6. Wait for approval (usually instant for free tier)

### Step 2: Create an App

Once approved:

1. In Developer Portal, click "Create App"
2. Name it "OpenClaw X Posting" (or anything)
3. Copy these values:
   - **API Key** (Consumer Key)
   - **API Secret** (Consumer Secret)

### Step 3: Generate Access Token

1. In your app settings, scroll to "User authentication settings"
2. Click "Set up"
3. Set App permissions to **"Read and Write"**
4. Set Type of App to **"Native App"**
5. Set Callback URL to `http://localhost:3000/callback`
6. Save
7. Generate **Access Token** and **Access Token Secret**
8. Copy both values

### Step 4: Configure the Skill

1. Open `scripts/post-to-x.js`
2. Find the `CONFIG` object at the top
3. Replace with your credentials:

```javascript
const CONFIG = {
  consumerKey: 'YOUR_API_KEY',
  consumerSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
};
```

### Step 5: Test Your Setup

```bash
node scripts/post-to-x.js --message "Testing my new X autopilot setup!"
```

If you see "Posted successfully!" check your X timeline.

---

## Content Strategy

### What to Post

**1. Build in Public**
```
"Day 3 building the Lead Research Skill. 

Today: Company data enrichment working.

Next: Decision maker finding.

Progress: 🟢🟢🟢⚪⚪ 60%"
```

**2. Quick Wins**
```
"Automation tip: 30-40% of job postings are ghost jobs. 

Our new skill detects them before you waste time applying.

What would you automate?"
```

**3. Questions**
```
"Question for the builders:

What's the most repetitive task you do daily that could be automated?

I'll build a skill for the top answer."
```

**4. Behind the Scenes**
```
"How the Job Researcher Skill works:

1️⃣ Scrape job posting
2️⃣ Check for ghost job red flags
3️⃣ Research company health
4️⃣ Calculate lead score
5️⃣ Add to tracker

All hands-off."
```

### Posting Schedule

**Start here:**
- 1-2 posts/day (morning + afternoon)
- 2-4 replies to mentions
- Like 5-10 relevant posts

**Scale up:**
- 3-4 posts/day
- More replies and engagement
- Thread longer content

**Best times (US audience):**
- 9 AM EST — Morning scroll
- 12 PM EST — Lunch break
- 3 PM EST — Afternoon slump
- 8 PM EST — Evening wind-down

---

## Safety & Guardrails

### Automatic Limits

The skill enforces:
- ✅ 280 character limit
- ✅ Rate limit awareness
- ✅ JSON validation
- ✅ Error retries

### What NOT to Post

Never automate:
- ❌ Controversial opinions
- ❌ Offensive content
- ❌ Spam or excessive self-promotion
- ❌ Automated DMs (against X rules)

### Content Approval (Recommended)

For first 2 weeks, review before posting:

```bash
# Preview mode (dry run)
node scripts/post-to-x.js --message "Your content" --dry-run

# Then post for real
node scripts/post-to-x.js --message "Your content"
```

---

## Troubleshooting

### "API Error 400 — Invalid Request"

**Cause:** JSON encoding issue or bad OAuth signature

**Fix:**
- Check your credentials are correct
- Ensure no extra characters in the config
- Regenerate access tokens if needed

### "API Error 403 — Forbidden"

**Cause:** App permissions set to "Read only" instead of "Read and Write"

**Fix:**
1. Go to developer.x.com
2. Your app → Settings
3. Change permissions to "Read and Write"
4. Regenerate access tokens

### "Rate limit exceeded"

**Cause:** Posted too frequently

**Fix:**
- Wait 15 minutes
- Post less frequently
- Free tier allows 50 tweets/15 min

### Post not appearing

**Check:**
- Is your X account logged in?
- Did you get "Posted successfully" message?
- Check X app (not just web)

---

## Advanced: Cron Scheduling

Set up automated posting with OpenClaw cron:

### Daily at 9 AM
```bash
openclaw cron add \
  --name "x-morning-post" \
  --skill skill-x-autopilot \
  --script post-to-x.js \
  --schedule "0 9 * * *"
```

### Twice Daily (9 AM + 3 PM)
```bash
openclaw cron add \
  --name "x-twice-daily" \
  --skill skill-x-autopilot \
  --script post-to-x.js \
  --schedule "0 9,15 * * *"
```

### Weekly Thread (Mondays 10 AM)
```bash
openclaw cron add \
  --name "x-weekly-thread" \
  --skill skill-x-autopilot \
  --script post-to-x.js \
  --schedule "0 10 * * 1"
```

---

## Next Steps

1. ✅ Post your first autonomous tweet
2. ✅ Engage with 5 relevant accounts
3. ✅ Set up content calendar
4. ✅ Plan your first thread
5. ✅ Track engagement and iterate

---

## Support

Questions? Email: support@hatchedpixel.com

Built with ❤️ by Rumi (@rumihutai)

---

**Remember:** Automation amplifies your voice — it doesn't replace it. The best accounts still have a human behind them.

Now go build your audience! 🚀
