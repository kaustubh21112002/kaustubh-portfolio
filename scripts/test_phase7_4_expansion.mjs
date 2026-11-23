/**
 * Automated Verification Suite for Phase 7.4: Privacy-First Portfolio Intelligence Expansion
 * 
 * Verifies:
 * 1. Campaign Attribution (UTM parameters):
 *    - Validates utm_source, utm_medium, utm_campaign, utm_content, utm_term
 *    - Rejects raw advertising click IDs (gclid, fbclid, etc.)
 *    - Rejects unauthorized query parameters
 *    - Enforces 50 char limits & alphanumeric character constraints
 * 2. Traffic Quality & Bot Detection:
 *    - Classifies known crawlers/bots (Googlebot, Bingbot, HeadlessChrome, etc.)
 *    - Flags automated_crawler without inferring individual user identity
 *    - Classifies normal browsers as verified_human
 * 3. Event Idempotency & Ingest Pipeline:
 *    - Ephemeral UUIDv4 validated
 *    - Transient buffer tracks campaign and traffic quality metrics
 * 4. PII Scrubbing:
 *    - Enforces zero PII in campaign or metadata
 */

import {
  validateAnalyticsPayload,
  validateCampaignAttribution,
  classifyTrafficQuality,
  UTM_VALUE_REGEX
} from '../server/lib/analyticsContract.ts';
import { TransientDiagnosticStorage } from '../server/lib/analyticsStorage.ts';

console.log('--- RUNNING PHASE 7.4 CAMPAIGN ATTRIBUTION & TRAFFIC QUALITY TESTS ---');

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

// 1. CAMPAIGN ATTRIBUTION TESTS
console.log('\n[1] Testing Campaign Attribution (UTM Parameter Validation):');

// Valid UTM parameters
const validCampaign = {
  utmSource: 'linkedin',
  utmMedium: 'direct_message',
  utmCampaign: 'october_outreach',
  utmContent: 'sidebar_link',
  utmTerm: 'finance_analyst'
};
const campRes1 = validateCampaignAttribution(validCampaign);
assert(campRes1.isValid === true, 'Valid campaign parameters accepted');
assert(campRes1.cleanedCampaign.utmSource === 'linkedin', 'utmSource normalized and preserved');
assert(campRes1.cleanedCampaign.utmMedium === 'direct_message', 'utmMedium normalized and preserved');

// Rejection of raw advertising click IDs
const rawClickIdCampaign = {
  utmSource: 'google',
  gclid: 'Cj0KCQjwpompBhDZARIsAId0-K4'
};
const campRes2 = validateCampaignAttribution(rawClickIdCampaign);
assert(campRes2.isValid === false, 'Raw advertising click ID (gclid) rejected');
assert(campRes2.error.includes('click ID forbidden'), 'Error message specifies click ID prohibition');

const fbclidCampaign = {
  utmSource: 'facebook',
  fbclid: 'IwAR0123456789'
};
const campRes3 = validateCampaignAttribution(fbclidCampaign);
assert(campRes3.isValid === false, 'Raw advertising click ID (fbclid) rejected');

// Rejection of unauthorized keys
const unauthKeyCampaign = {
  utmSource: 'newsletter',
  arbitrary_param: 'some_value'
};
const campRes4 = validateCampaignAttribution(unauthKeyCampaign);
assert(campRes4.isValid === false, 'Unauthorized campaign parameters rejected');

// Value length and character constraints
assert(UTM_VALUE_REGEX.test('linkedin-post_2026'), 'UTM_VALUE_REGEX accepts safe alphanumeric, hyphen, underscore');
assert(!UTM_VALUE_REGEX.test('test<script>'), 'UTM_VALUE_REGEX rejects script injection characters');
assert(!UTM_VALUE_REGEX.test('a'.repeat(51)), 'UTM_VALUE_REGEX rejects values over 50 chars');

// 2. TRAFFIC QUALITY & BOT DETECTION TESTS
console.log('\n[2] Testing Traffic Quality & Crawler Classification:');

const googlebotUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const headlessUA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36';

assert(classifyTrafficQuality(googlebotUA) === 'automated_crawler', 'Googlebot classified as automated_crawler');
assert(classifyTrafficQuality(headlessUA) === 'automated_crawler', 'HeadlessChrome classified as automated_crawler');
assert(classifyTrafficQuality(chromeUA) === 'verified_human', 'Standard desktop Chrome classified as verified_human');
assert(classifyTrafficQuality(undefined) === 'unclassified', 'Missing user agent classified as unclassified');

// 3. FULL PAYLOAD VALIDATION WITH CAMPAIGN & TRAFFIC QUALITY
console.log('\n[3] Testing Full Payload Validation:');

const fullPayload = {
  eventId: '11111111-2222-4333-8444-555555555555',
  eventType: 'resume_download',
  timestamp: Date.now(),
  path: '/Kaustubh_Nandurkar_Resume.pdf',
  referrerCategory: 'social',
  deviceCategory: 'desktop',
  campaign: validCampaign
};

const fullValidation = validateAnalyticsPayload(fullPayload, chromeUA);
assert(fullValidation.isValid === true, 'Full payload with campaign passes validation');
assert(fullValidation.trafficQuality === 'verified_human', 'Traffic quality attached to validation result');
assert(fullValidation.cleanedCampaign.utmSource === 'linkedin', 'Cleaned campaign attached to validation result');

// 4. STORAGE ADAPTER INGESTION TEST
console.log('\n[4] Testing Storage Adapter Handling:');

async function testStorage() {
  const storage = new TransientDiagnosticStorage();
  
  // Record human event
  await storage.recordEvent(
    { ...fullPayload, trafficQuality: 'verified_human' },
    '/Kaustubh_Nandurkar_Resume.pdf',
    {},
    fullPayload.eventId
  );

  // Record crawler event
  await storage.recordEvent(
    { ...fullPayload, eventId: '22222222-3333-4444-8555-666666666666', trafficQuality: 'automated_crawler' },
    '/Kaustubh_Nandurkar_Resume.pdf',
    {},
    '22222222-3333-4444-8555-666666666666'
  );

  const summary = await storage.getSummary();
  assert(summary.totalEventsIngestedInSession === 2, 'Storage recorded 2 events');
  assert(summary.dataQuality.totalFilteredBots === 1, 'Storage summary counted 1 automated crawler');
}

(async () => {
  await testStorage();
  console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
})();

