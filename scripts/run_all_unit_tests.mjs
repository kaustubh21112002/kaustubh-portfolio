import { execSync } from 'node:child_process';

console.log('🚀 Running Complete Repository Test Suite...');

const testScripts = [
  'node scripts/test_valuation_math.mjs',
  'node scripts/test_contact_api.mjs',
  'node scripts/test_candidate_job_fit.mjs',
  'node scripts/test_document_tailoring.mjs',
  'node scripts/test_approval_gate.mjs',
  'node scripts/test_interview_intelligence.mjs',
  'node scripts/test_application_package_ui.mjs',
  'node scripts/test_interview_intelligence_ui.mjs',
  'node scripts/test_application_kanban.mjs'
];

let totalPassed = 0;
let totalFailed = 0;

for (const script of testScripts) {
  try {
    console.log(`\n▶️ Executing: ${script}`);
    const output = execSync(script, { encoding: 'utf8', stdio: 'pipe' });
    console.log(output.trim());
    totalPassed++;
  } catch (err) {
    console.error(`❌ FAILED: ${script}`);
    if (err.stdout) console.log(err.stdout);
    if (err.stderr) console.error(err.stderr);
    totalFailed++;
  }
}

console.log(`\n========================================`);
console.log(`🏆 ALL SUITES EXECUTED: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log(`========================================\n`);

if (totalFailed > 0) {
  process.exit(1);
}

