/**
 * Automated Verification Suite for Phase 8.6: Interview Intelligence & Career Analytics
 */

import {
  generateInterviewIntelligenceBriefing,
  computeCareerFunnelAnalytics
} from '../src/data/interviewIntelligenceEngine.ts';
import { evaluateCandidateJobFit } from '../src/data/candidateJobFitScorer.ts';

console.log('--- RUNNING PHASE 8.6 INTERVIEW INTELLIGENCE & CAREER ANALYTICS TESTS ---');

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

const mockFitReport = {
  jobTitle: 'Senior Analytics Engineer',
  company: 'Razorpay FinTech',
  timestamp: new Date().toISOString(),
  totalRequirements: 5,
  confirmedClaimsEvaluated: 3,
  matchedRequirementsCount: 3,
  partialRequirementsCount: 1,
  unmetRequirementsCount: 1,
  compositeScore: 85,
  scoringExplanation: 'Verified match against core data competencies.',
  matchedEvidenceItems: [],
  identifiedGaps: [],
  portfolioDeliverablesAlignment: [
    { projectId: 'phonepe-valuation', projectTitle: 'PhonePe Valuation', matchedSkills: ['DCF', 'WACC'] }
  ]
};

// [1] Test Briefing Generation & Industry Inference
console.log('\n[1] Testing Company Intelligence Briefing:');
const briefing = generateInterviewIntelligenceBriefing('Razorpay FinTech Solutions', mockFitReport);

assert(briefing.companyName.includes('Razorpay'), 'Company name captured accurately');
assert(briefing.inferredIndustry === 'Financial Services & FinTech', 'Inferred FinTech industry accurately');
assert(briefing.businessModelAnalysis.primaryRevenueStreams.length >= 3, 'Identified multi-stream monetization mechanics');
assert(briefing.businessModelAnalysis.coreUnitEconomics.length >= 3, 'Outlined core unit economics');

// [2] Test Rehearsal Questions & Grounded Portfolio Citations
console.log('\n[2] Testing Rehearsal Questions & Portfolio Grounding:');
assert(briefing.interviewRehearsalQuestions.length === 3, 'Generated 3 structured rehearsal questions');

const govQuestion = briefing.interviewRehearsalQuestions.find(q => q.category === 'DATA_GOVERNANCE');
assert(!!govQuestion, 'Included Data Governance rehearsal question');
assert(govQuestion.linkedPortfolioProject.projectId === 'stratos-governance', 'Governance question grounded in STRATOS deliverable');
assert(govQuestion.linkedPortfolioProject.evidenceHighlight.includes('DQ-10'), 'Direct citation of DQ-10 invariant');

const dcfQuestion = briefing.interviewRehearsalQuestions.find(q => q.category === 'TECHNICAL_DEEP_DIVE');
assert(!!dcfQuestion, 'Included Technical Deep Dive question');
assert(dcfQuestion.linkedPortfolioProject.projectId === 'phonepe-valuation', 'Valuation question grounded in PhonePe deliverable');
assert(dcfQuestion.linkedPortfolioProject.evidenceHighlight.includes('₹33,431.99 Cr'), 'Direct citation of verified ₹33,431.99 Cr EV anchor');

// [3] Test Career Funnel Analytics
console.log('\n[3] Testing Career Funnel Analytics:');
const samplePipeline = [
  { applicationId: 'app_1', status: 'DISCOVERED', requiredSkills: ['SQL', 'Python'] },
  { applicationId: 'app_2', status: 'ANALYZING', requiredSkills: ['SQL', 'Power BI'] },
  { applicationId: 'app_3', status: 'APPROVED', requiredSkills: ['SQL', 'Python', 'DCF'] },
  { applicationId: 'app_4', status: 'SUBMITTED', requiredSkills: ['SQL', 'Python', 'PostgreSQL'] }
];

const analytics = computeCareerFunnelAnalytics(samplePipeline);
assert(analytics.totalOpportunitiesDiscovered === 4, 'Discovered count matches pipeline total (4)');
assert(analytics.totalApplicationsReviewed === 3, 'Reviewed count matches non-discovered total (3)');
assert(analytics.totalApprovedPackages === 2, 'Approved count matches approved + submitted (2)');
assert(analytics.totalSubmittedApplications === 1, 'Submitted count matches exact submitted total (1)');
assert(analytics.funnelConversionRate === 25, 'Conversion rate mathematically computed (1 / 4 = 25%)');
assert(analytics.inDemandSkillsFrequency[0].skill === 'SQL' && analytics.inDemandSkillsFrequency[0].occurrences === 4, 'Skill frequency ranks SQL highest with 4 occurrences');

console.log(`\nOutcome: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

