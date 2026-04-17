const crypto = require('crypto');
const https = require('https');

const CK = 'lPbzngu4mGpGN8T6F7KdVLRt7';
const CS = '8LGbhQnmvQv8InatOmy6QkilQSU1vnXxt89pKBKBttRyFJB8Hn';
const AT = '2032526432069627907-o9beYeq6iYQWByfdwuFiv3RYdk5Yze';
const AS = 'mqFZwEI2HqPy4kQWKFHm5eKmeIAHU5IezrX1NN2AYNOjL';
const tweetId = process.argv[2];

if (!tweetId) { console.error('Usage: node delete-tweet.js <tweetId>'); process.exit(1); }

const url = `https://api.twitter.com/2/tweets/${tweetId}`;
const ts = Math.floor(Date.now() / 1000).toString();
const nonce = crypto.randomBytes(16).toString('hex');

const params = {
  oauth_consumer_key: CK,
  oauth_token: AT,
  oauth_signature_method: 'HMAC-SHA1',
  oauth_timestamp: ts,
  oauth_nonce: nonce,
  oauth_version: '1.0'
};

const sorted = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
const base = `DELETE&${encodeURIComponent(url)}&${encodeURIComponent(sorted)}`;
const sig = crypto.createHmac('sha1', `${encodeURIComponent(CS)}&${encodeURIComponent(AS)}`).update(base).digest('base64');
params.oauth_signature = sig;

const header = 'OAuth ' + Object.keys(params).sort().map(k => `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`).join(', ');

const req = https.request(url, { method: 'DELETE', headers: { Authorization: header } }, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(res.statusCode, d));
});
req.end();