// Test suite for Vercel Serverless Function api/contact.ts
// Tests:
// 1. Method verification (reject non-POST)
// 2. Input validation (missing name, invalid email, short/long message)
// 3. Honeypot detection (bot trap returns 200 without dispatching)
// 4. Missing Slack webhook environment variable handling (truthful 503 unconfigured)
// 5. Rate limiting behavior (rejection after threshold)
// 6. Mock Slack Webhook delivery (success and failure pathways)

import handler from '../api/contact.ts';

async function runTests() {
  console.log('--- STARTING SERVERLESS CONTACT ENDPOINT TESTS ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  function createMockReqRes(options = {}) {
    const req = {
      method: options.method || 'POST',
      body: options.body,
      headers: options.headers || {},
      socket: { remoteAddress: options.ip || `192.168.1.${Math.floor(Math.random() * 200) + 10}` }
    };

    let statusCode = 200;
    let responseData = null;
    let headers = {};

    const res = {
      setHeader: (key, val) => {
        headers[key] = val;
      },
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseData = data;
        return res;
      },
      _getStatusCode: () => statusCode,
      _getData: () => responseData,
      _getHeaders: () => headers
    };

    return { req, res };
  }

  // TEST 1: Method rejection (GET, PUT, DELETE)
  {
    const { req, res } = createMockReqRes({ method: 'GET' });
    await handler(req, res);
    assert(
      res._getStatusCode() === 405 && res._getData()?.code === 'METHOD_NOT_ALLOWED',
      'Test 1: Reject non-POST requests with 405 Method Not Allowed',
      `Got status ${res._getStatusCode()}`
    );
  }

  // TEST 2: Rejection of malformed / empty payload
  {
    const { req, res } = createMockReqRes({ body: {} });
    await handler(req, res);
    assert(
      res._getStatusCode() === 400 && res._getData()?.code === 'INVALID_NAME',
      'Test 2: Rejection of payload with missing name',
      `Got status ${res._getStatusCode()}, code: ${res._getData()?.code}`
    );
  }

  // TEST 3: Invalid email rejection
  {
    const { req, res } = createMockReqRes({
      body: {
        name: 'Jane Doe',
        email: 'invalid-email-address',
        subject: 'Inquiry',
        message: 'This is a test message that is long enough.'
      }
    });
    await handler(req, res);
    assert(
      res._getStatusCode() === 400 && res._getData()?.code === 'INVALID_EMAIL',
      'Test 3: Rejection of malformed email address',
      `Got status ${res._getStatusCode()}, code: ${res._getData()?.code}`
    );
  }

  // TEST 4: Message length bounds (too short < 10 chars)
  {
    const { req, res } = createMockReqRes({
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Inquiry',
        message: 'Hi!'
      }
    });
    await handler(req, res);
    assert(
      res._getStatusCode() === 400 && res._getData()?.code === 'INVALID_MESSAGE',
      'Test 4: Rejection of message that is too short (< 10 chars)',
      `Got status ${res._getStatusCode()}, code: ${res._getData()?.code}`
    );
  }

  // TEST 5: Honeypot trap (bot fills hidden field)
  {
    const { req, res } = createMockReqRes({
      body: {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        subject: 'Crypto Promo',
        message: 'Buy our tokens now at discount prices!',
        honeypot: 'http://spam-link.com'
      }
    });
    await handler(req, res);
    assert(
      res._getStatusCode() === 200 && res._getData()?.delivered === true && res._getData()?.code === 'DISPATCH_ACCEPTED',
      'Test 5: Honeypot silently succeeds with 200 OK without dispatching',
      `Got status ${res._getStatusCode()}, code: ${res._getData()?.code}`
    );
  }

  // TEST 6: Missing SLACK_WEBHOOK_URL returns truthful 503 unconfigured
  {
    delete process.env.SLACK_WEBHOOK_URL;
    const { req, res } = createMockReqRes({
      body: {
        name: 'Recruiter One',
        email: 'recruiter@company.com',
        subject: 'Senior Analytics Role',
        message: 'We are very impressed by your PhonePe valuation case study and would love to speak.'
      }
    });
    await handler(req, res);
    assert(
      res._getStatusCode() === 503 && res._getData()?.code === 'SLACK_NOT_CONFIGURED' && res._getData()?.delivered === false,
      'Test 6: Missing SLACK_WEBHOOK_URL returns truthful 503 (unconfigured)',
      `Got status ${res._getStatusCode()}, code: ${res._getData()?.code}`
    );
  }

  // TEST 7: Rate limiting per IP
  {
    const testIp = '10.0.0.99';
    let blocked = false;
    for (let i = 0; i < 6; i++) {
      const { req, res } = createMockReqRes({
        ip: testIp,
        body: {
          name: 'Fast Submitter',
          email: 'fast@example.com',
          subject: 'Burst Test',
          message: 'Repeated burst submission attempt testing rate limits.'
        }
      });
      await handler(req, res);
      if (res._getStatusCode() === 429) {
        blocked = true;
        break;
      }
    }
    assert(
      blocked,
      'Test 7: Rate limiter blocks 6th rapid submission from same IP with 429',
      `Rate limit block triggered as expected`
    );
  }

  // TEST 8: Mock Slack delivery when webhook is provided
  {
    // Mock global fetch
    const originalFetch = global.fetch;
    let fetchCalledWith = null;

    global.fetch = async (url, options) => {
      fetchCalledWith = { url, options, parsedBody: JSON.parse(options.body) };
      return {
        ok: true,
        status: 200,
        text: async () => 'ok'
      };
    };

    process.env.SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T000/B000/XXXX';

    const { req, res } = createMockReqRes({
      body: {
        name: 'Alex Rivera',
        email: 'alex.rivera@techcorp.com',
        subject: 'Valuation & Strategy Role',
        message: 'We are looking for a business analyst with strong DCF modeling skills.'
      }
    });

    await handler(req, res);

    const is200 = res._getStatusCode() === 200;
    const isSuccess = res._getData()?.success === true;
    const isDelivered = res._getData()?.delivered === true;
    const correctSlackPayload = fetchCalledWith && fetchCalledWith.parsedBody?.blocks?.length > 0;

    assert(
      is200 && isSuccess && isDelivered && correctSlackPayload,
      'Test 8: Valid submission with mock Slack webhook returns 200 with formatted mrkdwn blocks',
      `Status: ${res._getStatusCode()}, Data: ${JSON.stringify(res._getData())}`
    );

    // TEST 9: Slack error response (HTTP 500 from Slack)
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        text: async () => 'internal_error'
      };
    };

    const { req: req9, res: res9 } = createMockReqRes({
      body: {
        name: 'Alex Rivera',
        email: 'alex.rivera@techcorp.com',
        subject: 'Follow up',
        message: 'Checking in regarding my previous inquiry on your portfolio.'
      }
    });

    await handler(req9, res9);
    assert(
      res9._getStatusCode() === 502 && res9._getData()?.code === 'SLACK_DELIVERY_FAILED' && res9._getData()?.delivered === false,
      'Test 9: Upstream Slack failure returns 502 and does NOT claim delivery succeeded',
      `Status: ${res9._getStatusCode()}, Code: ${res9._getData()?.code}`
    );

    // Restore fetch and clear env
    global.fetch = originalFetch;
    delete process.env.SLACK_WEBHOOK_URL;
  }

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
