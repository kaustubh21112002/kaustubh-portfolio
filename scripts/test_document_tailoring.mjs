/**
 * Automated Verification Suite for Phase 8.4: Document Tailoring & Answer Synthesizer
 */

import { generateTailoredApplicationPackage } from '../src/data/documentTailoringAssistant.ts';
import { evaluateCandidateJobFit } from '../src/data/candidateJobFitScorer.ts';

console.log('--- RUNNING PHASE 8.4 DOCUMENT TAILORING & SYNTHESIZER TESTS ---');

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
  }
];

const sampleJobDescription = `
We are seeking a Senior Analytics Engineer to design dimensional data models, 
write complex SQL queries across PostgreSQL databases, and build automated Python data pipelines.
`;

const fitReport = evaluateCandidateJobFit(sampleJobDescription, sampleClaims, {
  jobTitle: 'Senior Analytics Engineer',
  company: 'FinTech Capital'
});

// [1] Test Application Package Generation
console.log('\n[1] Testing Document Tailoring Package Assembly:');
const pkg = generateTailoredApplicationPackage(fitReport, sampleClaims, [
  'Why are you interested in this role?',
  'Explain your experience with SQL and data modeling.'
]);

assert(pkg.targetJobTitle === 'Senior Analytics Engineer', 'Target role title correctly bound');
assert(pkg.targetCompany === 'FinTech Capital', 'Target company name correctly bound');
assert(pkg.tailoredBulletPoints.length > 0, `Generated ${pkg.tailoredBulletPoints.length} tailored bullet points`);
assert(pkg.coverLetterDraft.salutation.includes('FinTech Capital'), 'Cover letter salutation addresses company accurately');
assert(pkg.coverLetterDraft.projectEvidenceHighlight.length > 50, 'Cover letter highlights verified project deliverables');

// [2] Test Screening Question Grounding
console.log('\n[2] Testing Screening Question Grounding & Anti-Hallucination:');
assert(pkg.screeningQuestionsAnswers.length === 2, 'Generated answers for both custom screening questions');
for (const qa of pkg.screeningQuestionsAnswers) {
  assert(qa.groundedClaimsUsed.length > 0, `Question "${qa.question}" grounded in specific claim IDs`);
  assert(qa.confidenceScore >= 0.9, `High confidence score (${qa.confidenceScore}) with verified evidence`);
}

// [3] Compliance & Governance Declaration
console.log('\n[3] Testing Compliance Declaration:');
assert(pkg.complianceDeclaration.includes('Zero unverified claims'), 'Compliance declaration explicitly states zero hallucination rule');

console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

