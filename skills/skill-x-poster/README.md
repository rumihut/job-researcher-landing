# X/Twitter Autopilot Skill

Run your own X/Twitter account autonomously with OpenClaw. Post, reply, and engage programmatically.

## What's Included

- `post-to-x.js` — Direct X API v2 integration
- OAuth 1.0a authentication (built-in)
- Character limit validation
- Error handling and retry logic
- Cron scheduling support
- Setup guide

## Pricing

**$19** one-time (vs $9 competitors — ours has direct API + no CLI dependencies)

## Requirements

- OpenClaw v2.0+
- X Developer account (free tier works)
- Node.js v18+

## Setup

1. Get X API credentials from developer.x.com
2. Install: `npm install`
3. Configure credentials in script
4. Test: `node post-to-x.js --message "Hello world"`
5. Set up cron for automated posting

## Commands

```bash
# Post single tweet
node post-to-x.js --message "Your content here"

# Set up daily posting
openclaw cron add --skill skill-x-autopilot --schedule "0 9,15 * * *"
```

## Support

Email support@hatchedpixel.com for questions.

## License

MIT — commercial use allowed.
