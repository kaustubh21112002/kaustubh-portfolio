/**
 * Candidate Knowledge Foundation - Core Types & State Transitions
 * 
 * Strict Governance:
 * - PRESERVE -> DOCUMENT -> FLAG -> GOVERN
 * - Absolute separation between:
 *   1. Portfolio-verifiable evidence (project outputs, code, models)
 *   2. Candidate-confirmed facts (formal employment, titles, degrees, contributions)
 *   3. Candidate career preferences (minimum salary, notice period, target roles)
 *   4. AI suggestions (proposals requiring explicit candidate confirmation)
 * - Zero hallucination / Zero silent elevation of unconfirmed claims.
 */

export type ClaimType =
  | 'IDENTITY'
  | 'CONTACT'
  | 'PROFESSIONAL_SUMMARY'
  | 'WORK_EXPERIENCE'
  | 'JOB_TITLE'
  | 'EMPLOYMENT_DATES'
  | 'RESPONSIBILITY'
  | 'ACHIEVEMENT'
  | 'SKILL_PROFICIENCY'
  | 'EDUCATION'
  | 'QUALIFICATION_CERTIFICATION'
  | 'PORTFOLIO_PROJECT'
  | 'PROJECT_CONTRIBUTION'
  | 'CAREER_PREFERENCE';

export type VerificationStatus =
  | 'EXTRACTED'
  | 'CONFIRMED'
  | 'CORRECTED'
  | 'REJECTED'
  | 'UNKNOWN'
  | 'AI_SUGGESTION';

export type ExtractionMethod =
  | 'RESUME_TEXT_PARSER'
  | 'RESUME_PDF_LOCAL_PARSER'
  | 'MANUAL_CANDIDATE_ENTRY'
  | 'PORTFOLIO_CODEBASE_INSPECTION'
  | 'AI_ASSISTED_DRAFT';

export type PermittedApplicationUse =
  | 'RESUME_CONTENT'
  | 'COVER_LETTER'
  | 'SCREENING_ANSWER'
  | 'INTERNAL_MATCHING_ONLY'
  | 'DO_NOT_USE';

/**
 * Atomic Candidate Claim with Full Provenance and Auditability
 */
export interface CandidateClaim {
  claimId: string;
  claimType: ClaimType;
  claimKey: string; // e.g., 'experience.apex.title', 'project.phonepe.contribution'
  claimValue: unknown; // Structured or primitive value
  sourceDocument?: string; // e.g. 'resume.txt', 'candidate_manual_entry'
  sourceDocumentFingerprint?: string; // SHA-256 hash of original file/content
  sourcePageNumber?: number; // 1-based page index if extracted from PDF
  sourcePageRange?: string; // e.g. "p. 1-2"
  sourceSection?: string;
  sourceTextSnippet?: string;
  evidenceReference?: {
    type: 'PORTFOLIO_ARTIFACT' | 'DOCUMENT_ASSERTION' | 'USER_ATTESTATION';
    projectSlug?: string;
    artifactPath?: string;
    invariantMetric?: string;
    notes?: string;
  };
  extractionMethod: ExtractionMethod;
  verificationStatus: VerificationStatus;
  confirmedAt?: string; // ISO-8601 UTC
  confirmedBy?: string; // User identifier / actor
  lastModifiedAt: string; // ISO-8601 UTC
  permittedUse: PermittedApplicationUse;
  history?: Array<{
    previousStatus: VerificationStatus;
    previousValue: unknown;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }>;
}

/**
 * Canonical Candidate Profile (Assembled from Claims)
 */
export interface CanonicalCandidateProfile {
  profileId: string;
  updatedAt: string;
  
  // Section 1: Professional Identity & Contact
  identity: {
    fullName: string;
    preferredName?: string;
    status: VerificationStatus;
  };
  contact: {
    email: string;
    phone: string;
    locationCity: string;
    locationCountry: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    githubUrl?: string;
    status: VerificationStatus;
  };

  // Section 2: Summary
  summary: {
    text: string;
    status: VerificationStatus;
  };

  // Section 3: Employment History
  employment: Array<{
    experienceId: string;
    companyName: string;
    jobTitle: string;
    employmentType: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    responsibilities: string[];
    achievements: Array<{
      achievementId: string;
      description: string;
      metricCited?: string;
      status: VerificationStatus;
      evidenceRef?: string;
    }>;
    status: VerificationStatus;
  }>;

  // Section 4: Skills & Proficiency
  skills: Array<{
    skillId: string;
    name: string;
    category: 'TECHNICAL' | 'FINANCIAL_MODELING' | 'DATA_GOVERNANCE' | 'BI_TOOL' | 'ANALYTICAL';
    proficiency: 'EXPERT' | 'PROFICIENT' | 'FAMILIAR' | 'UNKNOWN';
    yearsExperience?: number;
    demonstratedInProjectSlug?: string;
    status: VerificationStatus;
  }>;

  // Section 5: Education & Qualifications
  education: Array<{
    educationId: string;
    degree: string;
    institution: string;
    fieldOfStudy: string;
    graduationYear?: number;
    status: VerificationStatus;
  }>;

  // Section 6: Portfolio Projects & Candidate-Confirmed Contributions
  portfolioProjects: Array<{
    projectSlug: string;
    title: string;
    domain: string;
    codebaseArtifactPath?: string;
    demonstratedMetrics: Record<string, string>;
    candidatePersonalContribution: {
      description: string;
      isCandidateConfirmed: boolean;
      confirmedAt?: string;
    };
    status: VerificationStatus;
  }>;

  // Section 7: Career Preferences
  preferences: {
    targetJobTitles: string[];
    minimumBaseSalaryInr: number | null; // null if unknown/unspecified
    preferredLocations: string[];
    workModelPreference: 'REMOTE' | 'HYBRID_OR_REMOTE' | 'ON_SITE' | 'UNKNOWN';
    noticePeriodDays: number | null; // null if unknown/unspecified
    willingToRelocate: boolean;
    status: VerificationStatus;
  };
}

/**
 * Valid Status Transitions Matrix
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<VerificationStatus, ReadonlySet<VerificationStatus>> = {
  EXTRACTED: new Set(['CONFIRMED', 'CORRECTED', 'REJECTED', 'UNKNOWN']),
  CONFIRMED: new Set(['CORRECTED', 'REJECTED', 'UNKNOWN']), // Can be re-reviewed and corrected
  CORRECTED: new Set(['CONFIRMED', 'REJECTED', 'UNKNOWN']), // Can be re-confirmed or rejected
  REJECTED: new Set(['CONFIRMED', 'CORRECTED', 'UNKNOWN']), // Can be reconsidered
  UNKNOWN: new Set(['EXTRACTED', 'CONFIRMED', 'CORRECTED', 'REJECTED']),
  AI_SUGGESTION: new Set(['CONFIRMED', 'CORRECTED', 'REJECTED', 'UNKNOWN'])
};

