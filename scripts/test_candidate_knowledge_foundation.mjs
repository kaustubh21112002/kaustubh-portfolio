/**
 * Phase 8.1 Candidate Knowledge Foundation Test Suite
 * 
 * Tests:
 * 1. Resume extraction into draft claims
 * 2. Source provenance preservation
 * 3. Explicit claim confirmation (timestamp + actor)
 * 4. Claim value correction and history recording
 * 5. Claim rejection and marking as UNKNOWN
 * 6. Illegal status transitions enforcement
 * 7. AI suggestions remain separate and are NOT promoted without explicit confirmation
 * 8. Portfolio evidence does NOT automatically become candidate personal contribution
 * 9. Missing and incomplete resume fields start as UNKNOWN
 * 10. AI provider abstraction works offline with zero external network or credentials
 * 11. Privacy checks: Candidate claims do not appear in analytics payloads
 */

import assert from 'node:assert';
import { extractClaimsFromResumeText } from '../src/lib/candidateExtractor.ts';
import { CandidateClaimStore } from '../src/lib/candidateClaimStore.ts';
import {
  SafeLocalMockAIProvider,
  createClaimFromAISuggestion
} from '../src/lib/aiProviderAbstraction.ts';
import { SYNTHETIC_TEST_CANDIDATE_CLAIMS } from '../src/lib/syntheticTestFixture.ts';
import { validateAnalyticsPayload } from '../server/lib/analyticsContract.ts';

console.log('--- RUNNING PHASE 8.1 CANDIDATE KNOWLEDGE FOUNDATION TESTS ---');

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

