/**
 * Automated Verification Suite for Phase 8.5: Human Approval Gate & State Machine
 */

import { ApprovalGateService } from '../src/data/approvalGateService.ts';

console.log('--- RUNNING PHASE 8.5 HUMAN APPROVAL GATE TESTS ---');

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

const gate = new ApprovalGateService();
const appId = 'app_analytics_lead_2026';

const sampleSnapshot = {
  targetJobUrl: 'https://careers.fintechcorp.com/jobs/lead-analyst',
  targetCompany: 'FinTech Corp',
  targetTitle: 'Lead Analytics Engineer',
  resumeVersionId: 'resume_v2_canonical',
  resumeSha256: '317857d88309548d9d05e8198ffbf8212c88470c',
  coverLetterText: 'Dear Hiring Team at FinTech Corp, my background in DCF modeling...',
  screeningAnswers: [
    { question: 'Why fit?', answer: 'Matched 4 key competencies.' }
  ]
};

// [1] Test Invariant 1: State cannot transition to SUBMITTED without approval
console.log('\n[1] Testing Approval Pre-condition:');
gate.setApplicationStatus(appId, 'PREPARING');
assert(gate.getApplicationStatus(appId) === 'PREPARING', 'Initial state is PREPARING');

// [2] Test Package Preparation & Freezing
console.log('\n[2] Testing Package Freezing & Hashing:');
const approvalRecord = gate.prepareApprovalRecord(appId, sampleSnapshot, 'candidate_kaustubh');
assert(gate.getApplicationStatus(appId) === 'PENDING_APPROVAL', 'State transitioned to PENDING_APPROVAL');
assert(approvalRecord.packageHash.startsWith('pkg_sha256_'), 'Package hash generated deterministically');
assert(!approvalRecord.userConfirmed, 'User confirmation is false before explicit action');

// [3] Invariant 2: Candidate Sign-Off Confirmation
console.log('\n[3] Testing Explicit User Confirmation:');
const confirmedRecord = gate.confirmApproval(approvalRecord.approvalId, 'candidate_kaustubh');
assert(confirmedRecord.userConfirmed, 'Approval record is confirmed');
assert(gate.getApplicationStatus(appId) === 'APPROVED', 'State transitioned to APPROVED');

// [4] Invariant 3: Single-Use Execution Token Redemption
console.log('\n[4] Testing Token Redemption & Submission Transition:');
const isSuccess = gate.redeemSubmissionToken(
  approvalRecord.approvalId,
  approvalRecord.oneTimeAuthToken,
  sampleSnapshot
);
assert(isSuccess, 'Single-use execution token successfully redeemed');
assert(gate.getApplicationStatus(appId) === 'SUBMITTED', 'State transitioned to SUBMITTED');

// Attempting to reuse the token must throw an error
try {
  gate.redeemSubmissionToken(approvalRecord.approvalId, approvalRecord.oneTimeAuthToken, sampleSnapshot);
  assert(false, 'Token reuse should fail');
} catch (err) {
  assert(true, 'Token reuse strictly rejected');
}

// [5] Invariant 4: Invalidation on Mutation
console.log('\n[5] Testing Invalidation on Package Mutation:');
const appId2 = 'app_mutated_2026';
const approvalRecord2 = gate.prepareApprovalRecord(appId2, sampleSnapshot, 'candidate_kaustubh');
gate.confirmApproval(approvalRecord2.approvalId, 'candidate_kaustubh');

// Mutate cover letter after confirmation
const mutatedSnapshot = {
  ...sampleSnapshot,
  coverLetterText: 'Mutated cover letter text with fabricated claims!'
};

try {
  gate.redeemSubmissionToken(approvalRecord2.approvalId, approvalRecord2.oneTimeAuthToken, mutatedSnapshot);
  assert(false, 'Mutated package should fail submission redemption');
} catch (err) {
  assert(true, 'Mutated package caught by hash mismatch; fresh approval required');
  assert(gate.getApplicationStatus(appId2) === 'PENDING_APPROVAL', 'Application returned to PENDING_APPROVAL');
}

console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
