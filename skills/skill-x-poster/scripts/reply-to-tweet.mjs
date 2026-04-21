import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

const CONFIG = {
  consumerKey: 'lPbzngu4mGpGN8T6F7KdVLRt7',
  consumerSecret: '8LGbhQnmvQv8InatOmy6QkilQSU1vnXxt89pKBKBttRyFJB8Hn',
  accessToken: '2032526432069627907-o9beYeq6iYQWByfdwuFiv3RYdk5Yze',
  accessTokenSecret: 'mqFZwEI2HqPy4kQWKFHm5eKmeIAHU5IezrX1NN2AYNOjL',
};

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort().map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
  ).join('&');
  const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(sortedParams)].join('&');
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function generateOAuthHeader(method, url, extraParams = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const params = {
    oauth_consumer_key: CONFIG.consumerKey,
    oauth_token: CONFIG.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
    ...extraParams
  };
  params.oauth_signature = generateOAuthSignature(method, url, params, CONFIG.consumerSecret, CONFIG.accessTokenSecret);
  return 'OAuth ' + Object.keys(params).map(k =>
    `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`
  ).join(', ');
}

function makeRequest(method, path, payload) {
  return new Promise((resolve, reject) => {
    const url = `https://api.twitter.com${path}`;
    const data = payload ? JSON.stringify(payload) : '';
    const options = {
      hostname: 'api.twitter.com',
      path,
      method,
      headers: {
        'Authorization': generateOAuthHeader(method, url),
        'Content-Type': 'application/json',
      }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    const req = https.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: responseData }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  let replyToId = null;
  let text = '';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' || args[i] === '-f') {
      const filePath = args[i + 1];
      i++;
      if (!filePath || !fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }
      text = fs.readFileSync(filePath, 'utf-8').trim();
    } else if (!replyToId) {
      replyToId = args[i];
    } else {
      text += (text ? ' ' : '') + args[i];
    }
  }
  
  if (!replyToId || !text) {
    console.error('Usage: node reply-to-tweet.mjs <tweet_id> [reply text] [--file reply.txt]');
    process.exit(1);
  }
  
  console.log(`Replying to tweet ${replyToId}...`);
  
  const payload = {
    text,
    reply: { in_reply_to_tweet_id: replyToId }
  };
  
  const result = await makeRequest('POST', '/2/tweets', payload);
  const parsed = JSON.parse(result.data);
  
  if (result.status === 201 || result.status === 200) {
    console.log('✅ Reply posted!');
    console.log(`🔗 https://x.com/rumihutai/status/${parsed.data?.id}`);
  } else {
    console.error(`❌ Failed (${result.status}):`, result.data);
  }
}

main();