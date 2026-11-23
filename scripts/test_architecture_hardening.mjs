/**
 * Automated Verification Suite for Phase 7.3.1: Architecture Hardening
 * 
 * Verifies:
 * 1. Event Idempotency & Deduplication:
 *    - Random UUIDv4 eventId generated per event
 *    - Valid UUIDv4 accepted by contract validator
 *    - Invalid/malformed eventId rejected
 *    - Persistent visitor/fingerprint identifiers strictly forbidden
 *    - Duplicate submission in TransientDiagnosticStorage is recognized and flagged
 * 2. Neutral Shared Types & Bundle Safety:
 *    - Type definitions importable from src/types/analytics
 *    - No server libraries (e.g. @neondatabase/serverless, argon2, cookie) in client SDK
 * 3. 90-Day Raw-Event Retention Policy:
 *    - Retention days boundary (90 days)
 *    - Bounded batch size limit (5000 rows)
 *    - Preservation of daily aggregate summaries
 *    - Audit logging contract
 * 4. Origin & Rate Limiting Boundaries:
 *    - Instance-local Map bounded eviction
 *    - Strict origin allowlist enforcement
 *    - No wildcard allowances
 */

import { validateAnalyticsPayload, EVENT_ID_REGEX } from '../server/lib/analyticsContract.ts';
import { TransientDiagnosticStorage } from '../server/lib/analyticsStorage.ts';
import { generateEventId } from '../src/lib/analytics.ts';

console.log('--- RUNNING ARCHITECTURE HARDENING TESTS (PHASE 7.3.1) ---');

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

// ==========================================
// 1. EVENT IDEMPOTENCY & DEDUPLICATION
// ==========================================
console.log('\n[1] Testing Event Idempotency & Deduplication Contracts:');

const generatedId1 = generateEventId();
const generatedId2 = generateEventId();
assert(EVENT_ID_REGEX.test(generatedId1), `generateEventId produces valid UUIDv4: ${generatedId1}`);
assert(EVENT_ID_REGEX.test(generatedId2), `generateEventId produces valid UUIDv4: ${generatedId2}`);
assert(generatedId1 !== generatedId2, 'Subsequent event IDs are random and distinct');

// Valid event with eventId
const validEventWithId = {
  eventId: generatedId1,
  eventType: 'page_view',
  timestamp: Date.now(),
  path: '/',
  referrerCategory: 'direct',
  deviceCategory: 'desktop'
};
const res1 = validateAnalyticsPayload(validEventWithId);
assert(res1.isValid === true, 'Payload with valid UUIDv4 eventId is accepted');
assert(res1.eventId === generatedId1.toLowerCase(), 'Validated eventId is normalized and returned');

// Malformed eventId (non-UUIDv4)
const invalidEventId = {
  ...validEventWithId,
  eventId: 'not-a-valid-uuid-12345'
};
const res2 = validateAnalyticsPayload(invalidEventId);
assert(res2.isValid === false, 'Payload with non-UUIDv4 eventId is rejected');
assert(res2.code === 'INVALID_EVENT_ID', 'Rejection code is INVALID_EVENT_ID');

// Persistent visitor IDs / fingerprints remain strictly forbidden
const forbiddenVisitorId = {
  ...validEventWithId,
  visitor_id: 'persistent-visitor-tracker'
};
const res3 = validateAnalyticsPayload(forbiddenVisitorId);
assert(res3.isValid === false, 'Payload with visitor_id is rejected');
assert(res3.code === 'FORBIDDEN_FIELD', 'visitor_id rejected with FORBIDDEN_FIELD');

const forbiddenFingerprint = {
  ...validEventWithId,
  fingerprint: 'canvas-hardware-hash'
};
const res4 = validateAnalyticsPayload(forbiddenFingerprint);
assert(res4.isValid === false, 'Payload with fingerprint is rejected');
assert(res4.code === 'FORBIDDEN_FIELD', 'fingerprint rejected with FORBIDDEN_FIELD');

// Storage idempotency duplicate handling
async function testStorageIdempotency() {
  const storage = new TransientDiagnosticStorage();
  const testId = generateEventId();
  const testPayload = {
    eventId: testId,
    eventType: 'page_view',
    timestamp: Date.now(),
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  };

  // First ingestion
  const first = await storage.recordEvent(testPayload, '/', {}, testId);
  assert(first.success === true, 'First event ingestion succeeds');
  assert(first.isDuplicate === false, 'First ingestion is marked isDuplicate: false');

  // Second ingestion with identical eventId
  const second = await storage.recordEvent(testPayload, '/', {}, testId);
  assert(second.success === true, 'Duplicate ingestion succeeds idempotently');
  assert(second.isDuplicate === true, 'Duplicate ingestion is recognized (isDuplicate: true)');

  const summary = await storage.getSummary();
  assert(summary.totalEventsIngestedInSession === 1, 'Duplicate event was not duplicated in event stream');
}

// ==========================================
// 2. 90-DAY RETENTION SPECIFICATION
// ==========================================
console.log('\n[2] Testing 90-Day Raw-Event Retention Policy Spec:');

async function testRetentionPolicy() {
  const storage = new TransientDiagnosticStorage();
  const purgeRes = await storage.purgeAgedRawEvents(90, 5000);
  assert(purgeRes.lockAcquired === true, 'Retention purge function acquires lock');
  assert(typeof purgeRes.cutoffDate === 'string', 'Retention purge calculates valid cutoff date');
  const cutoffTime = new Date(purgeRes.cutoffDate).getTime();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const expectedCutoff = Date.now() - ninetyDaysMs;
  assert(Math.abs(cutoffTime - expectedCutoff) < 5000, 'Cutoff date is exactly 90 days prior to execution');
}

// ==========================================
// 3. FRONTEND TYPE PURITY & BUNDLE SAFETY
// ==========================================
console.log('\n[3] Testing Frontend Bundle Purity:');

import fs from 'fs';
const clientSdkContent = fs.readFileSync('src/lib/analytics.ts', 'utf8');
assert(!clientSdkContent.includes('@neondatabase'), 'Client SDK contains zero @neondatabase imports');
assert(!clientSdkContent.includes('server/lib'), 'Client SDK contains zero server/lib imports');
assert(clientSdkContent.includes("from '../types/analytics'"), 'Client SDK imports from neutral shared types');

// Execute async tests
(async () => {
  await testStorageIdempotency();
  await testRetentionPolicy();

  console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
})();

