#!/usr/bin/env node
/**
 * Smart X Poster — Generates tweets from daily activity logs
 * 
 * Reads the daily memory file and generates engaging, personality-driven
 * tweet content based on actual work accomplished.
 * 
 * Usage: node smart-x-poster.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Configuration
const MEMORY_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'workspace', 'memory');
const POST_SCRIPT = path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'workspace', 'skills', 'skill-x-poster', 'scripts', 'post-to-x.js');

// Sensitive patterns to exclude
const SENSITIVE_PATTERNS = [
  /api[_-]?key/i,
  /api[_-]?secret/i,
  /access[_-]?token/i,
  /consumer[_-]?secret/i,
  /password/i,
  /ghp_[a-zA-Z0-9]{36}/i,
  /sk-[a-zA-Z0-9]{48}/i,
  /[a-zA-Z0-9]{40,}/,
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
];

/**
 * Get today's and yesterday's memory file paths
 */
function getTodayMemoryPath() {
  const now = new Date();
  return path.join(MEMORY_DIR, `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.md`);
}

function getYesterdayMemoryPath() {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return path.join(MEMORY_DIR, `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.md`);
}

/**
 * Read and parse the daily memory file
 */
function readDailyLog() {
  const paths = [getTodayMemoryPath(), getYesterdayMemoryPath()];
  for (const logPath of paths) {
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf-8');
      if (content.trim().length > 50) {
        console.log(`Using memory file: ${path.basename(logPath)}`);
        return content;
      }
    }
  }
  console.log('No daily log found for today or yesterday');
  return null;
}

/**
 * Extract accomplishments from the daily log
 */
