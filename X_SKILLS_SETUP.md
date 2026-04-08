# X/Twitter Skills Setup Guide

## For Reading Tweets (bird CLI)

**Prerequisites:**
- Logged into x.com in Chrome, Safari, or Firefox on your computer
- Node.js installed

**Installation:**
```bash
npm install -g @steipete/bird
```

**Usage:**
```bash
# Read tweets from a user
bird user-tweets elonmusk

# Read mentions
bird mentions

# Search tweets
bird search "ghost job"

# Read specific tweet
bird read https://x.com/elonmusk/status/1234567890
```

**Authentication:**
Bird automatically extracts cookies from your browser. Just be logged into x.com!

## For Posting Tweets (x-api skill)

**Already configured!** ✅

Credentials stored in: `~/.clawdbot/secrets/x-api.json`

**Usage:**
```bash
x-post "Your tweet here"
```

## Testing

After installing bird CLI on your computer, try:
```bash
bird user-tweets elonmusk --limit 5
```

This will show Elon's 5 most recent tweets!

## Integration with OpenClaw

Once bird CLI is working locally, you can:
1. Run it manually for monitoring
2. Pipe output to OpenClaw for analysis
3. Use x-api skill to post responses

**Ready to test? Install bird CLI and let me know!** 🐦