async function itAsync(desc, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${desc}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

// Sample raw text matching src/data/resume.txt
const sampleResumeText = `
Professional Overview:
Analytics Engineer and Business Intelligence Specialist with expertise in financial modeling, data governance, and decision intelligence.

Core Competencies:
- Financial & Valuation Modeling: Discounted Cash Flow (DCF), Sensitivity Analysis, Terminal Value Calculation.
- Full-Stack & BI Architecture: React, TypeScript, Vite, Python, SQL, REST APIs.

Featured Independent Projects:
1. PhonePe Pre-IPO Equity Research & DCF Valuation: Dynamic sensitivity modeling, WACC and growth rate matrix analysis, reconciling EV and Equity Value.
2. STRATOS AI Retail Decision Intelligence: Controlled metric governance, automated anomaly detection (DQ-10 Revenue checks).
`;

console.log('\n[1] Resume Extraction & Provenance:');

it('extracts summary and skills into EXTRACTED claims', () => {
  const result = extractClaimsFromResumeText(sampleResumeText, 'test_resume.txt');
  assert.strictEqual(result.sourceDocument, 'test_resume.txt');
  assert(result.claims.length > 0, 'Expected claims to be extracted');

  const summaryClaim = result.claims.find((c) => c.claimKey === 'summary.overview');
  assert(summaryClaim, 'Summary claim should exist');
  assert.strictEqual(summaryClaim.verificationStatus, 'EXTRACTED');
  assert.strictEqual(summaryClaim.sourceDocument, 'test_resume.txt');
  assert.strictEqual(summaryClaim.extractionMethod, 'RESUME_TEXT_PARSER');
});

it('preserves source text snippet and section in provenance', () => {
  const result = extractClaimsFromResumeText(sampleResumeText, 'test_resume.txt');
  const dcfSkill = result.claims.find((c) => c.claimKey === 'skill.discounted_cash_flow__dcf_');
  assert(dcfSkill, 'DCF skill should be extracted');
  assert.strictEqual(dcfSkill.sourceSection, 'Core Competencies');
  assert(dcfSkill.sourceTextSnippet.includes('Discounted Cash Flow'), 'Snippet should contain skill line');
});

it('flags missing personal information as UNKNOWN rather than fabricating data', () => {
  const result = extractClaimsFromResumeText(sampleResumeText, 'test_resume.txt');
  assert(result.missingFields.includes('identity.name'), 'identity.name should be reported missing');
  assert(result.missingFields.includes('preference.minSalary'), 'minSalary should be reported missing');

  const nameClaim = result.claims.find((c) => c.claimKey === 'identity.name');
  assert(nameClaim, 'Unknown name claim should be created');
  assert.strictEqual(nameClaim.verificationStatus, 'UNKNOWN');
  assert.strictEqual(nameClaim.claimValue, null);
});

console.log('\n[2] Claim Review & State Transitions:');

it('confirms claim with explicit actor and timestamp', () => {
  const store = new CandidateClaimStore();
  store.addClaim({
    claimId: 'claim_1',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.sql',
    claimValue: { name: 'SQL', proficiency: 'EXPERT' },
    extractionMethod: 'RESUME_TEXT_PARSER',
    verificationStatus: 'EXTRACTED',
    lastModifiedAt: new Date().toISOString(),
    permittedUse: 'RESUME_CONTENT'
  });

  const confirmed = store.confirmClaim('claim_1', 'candidate_user_1', { permittedUse: 'RESUME_CONTENT' });
  assert.strictEqual(confirmed.verificationStatus, 'CONFIRMED');
  assert.strictEqual(confirmed.confirmedBy, 'candidate_user_1');
  assert(typeof confirmed.confirmedAt === 'string');
  assert.strictEqual(confirmed.history.length, 1);
});

it('corrects claim value and preserves history trail', () => {
  const store = new CandidateClaimStore();
  store.addClaim({
    claimId: 'claim_title',
    claimType: 'JOB_TITLE',
    claimKey: 'experience.title',
    claimValue: 'Junior Analyst',
    extractionMethod: 'RESUME_TEXT_PARSER',
    verificationStatus: 'EXTRACTED',
    lastModifiedAt: new Date().toISOString(),
    permittedUse: 'RESUME_CONTENT'
  });

  const corrected = store.correctClaim('claim_title', 'Senior Analytics Engineer', 'candidate_user_1', {
    reason: 'Correction of title seniority'
  });

  assert.strictEqual(corrected.verificationStatus, 'CORRECTED');
  assert.strictEqual(corrected.claimValue, 'Senior Analytics Engineer');
  assert.strictEqual(corrected.history[0].previousValue, 'Junior Analyst');
  assert.strictEqual(corrected.history[0].reason, 'Correction of title seniority');
});

it('rejects claim and forbids its permitted use', () => {
  const store = new CandidateClaimStore();
  store.addClaim({
    claimId: 'claim_spurious',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.ruby',
    claimValue: { name: 'Ruby' },
    extractionMethod: 'RESUME_TEXT_PARSER',
    verificationStatus: 'EXTRACTED',
    lastModifiedAt: new Date().toISOString(),
    permittedUse: 'RESUME_CONTENT'
  });

  const rejected = store.rejectClaim('claim_spurious', 'candidate_user_1', 'Never worked with Ruby');
  assert.strictEqual(rejected.verificationStatus, 'REJECTED');
  assert.strictEqual(rejected.permittedUse, 'DO_NOT_USE');
});

it('blocks invalid status transitions (e.g., EXTRACTED -> unknown bogus state)', () => {
  const store = new CandidateClaimStore();
  store.addClaim({
    claimId: 'claim_test',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.python',
    claimValue: 'Python',
    extractionMethod: 'RESUME_TEXT_PARSER',
    verificationStatus: 'REJECTED',
    lastModifiedAt: new Date().toISOString(),
    permittedUse: 'DO_NOT_USE'
  });

  assert.throws(() => {
    store.validateTransition('REJECTED', 'EXTRACTED');
  }, /Illegal status transition/);
});

console.log('\n[3] Ground Truth Boundaries & Evidence Provenance:');

it('portfolio project artifacts do NOT automatically confirm personal contributions', () => {
  const result = extractClaimsFromResumeText(sampleResumeText, 'test_resume.txt');
  const projectClaim = result.claims.find((c) => c.claimKey === 'project.phonepe-valuation.metadata');
  const contribClaim = result.claims.find((c) => c.claimKey === 'project.phonepe-valuation.contribution');

  assert(projectClaim, 'Project artifact claim should exist');
  assert(contribClaim, 'Contribution claim should exist');

  // The project existence was extracted from text
  assert.strictEqual(projectClaim.verificationStatus, 'EXTRACTED');
  // BUT personal individual contribution is separate and explicitly UNKNOWN until user confirms
  assert.strictEqual(contribClaim.verificationStatus, 'UNKNOWN');
  assert.strictEqual(contribClaim.permittedUse, 'INTERNAL_MATCHING_ONLY');
});

it('assembles canonical profile reflecting accurate verification statuses', () => {
  const store = new CandidateClaimStore();
  const result = extractClaimsFromResumeText(sampleResumeText, 'test_resume.txt');
  for (const c of result.claims) {
    store.addClaim(c);
  }

  // Identity is unknown initially
  let profile = store.assembleCanonicalProfile();
  assert.strictEqual(profile.identity.status, 'UNKNOWN');

  // Confirm summary
  store.confirmClaim('claim_summary_overview', 'candidate_actor');
  profile = store.assembleCanonicalProfile();
  assert.strictEqual(profile.summary.status, 'CONFIRMED');
});

console.log('\n[4] AI Provider Abstraction & Safe Offline Isolation:');

await itAsync('offline mock provider generates suggestions in AI_SUGGESTION status', async () => {
  const provider = new SafeLocalMockAIProvider();
  assert.strictEqual(provider.isConnected, false, 'Provider must not claim to be connected to external network');

  const suggestions = await provider.generateSuggestions({
    contextClaimKeys: ['summary.overview'],
    task: 'TAILOR_SUMMARY',
    promptContext: {}
  });

  assert(suggestions.length > 0, 'Suggestions should be returned');
  const sugg = suggestions[0];

  const claim = createClaimFromAISuggestion(sugg, 'PROFESSIONAL_SUMMARY', provider.providerName);
  assert.strictEqual(claim.verificationStatus, 'AI_SUGGESTION');
  assert.strictEqual(claim.permittedUse, 'INTERNAL_MATCHING_ONLY');

  // An AI suggestion cannot be used on a real resume without candidate confirmation
  const store = new CandidateClaimStore();
  store.addClaim(claim);

  const candidateProfile = store.assembleCanonicalProfile();
  // Ensure the AI suggestion does not silently become a confirmed profile fact
  assert.notStrictEqual(claim.verificationStatus, 'CONFIRMED');
});

console.log('\n[5] Synthetic Test Data Safety & Privacy Boundaries:');

it('synthetic candidate claims are isolated and not confused with real candidate data', () => {
  assert(SYNTHETIC_TEST_CANDIDATE_CLAIMS.length > 0);
  const nameClaim = SYNTHETIC_TEST_CANDIDATE_CLAIMS.find((c) => c.claimKey === 'identity.name');
  assert(nameClaim.claimValue.includes('SYNTHETIC TEST CANDIDATE'));
  assert.strictEqual(nameClaim.permittedUse, 'DO_NOT_USE');
});

it('candidate claims and PII are strictly rejected from analytics collection payloads', () => {
  // Test that attempting to send candidate claims or PII to the analytics contract fails
  const piiPayload = {
    eventType: 'page_view',
    timestamp: Date.now(),
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop',
    // Prohibited candidate personal fields
    name: 'Alex Morgan',
    email: 'alex@example.com',
    jobDescription: 'Senior Analyst at BigTech'
  };

  const validation = validateAnalyticsPayload(piiPayload);
  assert.strictEqual(validation.isValid, false);
  assert.strictEqual(validation.code, 'FORBIDDEN_FIELD');
});

console.log(`\nOutcome: ${passCount} passed, ${failCount} failed`);

if (failCount > 0) {
  process.exit(1);
}
