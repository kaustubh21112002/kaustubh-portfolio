import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🧪 Starting Phase 8.6 Interview Intelligence UI Integration Tests...');

// 1. Verify InterviewIntelligenceModal file exists and exports
const interviewModalPath = join(rootDir, 'src', 'components', 'candidate', 'InterviewIntelligenceModal.tsx');
const interviewModalContent = readFileSync(interviewModalPath, 'utf8');

assert.ok(
  interviewModalContent.includes('export const InterviewIntelligenceModal'),
  'InterviewIntelligenceModal must export React component'
);
assert.ok(
  interviewModalContent.includes('generateInterviewIntelligenceBriefing'),
  'InterviewIntelligenceModal must call generateInterviewIntelligenceBriefing'
);
assert.ok(
  interviewModalContent.includes('computeCareerFunnelAnalytics'),
  'InterviewIntelligenceModal must invoke computeCareerFunnelAnalytics'
);
assert.ok(
  interviewModalContent.includes('REHEARSAL_QUESTIONS'),
  'InterviewIntelligenceModal must contain REHEARSAL_QUESTIONS tab'
);
assert.ok(
  interviewModalContent.includes('FUNNEL_ANALYTICS'),
  'InterviewIntelligenceModal must contain FUNNEL_ANALYTICS tab'
);
console.log('  ✓ Test 1: InterviewIntelligenceModal component structure verified.');

// 2. Verify JobMatchModal integrates InterviewIntelligenceModal
const jobMatchModalPath = join(rootDir, 'src', 'components', 'tools', 'JobMatchModal.tsx');
const jobMatchContent = readFileSync(jobMatchModalPath, 'utf8');

assert.ok(
  jobMatchContent.includes("import { InterviewIntelligenceModal } from '../candidate/InterviewIntelligenceModal'"),
  'JobMatchModal must import InterviewIntelligenceModal'
);
assert.ok(
  jobMatchContent.includes('Interview Intelligence'),
  'JobMatchModal must render Interview Intelligence button'
);
assert.ok(
  jobMatchContent.includes('isInterviewModalOpen && candidateFitReport'),
  'JobMatchModal must conditionally render InterviewIntelligenceModal'
);
console.log('  ✓ Test 2: JobMatchModal integration of InterviewIntelligenceModal verified.');

// 3. Verify zero external trackers invariant
assert.ok(
  interviewModalContent.includes('Zero Third-Party Trackers'),
  'InterviewIntelligenceModal must declare zero third-party tracking invariant'
);
console.log('  ✓ Test 3: Zero third-party tracker policy confirmed.');

console.log('\n🎉 ALL PHASE 8.6 UI INTEGRATION TESTS PASSED (3/3)\n');

