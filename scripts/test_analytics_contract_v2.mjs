/**
 * Automated Verification Suite for Phase 7.2.2 - Analytics Contract & Path Normalization
 * 
 * Verifies:
 * 1. Path regex: accepts '/', approved resume PDF, '#contact', single segments.
 * 2. Rejects '/.', '/..', '//evil.com', percent-encoded paths, scripts.
 * 3. Enforces project ID rules for project_view vs other events.
 * 4. Enforces event metadata allowlist.
 */

import { validateAnalyticsPayload, PATH_VALIDATION_REGEX } from '../server/lib/analyticsContract.ts';
import {
  validateCollectionOrigin,
  CANONICAL_PRODUCTION_ORIGIN,
  ALLOWED_DEV_ORIGINS
} from '../server/lib/originValidator.ts';
import statsHandler from '../api/analytics/stats.ts';

console.log('--- RUNNING ANALYTICS CONTRACT & PATH NORMALIZATION TESTS ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// 1. Path Regex Matrix
const validPaths = [
  '/',
  '/Kaustubh_Nandurkar_Resume.pdf',
  '#contact',
  '/projects',
  '/about-us',
  '/test.min.js'
];

for (const p of validPaths) {
  assert(PATH_VALIDATION_REGEX.test(p), `PATH_VALIDATION_REGEX accepts: "${p}"`);
}

const invalidPaths = [
  '/.',
  '/..',
  '/...',
  '//evil.com',
  '///evil.com',
  '/%20test',
  '/<script>',
  '',
  '/foo/bar',
  '/test.'
];

for (const p of invalidPaths) {
  assert(!PATH_VALIDATION_REGEX.test(p), `PATH_VALIDATION_REGEX rejects: "${p}"`);
}

// 2. Full Payload Validation Tests
const now = Date.now();

// 2.1 Valid page_view
const validPageView = {
  eventType: 'page_view',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(validateAnalyticsPayload(validPageView).isValid, 'Valid page_view accepted');

// 2.2 Valid resume_download
const validResumeDl = {
  eventType: 'resume_download',
  timestamp: now,
  path: '/Kaustubh_Nandurkar_Resume.pdf',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(validateAnalyticsPayload(validResumeDl).isValid, 'Valid resume_download accepted with PDF path');

// 2.3 Valid contact_click with #contact
const validContactClick = {
  eventType: 'contact_click',
  timestamp: now,
  path: '#contact',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(validateAnalyticsPayload(validContactClick).isValid, 'Valid contact_click accepted with #contact anchor');

// 2.4 Query String Stripping
const queryPathEvent = {
  eventType: 'project_view',
  projectId: 'phonepe-valuation',
  timestamp: now,
  path: '/?project=phonepe-valuation&view=case-study',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
const resQuery = validateAnalyticsPayload(queryPathEvent);
assert(resQuery.isValid && resQuery.normalizedPath === '/', 'Query string stripped to "/" and accepted');

// 2.5 Percent encoding rejection
const percentEncodedEvent = {
  eventType: 'page_view',
  timestamp: now,
  path: '/%20resume',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(!validateAnalyticsPayload(percentEncodedEvent).isValid, 'Percent-encoded path rejected');

// 2.6 Project ID enforcement
const projectViewNoId = {
  eventType: 'project_view',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(!validateAnalyticsPayload(projectViewNoId).isValid, 'project_view rejected when projectId is missing');

const projectViewBadId = {
  eventType: 'project_view',
  projectId: 'invalid-secret-project',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(!validateAnalyticsPayload(projectViewBadId).isValid, 'project_view rejected when projectId is unknown');

const pageViewWithId = {
  eventType: 'page_view',
  projectId: 'phonepe-valuation',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
assert(!validateAnalyticsPayload(pageViewWithId).isValid, 'page_view rejected when projectId is attached');

// 2.7 Metadata allowlist
const validJobMatch = {
  eventType: 'job_match_use',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop',
  metadata: {
    roleLength: 24,
    hasCompany: true
  }
};
assert(validateAnalyticsPayload(validJobMatch).isValid, 'job_match_use with valid roleLength and hasCompany accepted');

const invalidJobMatchMeta = {
  eventType: 'job_match_use',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop',
  metadata: {
    roleLength: 24,
    hasCompany: true,
    pastedText: 'Senior Engineer at Google'
  }
};
assert(!validateAnalyticsPayload(invalidJobMatchMeta).isValid, 'job_match_use with unauthorized metadata key rejected');

const pageViewWithMeta = {
  eventType: 'page_view',
  timestamp: now,
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop',
  metadata: {
    title: 'Kaustubh Portfolio'
  }
};
assert(!validateAnalyticsPayload(pageViewWithMeta).isValid, 'page_view with metadata rejected');

// 3. Collection Origin Hardening Tests (Phase 7.2.5)
console.log('\n--- TESTING COLLECTION ORIGIN VALIDATION ---');

// Mock VERCEL_URL for exact authorized preview tests
process.env.VERCEL_URL = 'portfolio-git-feature-preview.vercel.app';

// 3.1 Accepted Origins
assert(validateCollectionOrigin('https://kaustubh-portfolio-six.vercel.app', undefined).isAuthorized, 'Canonical Production origin accepted');
assert(validateCollectionOrigin('https://portfolio-git-feature-preview.vercel.app', undefined).isAuthorized, 'Exact authorized VERCEL_URL preview origin accepted');
assert(validateCollectionOrigin('http://localhost:5173', undefined).isAuthorized, 'Localhost :5173 accepted');
assert(validateCollectionOrigin('http://localhost:3000', undefined).isAuthorized, 'Localhost :3000 accepted');
assert(validateCollectionOrigin('http://127.0.0.1:5173', undefined).isAuthorized, '127.0.0.1 :5173 accepted');
assert(validateCollectionOrigin('http://127.0.0.1:3000', undefined).isAuthorized, '127.0.0.1 :3000 accepted');

// 3.2 Referer Fallback (When Origin is Absent)
assert(validateCollectionOrigin(undefined, 'https://kaustubh-portfolio-six.vercel.app/projects').isAuthorized, 'Valid Referer accepted when Origin is absent');
assert(validateCollectionOrigin(undefined, 'http://localhost:5173/#contact').isAuthorized, 'Valid localhost Referer accepted when Origin is absent');

// 3.3 Rejected Origins (Strict Perimeter Security)
assert(!validateCollectionOrigin('https://malicious.vercel.app', undefined).isAuthorized, 'Arbitrary malicious.vercel.app rejected');
assert(!validateCollectionOrigin('https://phishing-site.vercel.app', undefined).isAuthorized, 'Arbitrary phishing-site.vercel.app rejected');
assert(!validateCollectionOrigin('https://evil.com', undefined).isAuthorized, 'Arbitrary third-party domain rejected');
assert(!validateCollectionOrigin('http://kaustubh-portfolio-six.vercel.app', undefined).isAuthorized, 'Insecure HTTP scheme for production rejected');
assert(!validateCollectionOrigin('https://kaustubh-portfolio-six.vercel.app:8080', undefined).isAuthorized, 'Unexpected port on production origin rejected');
assert(!validateCollectionOrigin('not-a-valid-url', undefined).isAuthorized, 'Malformed origin string rejected');
assert(!validateCollectionOrigin('', undefined).isAuthorized, 'Empty origin string rejected');

// 3.4 Invalid Origin Precedence: Valid Referer cannot override an invalid Origin
assert(!validateCollectionOrigin('https://malicious.vercel.app', 'https://kaustubh-portfolio-six.vercel.app').isAuthorized, 'Invalid Origin combined with valid Referer is rejected');

// 3.5 Both Headers Absent: Rejected by default
assert(!validateCollectionOrigin(undefined, undefined).isAuthorized, 'Both Origin and Referer absent is rejected by default');

// 4. Legacy Statistics Endpoint Deprecation Test (Phase 7.2.5)
console.log('\n--- TESTING DEPRECATED STATS ENDPOINT CONTRACT ---');
let legacyStatus = 0;
let legacyBody = null;
const mockReq = { method: 'GET', headers: {} };
const mockRes = {
  setHeader: () => mockRes,
  status: (code) => { legacyStatus = code; return mockRes; },
  json: (data) => { legacyBody = data; return mockRes; },
  end: () => {}
};

await statsHandler(mockReq, mockRes);
assert(legacyStatus === 410, 'Deprecated /api/analytics/stats returns HTTP 410 Gone');
assert(legacyBody && legacyBody.success === false, 'Deprecated stats returns success: false');
assert(legacyBody && legacyBody.code === 'ENDPOINT_DEPRECATED', 'Deprecated stats returns code: ENDPOINT_DEPRECATED');
assert(legacyBody && legacyBody.data === undefined, 'Deprecated stats returns no data payload');
assert(legacyBody && legacyBody.metrics === undefined, 'Deprecated stats returns no metrics payload');

console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
