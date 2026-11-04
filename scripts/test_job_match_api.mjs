// Serverless Job Description Match Endpoint Verification Tests
import http from 'http';
import jobMatchHandler from '../api/jobMatch.js';

console.log('--- STARTING JOB MATCH SERVERLESS API TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, val) {
      this.headers[name] = val;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
}

// Test 1: Method check (Reject GET)
const reqGet = { method: 'GET', headers: {} };
const resGet = mockRes();
await jobMatchHandler(reqGet, resGet);
assert(resGet.statusCode === 405 && resGet.body.code === 'METHOD_NOT_ALLOWED', 'Test 1: Reject non-POST with 405');

// Test 2: Origin check (Reject untrusted origin)
const reqUntrusted = {
  method: 'POST',
  headers: { origin: 'https://evil-untrusted-site.com' },
  body: { jobDescription: 'Valid text here for testing' }
};
const resUntrusted = mockRes();
await jobMatchHandler(reqUntrusted, resUntrusted);
assert(resUntrusted.statusCode === 403 && resUntrusted.body.code === 'FORBIDDEN_ORIGIN', 'Test 2: Reject untrusted origin with 403');

// Test 3: Empty description validation
const reqEmpty = {
  method: 'POST',
  headers: { origin: 'https://kaustubh-portfolio-six.vercel.app' },
  body: { jobDescription: '   ' }
};
const resEmpty = mockRes();
await jobMatchHandler(reqEmpty, resEmpty);
assert(resEmpty.statusCode === 400 && resEmpty.body.code === 'EMPTY_DESCRIPTION', 'Test 3: Reject empty description with 400');

// Test 4: Oversized description validation (> 10,000 characters)
const reqOversized = {
  method: 'POST',
  headers: { origin: 'https://kaustubh-portfolio-six.vercel.app' },
  body: { jobDescription: 'a'.repeat(10001) }
};
const resOversized = mockRes();
await jobMatchHandler(reqOversized, resOversized);
assert(resOversized.statusCode === 400 && resOversized.body.code === 'DESCRIPTION_TOO_LONG', 'Test 4: Reject >10,000 char description with 400');

// Test 5: Valid job match evaluation
const reqValid = {
  method: 'POST',
  headers: { origin: 'https://kaustubh-portfolio-six.vercel.app' },
  body: {
    jobTitle: 'Financial Analyst',
    company: 'Capital Investments',
    jobDescription: 'Seeking candidate with strong DCF valuation modeling, WACC analysis, sensitivity stress testing, and Excel skills.'
  }
};
const resValid = mockRes();
await jobMatchHandler(reqValid, resValid);
assert(resValid.statusCode === 200 && resValid.body.success === true, 'Test 5.1: Valid match request returns 200 OK');
assert(resValid.body.report.demonstratedCount >= 3, 'Test 5.2: Report identifies demonstrated skills');
assert(resValid.body.report.topMatchingProjects[0]?.id === 'phonepe-valuation', 'Test 5.3: Top project correctly linked to PhonePe');

console.log(`\n--- SERVERLESS API TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);

if (failed > 0) {
  process.exit(1);
}
