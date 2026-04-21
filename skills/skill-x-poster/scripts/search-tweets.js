const https = require('https');
const crypto = require('crypto');

const CONFIG = {
  consumerKey: 'lPbzngu4mGpGN8T6F7KdVLRt7',
  consumerSecret: '8LGbhQnmvQv8InatOmy6QkilQSU1vnXxt89pKBKBttRyFJB8Hn',
  accessToken: '2032526432069627907-o9beYeq6iYQWByfdwuFiv3RYdk5Yze',
  accessTokenSecret: 'mqFZwEI2HqPy4kQWKFHm5eKmeIAHU5IezrX1NN2AYNOjL',
};

function genSig(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort().map(k =>
    `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`
  ).join('&');
  const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(sortedParams)].join('&');
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function genHeader(method, url, queryParams = {}) {
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
  params.oauth_signature = genSig(method, url, params, CONFIG.consumerSecret, CONFIG.accessTokenSecret);
  return 'OAuth ' + Object.keys(params).map(k =>
    `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`
  ).join(', ');
}

// Search for our recent tweets
const query = 'from:rumihutai';
const apiPath = `/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,text`;
const url = `https://api.twitter.com/2/tweets/search/recent`;

const options = {
  hostname: 'api.twitter.com',
  path: apiPath,
  method: 'GET',
  headers: { 'Authorization': genHeader('GET', url) }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.data) {
        for (const t of parsed.data) {
          console.log(`${t.id} | ${t.created_at} | ${t.text.substring(0, 100)}`);
        }
      } else {
        console.log('Response:', data.substring(0, 500));
      }
    } catch(e) {
      console.log('Raw:', data.substring(0, 500));
    }
  });
});
req.on('error', err => console.error('Error:', err.message));
req.end();