function extractAccomplishments(content) {
  if (!content) return [];
  
  const accomplishments = [];
  
  const doneSection = content.match(/##\s*✅\s*Completed[\s\S]*?(?=\n##\s)/i)
    || content.match(/##\s*What Got Done[\s\S]*?(?=\n##\s)/i)
    || content.match(/##\s*\d+\)\s*What Got Done[\s\S]*?(?=\n##\s)/i)
    || content.match(/###\s*✅\s*Completed[\s\S]*?(?=\n##\s|\n###\s[^✅])/i)
    || content.match(/###\s*What Got Done[\s\S]*?(?=\n##\s|\n###\s[^W])/i);
  if (doneSection) {
    const lines = doneSection[0].split('\n');
    for (const line of lines) {
      const match = line.match(/(?:^\s*[-*]\s+(?:✅|\[x\]|\[X\])?\s*)(.+)/);
      if (match) {
        const item = match[1].trim()
          .replace(/\*\*/g, '')
          .replace(/\[([\^\]]+)\]\([^)]+\)/g, '$1')
          .trim();
        
        if (item && item.length > 10 && !isSensitive(item)) {
          accomplishments.push(item);
        }
      }
    }
  }
  
  // Also look for standalone ✅ or [x] lines
  const allLines = content.split('\n');
  for (const line of allLines) {
    if (accomplishments.length >= 15) break;
    const match = line.match(/^\s*[-*]\s+(?:✅|\[x\]|\[X\])\s+(.+)/);
    if (match) {
      const item = match[1].trim().replace(/\*\*/g, '').trim();
      if (item && item.length > 10 && !isSensitive(item) && !accomplishments.includes(item)) {
        accomplishments.push(item);
      }
    }
  }
  
  return [...new Set(accomplishments)];
}

/**
 * Extract key decisions or learnings
 */
function extractInsights(content) {
  if (!content) return [];
  
  const insights = [];
  
  const decisionSection = content.match(/##\s*🔑\s*Key Learnings[\s\S]*?(?=\n##\s)/i)
    || content.match(/##\s*🔑\s*Key Decisions[\s\S]*?(?=\n##\s)/i)
    || content.match(/##\s*Lessons Learned[\s\S]*?(?=\n##\s)/i)
    || content.match(/###\s*(?:Key Decisions|Lessons Learned|Key Learnings|Insights)[\s\S]*?(?=\n##\s|\n###\s[^KLIS])/i);
  if (decisionSection) {
    const lines = decisionSection[0].split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*[-*]\s+(.+)/);
      if (match) {
        const item = match[1].trim();
        if (item && item.length > 15 && !isSensitive(item)) {
          insights.push(item);
        }
      }
    }
  }
  
  return insights;
}

/**
 * Check if text contains sensitive information
 */
function isSensitive(text) {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
}

/**
 * Sanitize content for public posting
 */
function sanitize(text) {
  return text
    .replace(/api[_-]?key\s*[=:]\s*\S+/gi, '')
    .replace(/api[_-]?secret\s*[=:]\s*\S+/gi, '')
    .replace(/access[_-]?token\s*[=:]\s*\S+/gi, '')
    .replace(/password\s*[=:]\s*\S+/gi, '')
    .replace(/ghp_[a-zA-Z0-9]{36}/gi, '')
    .replace(/sk-[a-zA-Z0-9]{48}/gi, '')
    .replace(/C:\\Users\\\w+/gi, '')
    .replace(/\/home\/\w+/gi, '')
    .trim();
}

/**
 * Detect the project/theme from the content
 */
function detectProject(content) {
  if (/ghostjob|ghost job|jobghost|trust score/i.test(content)) return 'ghostjob';
  if (/openclaw|clawhub/i.test(content)) return 'openclaw';
  return 'project';
}

/**
 * Generate engaging, personality-driven tweets
 * 
 * Key principles:
 * - Share the WHY, not just the WHAT
 * - Opinions and hot takes > checklist updates
 * - Walk people through thought process
 * - Be specific and real, not generic
 * - Ask questions to drive engagement
 */
function generateTweetIdeas(accomplishments, insights, project) {
  const ideas = [];
  
  if (accomplishments.length === 0 && insights.length === 0) {
    return [];
  }

  // ─── GhostJob-specific templates ──────────────────────────────────────
  if (project === 'ghostjob') {
    
    // Hot take / opinion
    const hotTakes = [
      "43% of job postings are ghost jobs and nobody's talking about it. We built something that catches them inline on LinkedIn. Why did it take this long?",
      "Companies post fake jobs to look like they're growing. Job seekers waste hours applying to positions that were never real. This is a $737M problem. We're fixing it.",
      "Every ghost job detector makes you copy-paste job descriptions into their website. We scan directly on LinkedIn. One click, no context switching. That's the product.",
      "The FTC named deceptive job ads a priority enforcement area. California requires employers to disclose hiring intent. Ghost jobs aren't a conspiracy — they're policy now.",
      "27% of LinkedIn listings show ghost job patterns. That's not a glitch — it's the business model. We built GhostJob to give job seekers the transparency they deserve.",
    ];
    
    // Building in public — walk through thought process
    const buildingInPublic = [
      "Here's what we learned building a ghost job detector: local analysis gives instant results but can't check company signals. API gives company intel but adds latency. Solution? Local first, API as enhancement. 8-second timeout means you always get an answer.",
      "We flipped our scoring from 'Ghost Score' (higher = worse) to 'Trust Score' (higher = safer). Sounds obvious now but it took us a week to realize. Branding matters more than you think.",
      "The hardest part of building GhostJob wasn't the detection algorithm — it was injecting a button into LinkedIn's DOM. They change class names constantly. We had to go class-agnostic.",
      "Big decision today: email/password only in the Chrome extension, no Google OAuth. Why? Lovable's managed OAuth can't add custom redirect URLs for chrome.identity. Sometimes the simple path IS the right path.",
    ];
    
    // Milestone announcements with emotion
    const milestones = [
      "GhostJob went from idea to monetized SaaS in 10 days. Chrome extension + Supabase + Stripe + auth + scan limits. Shipping fast isn't about cutting corners — it's about knowing what to cut.",
      "We just hit a milestone: scan → trust score → save to dashboard → auto-login. The full loop works. 10 days ago this was a conversation. Now it's a product.",
    ];
    
    // Insight-driven
    const insightTweets = [
      "Thing about ghost jobs: they're not scams in the traditional sense. They're real companies posting real-looking jobs they have no intention of filling. That's what makes them so hard to detect — and so devastating for job seekers.",
      "Most job scam detectors focus on fake companies. Ghost jobs are different — the company is real, the job listing is real, they're just... not hiring. That distinction changes everything about how you detect them.",
    ];

    // Pick from each category, rotate variety
    ideas.push(...shufflePick(hotTakes, 2));
    ideas.push(...shufflePick(buildingInPublic, 2));
    ideas.push(...shufflePick(milestones, 1));
    ideas.push(...shufflePick(insightTweets, 1));
  }
  
  // ─── Generic templates (fallback) ─────────────────────────────────────
  if (project !== 'ghostjob' || ideas.length < 3) {
    // Thought process tweet
    if (insights.length > 0) {
      const insight = insights[Math.floor(Math.random() * insights.length)];
      ideas.push('Something I keep coming back to: ' + insight.substring(0, 240));
    }
    
    // Building in public with personality
    if (accomplishments.length >= 2) {
      const top = accomplishments.slice(0, 2);
      ideas.push(`Today was one of those days where everything clicked. ${top[0].substring(0, 100)} — and then ${top[1].substring(0, 100)}. Momentum is real.`);
    }
    
    // Specific ship with context
    if (accomplishments.length >= 1) {
      ideas.push(`Just shipped: ${accomplishments[0].substring(0, 200)}. What's your latest ship?`);
    }
  }
  
  // ─── Engagement bait (sparingly) ────────────────────────────────────────
  if (accomplishments.length >= 3) {
    ideas.push(`Shipped ${accomplishments.length} things today. The secret? Stop overthinking, start pushing code. What did you build?`);
  }
  
  return ideas.map(sanitize).filter(t => t.length > 30 && t.length <= 280);
}

/**
 * Shuffle and pick N items from array
 */
function shufflePick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/**
 * Select the best tweet — prefer personality over checklist
 */
function selectBestTweet(ideas) {
  if (ideas.length === 0) return null;
  
  let best = ideas[0];
  let bestScore = 0;
  
  for (const idea of ideas) {
    let score = 0;
    
    // Sweet spot: 100-250 chars (room for engagement but not a wall)
    if (idea.length >= 100 && idea.length <= 250) score += 3;
    else if (idea.length >= 50 && idea.length < 100) score += 1;
    else if (idea.length > 250 && idea.length <= 280) score += 1;
    
    // Complete thought?
    if (!idea.endsWith('...')) score += 2;
    
    // Has a question? (engagement)
    if (/\?/.test(idea)) score += 2;
    
    // Has personality markers (opinions, emotions)
    if (/(!|—|surprising|learned|realized|thing about|secret|why|nobody)/i.test(idea)) score += 2;
    
    // NOT a checklist (no 🛠️ 🔥 ✅ bullet-point style)
    if (!/^🛠️|^🔥|^✅|^📍|^💡/.test(idea)) score += 2;
    
    // Contains specific details/numbers?
    if (/\d+%|\$\d+/.test(idea)) score += 1;
    
    // Has emoji but not overused ones?
    if (/\p{Emoji}/u.test(idea) && !/^🛠️|^🔥|^✅/.test(idea)) score += 1;
    
    if (score > bestScore) {
      bestScore = score;
      best = idea;
    }
  }
  
  return best;
}

/**
 * Post the tweet
 */
function postTweet(message) {
  if (!fs.existsSync(POST_SCRIPT)) {
    console.error(`Post script not found: ${POST_SCRIPT}`);
    return false;
  }
  
  try {
    const tmpFile = path.join(os.tmpdir(), `x-post-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, message, 'utf-8');
    const cmd = `node "${POST_SCRIPT}" --file "${tmpFile}"`;
    const result = execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
    try { fs.unlinkSync(tmpFile); } catch(e) {}
    console.log(result);
    return true;
  } catch (err) {
    console.error('Failed to post:', err.stderr || err.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  
  console.log('📖 Reading daily log...');
  const content = readDailyLog();
  
  if (!content) {
    console.log('⚠️ No daily log found. Nothing to post.');
    process.exit(0);
  }
  
  console.log('🔍 Extracting accomplishments...');
  const accomplishments = extractAccomplishments(content);
  console.log(`Found ${accomplishments.length} accomplishments`);
  
  console.log('💡 Extracting insights...');
  const insights = extractInsights(content);
  console.log(`Found ${insights.length} insights`);
  
  if (accomplishments.length === 0 && insights.length === 0) {
    console.log('⚠️ No content to tweet. Skipping.');
    process.exit(0);
  }
  
  const project = detectProject(content);
  console.log(`🎯 Detected project: ${project}`);
  
  console.log('✍️ Generating tweet ideas...');
  const ideas = generateTweetIdeas(accomplishments, insights, project);
  
  if (ideas.length === 0) {
    console.log('⚠️ Could not generate tweet ideas. Skipping.');
    process.exit(0);
  }
  
  console.log(`\nGenerated ${ideas.length} ideas:`);
  ideas.forEach((idea, i) => {
    console.log(`\n[${i + 1}] (${idea.length} chars):`);
    console.log(idea.substring(0, 120) + (idea.length > 120 ? '...' : ''));
  });
  
  const bestTweet = selectBestTweet(ideas);
  
  if (!bestTweet) {
    console.log('⚠️ Could not select best tweet. Skipping.');
    process.exit(0);
  }
  
  console.log(`\n🎯 Selected tweet (${bestTweet.length}/280 chars):`);
  console.log('---');
  console.log(bestTweet);
  console.log('---');
  
  if (isDryRun) {
    console.log('\n🏃 DRY RUN — Not posting');
    process.exit(0);
  }
  
  // Validate no sensitive content
  if (isSensitive(bestTweet)) {
    console.error('❌ ERROR: Tweet contains potentially sensitive content. Aborting.');
    console.error('Content:', bestTweet);
    process.exit(1);
  }
  
  console.log('\n🐦 Posting to X...');
  const success = postTweet(bestTweet);
  
  if (success) {
    console.log('\n✅ Posted successfully!');
    
    const archivePath = path.join(MEMORY_DIR, 'cron-outputs-archive.md');
    const archiveEntry = `
## ${new Date().toISOString()} — Smart X Poster

### Tweet Posted
\`\`\`
${bestTweet}
\`\`\`

### Source Accomplishments
${accomplishments.map(a => `- ${a.substring(0, 100)}`).join('\n')}

---
`;
    fs.appendFileSync(archivePath, archiveEntry);
    console.log('📝 Archived to cron-outputs-archive.md');
  } else {
    console.error('\n❌ Post failed');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});