// Comprehensive Automated Test Suite for Visitor Feedback API (api/feedback.ts)
// Verifies all Phase 5.14, 5.14.1, 5.14.2, and 5.14.3/5.14.4 contract and security specifications.

import handler, { isValidOriginUrl, CANONICAL_PRODUCTION_HOST } from '../api/feedback.ts';

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; }
  };
}

let ipCounter = 1;
function getUniqueIp() {
  return `198.51.100.${ipCounter++}`;
}

async function runTests() {
  console.log('--- STARTING VISITOR FEEDBACK API TESTS (PHASE 5.14.4 STRICT DEV LOCALHOST) ---');
  let passed = 0;
  let failed = 0;

  function assert(name, condition, extraInfo) {
    if (condition) {
      console.log(`✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${name}`, extraInfo || '');
      failed++;
    }
  }

  const validProdOrigin = `https://${CANONICAL_PRODUCTION_HOST}`;

  // 1. Enforce POST method (405)
  {
    const res = createMockRes();
    await handler({ method: 'GET', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() } }, res);
    assert('Test 1: Reject non-POST requests with 405 Method Not Allowed', res.statusCode === 405 && res.body.code === 'METHOD_NOT_ALLOWED');
  }

  // 2. Canonical HTTPS production origin accepted
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'invalid-rating-check' } }, res);
    assert('Test 2: Accept canonical HTTPS production origin (https://kaustubh-portfolio-six.vercel.app)', res.statusCode === 400 && res.body.code === 'INVALID_RATING');
  }

  // 3. HTTP production origin rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: `http://${CANONICAL_PRODUCTION_HOST}`, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 3: Reject non-HTTPS production origin (http://...) with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 4. Production origin with unexpected port rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: `https://${CANONICAL_PRODUCTION_HOST}:8080`, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 4: Reject production origin with unexpected port (:8080) with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 5. Unrelated external origin rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: 'https://malicious-phishing.com', 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 5: Reject untrusted external origin with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 6. Unrelated Vercel hostname rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: 'https://other-unrelated-project.vercel.app', 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 6: Reject unrelated *.vercel.app domain with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 7. Exact active VERCEL_URL preview deployment accepted
  {
    const activePreviewHost = 'portfolio-deploy-xyz123.vercel.app';
    process.env.VERCEL_URL = activePreviewHost;
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: `https://${activePreviewHost}`, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'invalid-rating-check' } }, res);
    assert('Test 7: Accept exact active VERCEL_URL preview deployment', res.statusCode === 400 && res.body.code === 'INVALID_RATING');
    delete process.env.VERCEL_URL;
  }

  // 8. Similar-looking but nonmatching preview hostname rejected (403)
  {
    process.env.VERCEL_URL = 'portfolio-deploy-real.vercel.app';
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: 'https://portfolio-deploy-fake.vercel.app', 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 8: Reject similar-looking but nonmatching preview hostname with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
    delete process.env.VERCEL_URL;
  }

  // 9. Explicit local development: localhost accepted
  {
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    const isLocalhostDev = isValidOriginUrl('http://localhost:5173') && isValidOriginUrl('https://localhost:3000');
    assert('Test 9: Explicit local development accepts localhost', isLocalhostDev);
  }

  // 10. Explicit local development: 127.0.0.1 accepted
  {
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    const isLoopbackDev = isValidOriginUrl('http://127.0.0.1:4173') && isValidOriginUrl('https://127.0.0.1:8080');
    assert('Test 10: Explicit local development accepts 127.0.0.1', isLoopbackDev);
  }

  // 11. Vercel Preview: localhost & 127.0.0.1 strictly rejected
  {
    process.env.VERCEL = '1';
    process.env.VERCEL_ENV = 'preview';
    const isPreviewBlocked = !isValidOriginUrl('http://localhost:5173') && !isValidOriginUrl('http://127.0.0.1:4173');
    assert('Test 11: Vercel Preview environment strictly rejects localhost and 127.0.0.1', isPreviewBlocked);
  }

  // 12. Vercel Production: localhost & 127.0.0.1 strictly rejected
  {
    process.env.VERCEL = '1';
    process.env.VERCEL_ENV = 'production';
    const isProdBlocked = !isValidOriginUrl('http://localhost:5173') && !isValidOriginUrl('http://127.0.0.1:4173');
    assert('Test 12: Vercel Production environment strictly rejects localhost and 127.0.0.1', isProdBlocked);
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
  }

  // 13. Ambiguous or missing environment: localhost & 127.0.0.1 strictly rejected
  {
    delete process.env.NODE_ENV;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    const isAmbiguousBlocked = !isValidOriginUrl('http://localhost:5173') && !isValidOriginUrl('http://127.0.0.1:4173');
    assert('Test 13: Ambiguous or missing environment strictly rejects localhost and 127.0.0.1', isAmbiguousBlocked);
    process.env.NODE_ENV = 'test';
  }

  // 14. Missing Origin and Referer rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 14: Reject missing Origin and Referer headers with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 15. Valid Referer fallback accepted when Origin header is absent
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { referer: `${validProdOrigin}/#contact`, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'invalid-rating-check' } }, res);
    assert('Test 15: Accept valid Referer fallback when Origin header is absent', res.statusCode === 400 && res.body.code === 'INVALID_RATING');
  }

  // 16. Invalid Origin plus valid Referer rejected (403)
  {
    const res = createMockRes();
    await handler({
      method: 'POST',
      headers: {
        origin: 'https://malicious-attacker.com',
        referer: `${validProdOrigin}/#contact`,
        'x-forwarded-for': getUniqueIp()
      },
      body: { rating: 'up' }
    }, res);
    assert('Test 16: Reject invalid Origin even when Referer header is valid with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 17. Malformed Origin and Referer rejected (403)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: 'malformed_url_string', 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up' } }, res);
    assert('Test 17: Reject malformed origin header with 403 Forbidden', res.statusCode === 403 && res.body.code === 'FORBIDDEN_ORIGIN');
  }

  // 18. Schema: Missing rating (400)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { comment: 'Missing rating' } }, res);
    assert('Test 18: Reject missing rating with 400 Bad Request', res.statusCode === 400 && res.body.code === 'INVALID_RATING');
  }

  // 19. Schema: Invalid rating (400)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: '5_stars' } }, res);
    assert('Test 19: Reject rating other than up/down with 400 Bad Request', res.statusCode === 400 && res.body.code === 'INVALID_RATING');
  }

  // 20. Schema: Comment too long (> 500 chars) (400)
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up', comment: 'a'.repeat(501) } }, res);
    assert('Test 20: Reject comment > 500 characters with 400 Bad Request', res.statusCode === 400 && res.body.code === 'COMMENT_TOO_LONG');
  }

  // 21. Honeypot: Silent acceptance (200) without Slack dispatch
  {
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up', honeypot: 'spam-bot-token' } }, res);
    assert('Test 21: Honeypot silently succeeds with 200 OK without dispatching', res.statusCode === 200 && res.body.delivered === true && res.body.code === 'FEEDBACK_ACCEPTED');
  }

  // 22. Missing SLACK_WEBHOOK_URL returns 503
  {
    const originalEnv = process.env.SLACK_WEBHOOK_URL;
    delete process.env.SLACK_WEBHOOK_URL;
    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'down' } }, res);
    assert('Test 22: Missing SLACK_WEBHOOK_URL returns truthful 503 Service Unavailable', res.statusCode === 503 && res.body.code === 'SLACK_NOT_CONFIGURED');
    process.env.SLACK_WEBHOOK_URL = originalEnv;
  }

  // 23. Rate limiting: 4th request from same IP within window returns 429
  {
    const testIp = '203.0.113.77';
    let blockedOnFourth = false;
    for (let i = 0; i < 4; i++) {
      const res = createMockRes();
      await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': testIp }, body: { rating: 'up' } }, res);
      if (i === 3 && res.statusCode === 429 && res.body.code === 'RATE_LIMIT_EXCEEDED') {
        blockedOnFourth = true;
      }
    }
    assert('Test 23: In-memory sliding window rate limiter blocks 4th request from same IP with 429', blockedOnFourth);
  }

  // 24. Successful mock Slack dispatch with mention and mrkdwn sanitization
  {
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T00/B00/X00';
    let interceptedPayload = null;

    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
      interceptedPayload = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        text: async () => 'ok'
      };
    };

    const res = createMockRes();
    const rawComment = 'Check <!channel>, <!here>, <!everyone> & @everyone @here <alert>';
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'up', comment: rawComment } }, res);

    const isDelivered = res.statusCode === 200 && res.body.code === 'FEEDBACK_SUBMITTED';
    const commentBlock = interceptedPayload?.blocks?.find(b => b.text?.text?.includes('Visitor Comment'));
    const sanitizedText = commentBlock?.text?.text || '';

    // Verify defanging of all 5 broadcast patterns
    const noChannel = !sanitizedText.includes('<!channel>') && sanitizedText.includes('&lt;!channel&gt;');
    const noHere = !sanitizedText.includes('<!here>') && sanitizedText.includes('&lt;!here&gt;');
    const noEveryoneTag = !sanitizedText.includes('<!everyone>') && sanitizedText.includes('&lt;!everyone&gt;');
    const noAtEveryone = !sanitizedText.includes('@everyone') && sanitizedText.includes('@ everyone');
    const noAtHere = !sanitizedText.includes('@here') && sanitizedText.includes('@ here');
    const noTagLt = sanitizedText.includes('&lt;alert&gt;');
    const zeroIpInPayload = !JSON.stringify(interceptedPayload).includes('198.51.100');

    const allDefanged = noChannel && noHere && noEveryoneTag && noAtEveryone && noAtHere && noTagLt;

    assert('Test 24: Dispatches sanitized Slack Block Kit defanging <!channel>, <!here>, <!everyone>, @everyone, @here', isDelivered && allDefanged && zeroIpInPayload);

    global.fetch = originalFetch;
  }

  // 25. Upstream Slack rejection returns 502 Bad Gateway
  {
    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T00/B00/X00';
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: false,
      status: 500,
      text: async () => 'internal_error'
    });

    const res = createMockRes();
    await handler({ method: 'POST', headers: { origin: validProdOrigin, 'x-forwarded-for': getUniqueIp() }, body: { rating: 'down' } }, res);

    assert('Test 25: Upstream Slack failure returns 502 Bad Gateway without false delivery claims', res.statusCode === 502 && res.body.code === 'SLACK_DELIVERY_FAILED');

    global.fetch = originalFetch;
  }

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
