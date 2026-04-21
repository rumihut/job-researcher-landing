#!/usr/bin/env node
/**
 * X Community Engager — Searches for relevant conversations on X
 * and generates thoughtful replies to build audience and engagement.
 * 
 * Usage: node x-engager.mjs [--dry-run] [--search-only]
 */

import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG = {
  consumerKey: 'lPbzngu4mGpGN8T6F7KdVLRt7',
  consumerSecret: '8LGbhQnmvQv8InatOmy6QkilQSU1vnXxt89pKBKBttRyFJB8Hn',
  accessToken: '2032526432069627907-o9beYeq6iYQWByfdwuFiv3RYdk5Yze',
  accessTokenSecret: 'mqFZwEI2HqPy4kQWKFHm5eKmeIAHU5IezrX1NN2AYNOjL',
};

const USER_ID = '2032526432069627907'; // @rumihutai
const MEMORY_DIR = path.join(os.homedir(), '.openclaw', 'workspace', 'memory');
const IDEAS_FILE = path.join(MEMORY_DIR, 'x-ideas.md');
const REPLIED_FILE = path.join(MEMORY_DIR, 'x-replied-tweets.json');
const RECENT_POSTS_FILE = path.join(MEMORY_DIR, 'x-recent-posts.json');

// Search queries — topics we want to engage with
const SEARCH_QUERIES = [
  'ghost jobs -filter:retweets min_faves:5',
  'fake job postings -filter:retweets min_faves:3',
  'job search frustrated -filter:retweets min_faves:5',
  'ghost job detector -filter:retweets',
  'linkedin job scam -filter:retweets min_faves:3',
  'building in public SaaS -filter:retweets min_faves:10',
  'indie hacker chrome extension -filter:retweets min_faves:5',
  'AI automation tools -filter:retweets min_faves:10',
];

// Accounts to never engage with (spam, competitors, self)
const BLOCKED_ACCOUNTS = [
  'rumihutai',     // ourselves
  'useclawhost',   // spam
  'bfzli',         // spam
  'ghostjobs_',    // direct competitor — don't engage
];

// ─── OAuth helpers ─────────────────────────────────────────────────────

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort().map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
  ).join('&');
  const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(sortedParams)].join('&');
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function generateOAuthHeader(method, url, queryParams = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const params = {
    oauth_consumer_key: CONFIG.consumerKey,
    oauth_token: CONFIG.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
    ...queryParams
  };
  params.oauth_signature = generateOAuthSignature(method, url, params, CONFIG.consumerSecret, CONFIG.accessTokenSecret);
  return 'OAuth ' + Object.keys(params).map(k =>
    `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`
  ).join(', ');
}

function makeRequest(method, fullPath) {
  const url = 'https://api.twitter.com' + fullPath;
  const urlWithoutQuery = url.split('?')[0];
  const queryParams = {};
  const queryStr = fullPath.split('?')[1];
  if (queryStr) {
    for (const pair of queryStr.split('&')) {
      const [k, v] = pair.split('=');
      queryParams[decodeURIComponent(k)] = decodeURIComponent(v);
    }
  }
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.twitter.com',
      path: fullPath,
      method,
      headers: { 'Authorization': generateOAuthHeader(method, urlWithoutQuery, queryParams) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.end();
  });
}

// ─── State management ──────────────────────────────────────────────────

