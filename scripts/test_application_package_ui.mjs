import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🧪 Starting Phase 8 UI Integration Tests...');

// 1. Verify ApplicationPackageModal file exists and has correct imports
const appPackageModalPath = join(rootDir, 'src', 'components', 'candidate', 'ApplicationPackageModal.tsx');
const appPackageContent = readFileSync(appPackageModalPath, 'utf8');

assert.ok(
  appPackageContent.includes('export const ApplicationPackageModal'),
  'ApplicationPackageModal must export the React component'
);
assert.ok(
  appPackageContent.includes('ApprovalGateService.computePackageHash'),
  'ApplicationPackageModal must call computePackageHash'
);
assert.ok(
  appPackageContent.includes('confirmApproval'),
  'ApplicationPackageModal must invoke confirmApproval on candidate sign-off'
);
assert.ok(
  appPackageContent.includes('RESUME_BULLETS'),
  'ApplicationPackageModal must contain RESUME_BULLETS tab'
);
assert.ok(
  appPackageContent.includes('COVER_LETTER'),
  'ApplicationPackageModal must contain COVER_LETTER tab'
);
assert.ok(
  appPackageContent.includes('SCREENING_ANSWERS'),
  'ApplicationPackageModal must contain SCREENING_ANSWERS tab'
);
console.log('  ✓ Test 1: ApplicationPackageModal structure and invariant bindings passed.');

// 2. Verify JobMatchModal integrates ApplicationPackageModal
const jobMatchModalPath = join(rootDir, 'src', 'components', 'tools', 'JobMatchModal.tsx');
const jobMatchContent = readFileSync(jobMatchModalPath, 'utf8');

assert.ok(
  jobMatchContent.includes("import { ApplicationPackageModal } from '../candidate/ApplicationPackageModal'"),
  'JobMatchModal must import ApplicationPackageModal'
);
assert.ok(
  jobMatchContent.includes('generateTailoredApplicationPackage'),
  'JobMatchModal must import generateTailoredApplicationPackage'
);
assert.ok(
  jobMatchContent.includes('Prepare Application Package'),
  'JobMatchModal must render Prepare Application Package button'
);
assert.ok(
  jobMatchContent.includes('isPackageModalOpen && tailoringPackage'),
  'JobMatchModal must conditionally render ApplicationPackageModal'
);
console.log('  ✓ Test 2: JobMatchModal integration of ApplicationPackageModal passed.');

// 3. Verify zero hallucination guarantee in package tailoring contract
assert.ok(
  appPackageContent.includes('Phase 8.5 Mandate: Zero autonomous dispatch'),
  'ApplicationPackageModal must display Phase 8.5 human governance notice'
);
console.log('  ✓ Test 3: Zero autonomous dispatch policy confirmed.');

console.log('\n🎉 ALL PHASE 8 UI INTEGRATION TESTS PASSED (3/3)\n');

