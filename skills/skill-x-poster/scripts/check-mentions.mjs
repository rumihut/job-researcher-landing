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
const STATE_FILE = path.join(os.homedir(), '.openclaw', 'workspace', 'memory', 'x-mentions-state.json');

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
  return new Promise((resolve, reject) => {
    // Parse query params for OAuth signature
    const urlWithoutQuery = url.split('?')[0];
    const queryParams = {};
    const queryStr = fullPath.split('?')[1];
    if (queryStr) {
      for (const pair of queryStr.split('&')) {
        const [k, v] = pair.split('=');
        queryParams[decodeURIComponent(k)] = decodeURIComponent(v);
      }
    }
    const options = {
      hostname: 'api.twitter.com',
      path: fullPath,
      method,
      headers: {
        'Authorization': generateOAuthHeader(method, urlWithoutQuery, queryParams),
      }
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

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { lastSeenMentionId: null, lastCheck: null };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function checkMentions() {
  const state = loadState();
  const baseUrl = 'https://api.twitter.com/2/users/' + USER_ID + '/mentions';
  let apiPath = '/2/users/' + USER_ID + '/mentions?max_results=10&tweet.fields=created_at,in_reply_to_user_id,author_id,conversation_id&expansions=author_id&user.fields=username,name';
  
  if (state.lastSeenMentionId) {
    apiPath += '&since_id=' + state.lastSeenMentionId;
  }
  
  console.log('🔍 Checking for new mentions...');
  const result = await makeRequest('GET', apiPath);
  
  if (result.status !== 200) {
    console.error('❌ API error:', result.status, result.data);
    return [];
  }
  
  const parsed = JSON.parse(result.data);
  const tweets = parsed.data || [];
  const users = {};
  if (parsed.includes?.users) {
    for (const u of parsed.includes.users) {
      users[u.id] = u;
    }
  }
  
  // Update state with newest mention ID
  if (tweets.length > 0) {
    state.lastSeenMentionId = tweets[0].id;
  }
  state.lastCheck = new Date().toISOString();
  saveState(state);
  
  // Enrich with author info
  const enriched = tweets.map(t => ({
    id: t.id,
    text: t.text,
    author: users[t.author_id] ? `@${users[t.author_id].username} (${users[t.author_id].name})` : t.author_id,
    authorUsername: users[t.author_id]?.username || 'unknown',
    createdAt: t.created_at,
    inReplyTo: t.in_reply_to_user_id,
    conversationId: t.conversation_id,
  }));
  
  return enriched;
}

async function main() {
  const mentions = await checkMentions();
  
  if (mentions.length === 0) {
    console.log('✅ No new mentions');
    process.exit(0);
  }
  
  console.log(`\n📬 Found ${mentions.length} new mention(s):\n`);
  for (const m of mentions) {
    console.log(`From: ${m.author}`);
    console.log(`Text: ${m.text}`);
    console.log(`Date: ${m.createdAt}`);
    console.log(`Link: https://x.com/${m.authorUsername}/status/${m.id}`);
    console.log('---');
  }
}

main();