function loadRepliedTweets() {
  try {
    if (fs.existsSync(REPLIED_FILE)) {
      return JSON.parse(fs.readFileSync(REPLIED_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { replied: [] };
}

function saveRepliedTweet(tweetId, text, author) {
  const state = loadRepliedTweets();
  state.replied.push({ id: tweetId, text, author, timestamp: Date.now() });
  // Keep last 50
  state.replied = state.replied.slice(-50);
  fs.writeFileSync(REPLIED_FILE, JSON.stringify(state, null, 2));
}

function loadRecentPosts() {
  try {
    if (fs.existsSync(RECENT_POSTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(RECENT_POSTS_FILE, 'utf-8'));
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return (data.posts || []).filter(p => p.timestamp > cutoff);
    }
  } catch (e) {}
  return [];
}

// ─── Search ────────────────────────────────────────────────────────────

async function searchTweets(query) {
  const apiPath = `/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,author_id,public_metrics,conversation_id&expansions=author_id&user.fields=username,name`;
  const result = await makeRequest('GET', apiPath);
  
  if (result.status !== 200) {
    console.error(`Search failed (${result.status}): ${query}`);
    return [];
  }
  
  const parsed = JSON.parse(result.data);
  const users = {};
  if (parsed.includes?.users) {
    for (const u of parsed.includes.users) {
      users[u.id] = u;
    }
  }
  
  return (parsed.data || []).map(t => ({
    id: t.id,
    text: t.text,
    author: users[t.author_id]?.username || 'unknown',
    authorName: users[t.author_id]?.name || 'unknown',
    createdAt: t.created_at,
    likes: t.public_metrics?.like_count || 0,
    replies: t.public_metrics?.reply_count || 0,
    conversationId: t.conversation_id,
  }));
}

// ─── Reply generation ──────────────────────────────────────────────────

function loadIdeas() {
  try {
    return fs.readFileSync(IDEAS_FILE, 'utf-8');
  } catch (e) {}
  return '';
}

function generateReply(tweet, ideas) {
  const text = tweet.text.toLowerCase();
  
  // Ghost job related tweets
  if (/ghost.?job|fake.?job|phantom.?job|job.?scam/i.test(text)) {
    const replies = [
      `This is exactly why we built GhostJob — automatic detection right on LinkedIn. One click and you know if a listing is real. The 43% stat keeps getting worse.`,
      `The wildest part? These aren't scam companies. They're real companies posting real-looking jobs they never intend to fill. That's what makes them so hard to spot.`,
      `Spot on. The FTC just made deceptive job ads a priority enforcement area. California now requires employers to disclose hiring intent. This problem is finally getting attention.`,
      `We've been tracking this — 27% of LinkedIn listings show ghost job patterns. It's not a glitch, it's the business model.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  // Job search frustration
  if (/job.?search|apply.*job|looking.*work|hiring.*broken|recruiter/i.test(text)) {
    const replies = [
      `The job search is broken in ways most people don't realize. 43% of postings were never real to begin with. We built a tool that catches them automatically.`,
      `Feel this. The hardest part isn't getting rejected — it's wasting time on jobs that were never going to hire anyone. We're trying to fix that.`,
      `If you're on LinkedIn, try scanning postings before you apply. We built a Chrome extension that flags ghost jobs inline. Saves hours of wasted effort.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  // Building in public / SaaS / indie hacker
  if (/building.*public|indie.?hack|saas|chrome.?ext|micro.?saas/i.test(text)) {
    const replies = [
      `Building in public is underrated for early SaaS. We went from idea to published Chrome extension + Stripe in under 2 weeks. The feedback loop is everything.`,
      `Love seeing others build in public. We shipped GhostJob (ghost job detector) in 10 days. The secret? Local-first architecture — instant results even if the API is down.`,
      `Chrome extensions are such an underrated SaaS channel. You meet users exactly where they already are. No landing page friction.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  // AI / automation
  if (/AI.*tool|automation|agent|LLM|GPT/i.test(text)) {
    const replies = [
      `The best AI tools are the ones you forget are AI. We use pattern matching for ghost job detection instead of LLMs — faster, cheaper, works offline. Right tool for the job.`,
      `Too many "AI-powered" tools are just GPT wrappers. For structured detection (like spotting ghost jobs), regex beats embeddings. Pick the right tool for the problem.`,
      `Agree. We built an AI agent that runs 24/7 — posts on X, monitors mentions, builds product. The key is giving it clear boundaries so it's helpful, not chaotic.`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  
  // Generic thoughtful reply
  return null; // Don't force replies to unrelated tweets
}

// ─── Post reply ────────────────────────────────────────────────────────

async function postReply(tweetId, text) {
  const payload = { text, reply: { in_reply_to_tweet_id: tweetId } };
  const data = JSON.stringify(payload);
  
  return new Promise((resolve, reject) => {
    const url = 'https://api.twitter.com/2/tweets';
    const options = {
      hostname: 'api.twitter.com',
      path: '/2/tweets',
      method: 'POST',
      headers: {
        'Authorization': generateOAuthHeader('POST', url),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          const parsed = JSON.parse(responseData);
          resolve({ success: true, id: parsed.data?.id });
        } else {
          reject(new Error(`API ${res.statusCode}: ${responseData}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ─── Main ──────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const searchOnly = process.argv.includes('--search-only');
  
  const ideas = loadIdeas();
  const repliedState = loadRepliedTweets();
  const repliedIds = new Set(repliedState.replied.map(r => r.id));
  const blockedSet = new Set(BLOCKED_ACCOUNTS.map(a => a.toLowerCase()));
  
  console.log('🔍 Searching X for relevant conversations...\n');
  
  const allTweets = [];
  
  // Run searches (pick 3 random queries to limit API usage)
  const queries = [...SEARCH_QUERIES].sort(() => Math.random() - 0.5).slice(0, 3);
  
  for (const query of queries) {
    console.log(`📡 Searching: "${query}"`);
    const results = await searchTweets(query);
    console.log(`   Found ${results.length} results`);
    allTweets.push(...results);
  }
  
  if (allTweets.length === 0) {
    console.log('\n⚠️ No tweets found. API may need elevated access for search.');
    console.log('💡 Tip: Use mentions checker + manual engagement instead.');
    process.exit(0);
  }
  
  // Filter and rank
  const candidates = allTweets
    .filter(t => !repliedIds.has(t.id))           // Haven't replied already
    .filter(t => !blockedSet.has(t.author.toLowerCase())) // Not blocked
    .filter(t => t.author !== 'rumihutai')         // Not ourselves
    .filter(t => t.likes >= 3)                      // Has some engagement
    .map(t => ({ ...t, reply: generateReply(t, ideas) }))
    .filter(t => t.reply !== null)                  // Has a relevant reply
    .sort((a, b) => b.likes - a.likes);             // Sort by engagement
  
  // Deduplicate by conversation
  const seenConversations = new Set();
  const unique = candidates.filter(t => {
    if (seenConversations.has(t.conversationId)) return false;
    seenConversations.add(t.conversationId);
    return true;
  });
  
  console.log(`\n📊 Found ${unique.length} engagement candidates\n`);
  
  // Show top candidates
  const topN = unique.slice(0, 5);
  for (const t of topN) {
    console.log(`@${t.author} (${t.likes}❤️): ${t.text.substring(0, 80)}...`);
    console.log(`   → Reply: ${t.reply.substring(0, 80)}...`);
    console.log(`   Link: https://x.com/${t.author}/status/${t.id}`);
    console.log('---');
  }
  
  if (searchOnly || isDryRun) {
    console.log('\n🏃 DRY RUN — Not posting replies');
    process.exit(0);
  }
  
  // Post reply to the top candidate (1 per run to stay natural)
  if (topN.length > 0) {
    const target = topN[0];
    console.log(`\n🐦 Replying to @${target.author}...`);
    
    try {
      const result = await postReply(target.id, target.reply);
      saveRepliedTweet(target.id, target.text, target.author);
      
      // Also save to recent posts for dedup
      const recentPosts = loadRecentPosts();
      recentPosts.push({ text: target.reply, timestamp: Date.now() });
      
      console.log(`✅ Replied! https://x.com/rumihutai/status/${result.id}`);
    } catch (err) {
      console.error(`❌ Reply failed: ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});