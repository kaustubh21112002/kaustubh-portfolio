/**
 * Synthetic Candidate Fixture for Testing & Local Verification
 * 
 * STRICT MANDATE:
 * - This fixture contains purely SYNTHETIC data for automated test suites.
 * - This data represents a fictional candidate ("Alex Morgan").
 * - This data must NEVER be treated as real candidate information, preferences,
 *   or qualifications.
 */

import type { CandidateClaim } from '../types/candidate.js';

export const SYNTHETIC_TEST_CANDIDATE_CLAIMS: CandidateClaim[] = [
  {
    claimId: 'synth_identity_name',
    claimType: 'IDENTITY',
    claimKey: 'identity.name',
    claimValue: 'Alex Morgan (SYNTHETIC TEST CANDIDATE)',
    sourceDocument: 'synthetic_test_fixture.json',
    sourceSection: 'Test Fixture Data',
    sourceTextSnippet: 'Fictional test candidate profile for unit and contract testing',
    extractionMethod: 'MANUAL_CANDIDATE_ENTRY',
    verificationStatus: 'CONFIRMED',
    confirmedAt: '2026-01-01T00:00:00.000Z',
    confirmedBy: 'test_harness_actor',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    permittedUse: 'DO_NOT_USE'
  },
  {
    claimId: 'synth_pref_salary',
    claimType: 'CAREER_PREFERENCE',
    claimKey: 'preference.minSalary',
    claimValue: 2400000, // 24 LPA synthetic test figure
    sourceDocument: 'synthetic_test_fixture.json',
    sourceSection: 'Test Preferences',
    sourceTextSnippet: 'Synthetic test compensation floor for scoring verification',
    extractionMethod: 'MANUAL_CANDIDATE_ENTRY',
    verificationStatus: 'CONFIRMED',
    confirmedAt: '2026-01-01T00:00:00.000Z',
    confirmedBy: 'test_harness_actor',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    permittedUse: 'INTERNAL_MATCHING_ONLY'
  },
  {
    claimId: 'synth_pref_notice',
    claimType: 'CAREER_PREFERENCE',
    claimKey: 'preference.noticePeriod',
    claimValue: 30, // 30 days synthetic test notice period
    sourceDocument: 'synthetic_test_fixture.json',
    sourceSection: 'Test Preferences',
    extractionMethod: 'MANUAL_CANDIDATE_ENTRY',
    verificationStatus: 'CONFIRMED',
    confirmedAt: '2026-01-01T00:00:00.000Z',
    confirmedBy: 'test_harness_actor',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    permittedUse: 'INTERNAL_MATCHING_ONLY'
  },
  {
    claimId: 'synth_skill_sql',
    claimType: 'SKILL_PROFICIENCY',
    claimKey: 'skill.sql',
    claimValue: {
      name: 'SQL',
      category: 'TECHNICAL',
      proficiency: 'EXPERT'
    },
    sourceDocument: 'synthetic_test_fixture.json',
    extractionMethod: 'MANUAL_CANDIDATE_ENTRY',
    verificationStatus: 'CONFIRMED',
    confirmedAt: '2026-01-01T00:00:00.000Z',
    confirmedBy: 'test_harness_actor',
    lastModifiedAt: '2026-01-01T00:00:00.000Z',
    permittedUse: 'RESUME_CONTENT'
  }
];

