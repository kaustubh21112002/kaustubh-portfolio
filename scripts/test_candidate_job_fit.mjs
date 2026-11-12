/**
 * Automated Verification Suite for Phase 8.3: Candidate Job Fit & Explainable Scorer
 */

import { CandidateClaimStore } from '../src/lib/candidateClaimStore.ts';
import { evaluateCandidateJobFit } from '../src/data/candidateJobFitScorer.ts';

console.log('--- RUNNING PHASE 8.3 CANDIDATE JOB FIT & SCORING TESTS ---');

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

// 1. Fixture Claims
const now = new Date().toISOString();
const sampleClaims = [
  {
    claimId: 'claim_sql_1',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.sql',
    claimValue: 'SQL & Relational Databases (PostgreSQL, MySQL)',
    verificationStatus: 'CONFIRMED',
    extractionMethod: 'RESUME_TEXT_PARSER',
    lastModifiedAt: now,
    permittedUse: 'RESUME_CONTENT'
  },
  {
    claimId: 'claim_python_1',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.python',
    claimValue: 'Python (Pandas, NumPy, Scikit-Learn)',
    verificationStatus: 'CONFIRMED',
    extractionMethod: 'RESUME_TEXT_PARSER',
    lastModifiedAt: now,
    permittedUse: 'RESUME_CONTENT'
  },
  {
    claimId: 'claim_unconfirmed_dbt',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.dbt',
    claimValue: 'dbt & Modern Data Stack',
    verificationStatus: 'EXTRACTED', // Unconfirmed draft
    extractionMethod: 'RESUME_TEXT_PARSER',
    lastModifiedAt: now,
    permittedUse: 'INTERNAL_MATCHING_ONLY'
  },
  {
    claimId: 'claim_rejected_snowflake',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.snowflake',
    claimValue: 'Snowflake Architect',
    verificationStatus: 'REJECTED', // Explicitly rejected
    extractionMethod: 'MANUAL_CANDIDATE_ENTRY',
    lastModifiedAt: now,
    permittedUse: 'DO_NOT_USE'
  }
];

const sampleJobDescription = `
We are seeking a Senior Analytics Engineer to design dimensional data models, 
write complex SQL queries across PostgreSQL databases, build automated Python data pipelines,
and maintain data quality and governance standards across our financial reporting systems.
Familiarity with Snowflake or distributed cloud data warehouses is a strong plus.
`;

// [1] Test Basic Fit Calculation
console.log('\n[1] Testing Explainable Match Scoring:');
const fitReport = evaluateCandidateJobFit(sampleJobDescription, sampleClaims, {
  jobTitle: 'Senior Analytics Engineer',
  company: 'FinTech Capital'
});

assert(fitReport.compositeScore > 60, `Composite score is solid (${fitReport.compositeScore}/100)`);
assert(fitReport.totalRequirements > 0, `Detected ${fitReport.totalRequirements} distinct requirements`);
assert(fitReport.matchedEvidenceItems.length >= 2, `Directly matched confirmed claims: ${fitReport.matchedEvidenceItems.length}`);

// [2] Invariant Verification: Unconfirmed Claims Must NOT Match
console.log('\n[2] Invariant: Barring Unconfirmed or Rejected Claims:');
const dbtMatch = fitReport.matchedEvidenceItems.find(m => m.matchedClaimId === 'claim_unconfirmed_dbt');
assert(!dbtMatch, 'Unconfirmed draft claim (EXTRACTED) was barred from matching');

const snowflakeMatch = fitReport.matchedEvidenceItems.find(m => m.matchedClaimId === 'claim_rejected_snowflake');
assert(!snowflakeMatch, 'Rejected claim was barred from matching');

// [3] Gap Classification
console.log('\n[3] Truthful Gap Reporting:');
assert(fitReport.identifiedGaps.length > 0, `Identified ${fitReport.identifiedGaps.length} gaps truthfully`);
const hasCriticalOrTransferable = fitReport.identifiedGaps.every(g => g.gapType === 'CRITICAL_GAP' || g.gapType === 'TRANSFERABLE_GAP');
assert(hasCriticalOrTransferable, 'All gaps are strictly classified as CRITICAL_GAP or TRANSFERABLE_GAP');

// [4] Portfolio Alignment Bridge
console.log('\n[4] Portfolio Deliverables Alignment:');
assert(fitReport.portfolioDeliverablesAlignment.length > 0, 'Aligned with relevant portfolio projects (PhonePe, STRATOS)');

console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
