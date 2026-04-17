import crypto from 'crypto';
import https from 'https';
import fs from 'fs';

// X API Credentials (from TOOLS.md)
const CONFIG = {
  consumerKey: 'lPbzngu4mGpGN8T6F7KdVLRt7',
  consumerSecret: '8LGbhQnmvQv8InatOmy6QkilQSU1vnXxt89pKBKBttRyFJB8Hn',
  accessToken: '2032526432069627907-o9beYeq6iYQWByfdwuFiv3RYdk5Yze',
  accessTokenSecret: 'mqFZwEI2HqPy4kQWKFHm5eKmeIAHU5IezrX1NN2AYNOjL',
};

// OAuth 1.0a signature generation
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort().map(k => {
    return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
  }).join('&');
  
  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');
  
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
  
  const signature = generateOAuthSignature(
    method, 
    url, 
    params, 
    CONFIG.consumerSecret, 
    CONFIG.accessTokenSecret
  );
  
  params.oauth_signature = signature;
  
  const authHeader = 'OAuth ' + Object.keys(params).map(k => {
    return `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`;
  }).join(', ');
  
  return authHeader;
}

function postTweet(text) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.twitter.com/2/tweets';
    
    // Build payload
    const payload = { text: text };
    const data = JSON.stringify(payload);
    
    const authHeader = generateOAuthHeader('POST', url);
    
    const options = {
      hostname: 'api.twitter.com',
      path: '/2/tweets',
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 201 || res.statusCode === 200) {
            resolve({
              success: true,
              id: parsed.data?.id,
              text: parsed.data?.text,
              url: `https://x.com/rumihutai/status/${parsed.data?.id}`
            });
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${responseData}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${responseData}`));
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

function deleteTweet(tweetId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.twitter.com/2/tweets/${tweetId}`;
    
    const authHeader = generateOAuthHeader('DELETE', url);
    
    const options = {
      hostname: 'api.twitter.com',
      path: `/2/tweets/${tweetId}`,
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        // 200 = deleted successfully
        if (res.statusCode === 200) {
          resolve({ success: true, id: tweetId });
        } else {
          reject(new Error(`Delete failed ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    req.end();
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  let message = '';
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--message' || args[i] === '-m') {
      message = args[i + 1];
      i++;
    } else if (args[i] === '--file' || args[i] === '-f') {
      const filePath = args[i + 1];
      i++;
      if (!filePath || !fs.existsSync(filePath)) {
        console.error(`❌ ERROR: File not found: ${filePath}`);
        process.exit(1);
      }
      message = fs.readFileSync(filePath, 'utf-8').trim();
    } else if (args[i] === '--delete' || args[i] === '-d') {
      // Handle delete
      const tweetId = args[i + 1];
      console.log(`🗑️ Deleting tweet ${tweetId}...`);
      
      if (!tweetId) {
        console.error('❌ ERROR: No tweet ID provided for deletion');
        process.exit(1);
      }
      
      try {
        const result = await deleteTweet(tweetId);
        console.log('✅ Deleted successfully!');
        console.log(`🆔 Tweet ID: ${result.id}`);
        process.exit(0);
      } catch (error) {
        console.error(`❌ Delete failed: ${error.message}`);
        process.exit(1);
      }
    }
  }
  
  // Require explicit message — no defaults to prevent accidental posts
  if (!message) {
    console.error('❌ ERROR: No --message provided. Use: node post-to-x.js --message "Your tweet"');
    console.error('   No default messages allowed — prevents accidental/template posts.');
    process.exit(1);
  }
  
  // Validate message isn't placeholder/template text
  const placeholderPatterns = [
    /thursday afternoon/i,
    /how it works/i,
    /new week,? new build/i,
    /teach tuesday/i,
    /winsday/i,
    /feature friday/i,
    /strategy sunday/i,
    /weekend build/i,
    /^\s*$/  // empty or whitespace only
  ];
  
  const isPlaceholder = placeholderPatterns.some(pattern => pattern.test(message));
  if (isPlaceholder) {
    console.error('❌ ERROR: Message appears to be placeholder/template text.');
    console.error(`   Content: "${message}"`);
    console.error('   Generate real content before posting.');
    process.exit(1);
  }
  
  // Replace escaped newlines
  message = message.replace(/\\n/g, '\n');
  
  // Validate
  if (message.length > 280) {
    console.error(`❌ Tweet too long: ${message.length}/280 characters`);
    process.exit(1);
  }
  
  console.log('🐦 Posting to @rumihutai...');
  console.log(`Content: ${message.substring(0, 50)}...`);
  console.log(`Length: ${message.length} chars\n`);
  
  try {
    const result = await postTweet(message);
    console.log('✅ Posted successfully!');
    console.log(`🔗 ${result.url}`);
    console.log(`🆔 ${result.id}`);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    process.exit(1);
  }
}

main();
