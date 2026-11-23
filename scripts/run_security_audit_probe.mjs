import https from 'node:https';

function sendLoginRequest(index) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ passphrase: 'audit-pen-test-' + index });
    const options = {
      hostname: 'kaustubh-portfolio-six.vercel.app',
      path: '/api/analytics/dashboard/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://kaustubh-portfolio-six.vercel.app',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        resolve({
          attempt: index,
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runAudit() {
  console.log('=== SECURITY PERIMETER AUDIT PROBE ===');
  const results = [];
  for (let i = 1; i <= 6; i++) {
    const res = await sendLoginRequest(i);
    results.push(res);
    console.log(`Request #${i} -> Status: ${res.status} | Remaining: ${res.headers['x-ratelimit-remaining']} | Reset: ${res.headers['x-ratelimit-reset']}`);
  }

  console.log('\n=== SECURITY HEADERS VALIDATION ===');
  const h = results[0].headers;
  console.log('Strict-Transport-Security:', h['strict-transport-security']);
  console.log('X-Content-Type-Options:   ', h['x-content-type-options']);
  console.log('X-Frame-Options:          ', h['x-frame-options']);
  console.log('Referrer-Policy:          ', h['referrer-policy']);
  console.log('Permissions-Policy:       ', h['permissions-policy']);

  console.log('\n=== 6TH BRUTE-FORCE REJECTION AUDIT ===');
  const sixth = results[5];
  console.log('Status Code:             ', sixth.status);
  console.log('X-RateLimit-Limit:       ', sixth.headers['x-ratelimit-limit']);
  console.log('X-RateLimit-Remaining:   ', sixth.headers['x-ratelimit-remaining']);
  console.log('X-RateLimit-Reset:       ', sixth.headers['x-ratelimit-reset']);
  console.log('Retry-After:             ', sixth.headers['retry-after']);
  console.log('Payload:                 ', sixth.body);
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});

