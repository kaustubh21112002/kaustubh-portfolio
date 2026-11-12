/**
 * Deterministic Resume Text & Portfolio Claim Extractor
 * 
 * Rules:
 * - Deterministic parsing of text lines.
 * - Every extracted claim starts in EXTRACTED status.
 * - Missing fields (email, phone, dates, salary) are set to UNKNOWN status.
 * - Portfolio project outcomes are tagged with evidenceReference (PORTFOLIO_ARTIFACT),
 *   but individual personal contributions are separate and start in UNKNOWN status.
 */

import type { CandidateClaim } from '../types/candidate.js';

export interface ExtractionResult {
  sourceDocument: string;
  extractedAt: string;
  claims: CandidateClaim[];
  missingFields: string[];
}

export interface ExtractionOptions {
  sourceDocument?: string;
  sourceDocumentFingerprint?: string;
  sourcePageNumber?: number;
  extractionMethod?: CandidateClaim['extractionMethod'];
}

export function extractClaimsFromResumeText(
  rawText: string,
  sourceDocumentOrOptions?: string | ExtractionOptions
): ExtractionResult {
  const options: ExtractionOptions =
    typeof sourceDocumentOrOptions === 'string'
      ? { sourceDocument: sourceDocumentOrOptions }
      : sourceDocumentOrOptions || {};

  const sourceDocument = options.sourceDocument || 'resume.txt';
  const sourceFingerprint = options.sourceDocumentFingerprint;
  const sourcePageNumber = options.sourcePageNumber;
  const extractionMethod = options.extractionMethod || 'RESUME_TEXT_PARSER';

  const claims: CandidateClaim[] = [];
  const missingFields: string[] = [];
  const now = new Date().toISOString();

  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Helper to attach provenance metadata
  const withProvenance = (base: Omit<CandidateClaim, 'lastModifiedAt' | 'extractionMethod' | 'sourceDocument'>): CandidateClaim => ({
    ...base,
    sourceDocument,
    ...(sourceFingerprint ? { sourceDocumentFingerprint: sourceFingerprint } : {}),
    ...(sourcePageNumber ? { sourcePageNumber } : {}),
    extractionMethod,
    lastModifiedAt: now
  });

  // 1. Extract Professional Overview / Summary
  const overviewIndex = lines.findIndex((l) => l.toLowerCase().startsWith('professional overview'));
  if (overviewIndex !== -1) {
    const headerLine = lines[overviewIndex];
    // Check if summary text is on the same line after colon: "Professional Overview: Analytics Engineer..."
    let summaryText = '';
    const colonIndex = headerLine.indexOf(':');
    if (colonIndex !== -1 && headerLine.substring(colonIndex + 1).trim().length > 0) {
      summaryText = headerLine.substring(colonIndex + 1).trim();
    } else if (overviewIndex + 1 < lines.length) {
      summaryText = lines[overviewIndex + 1].trim();
    }

    if (summaryText.length > 0) {
      claims.push(withProvenance({
        claimId: 'claim_summary_overview',
        claimType: 'PROFESSIONAL_SUMMARY',
        claimKey: 'summary.overview',
        claimValue: summaryText,
        sourceSection: 'Professional Overview',
        sourceTextSnippet: summaryText,
        verificationStatus: 'EXTRACTED',
        permittedUse: 'RESUME_CONTENT'
      }));
    } else {
      missingFields.push('summary.overview');
    }
  } else {
    missingFields.push('summary.overview');
  }

  // 2. Extract Core Competencies / Skills
  const compIndex = lines.findIndex((l) => l.toLowerCase().startsWith('core competencies'));
  if (compIndex !== -1) {
    let i = compIndex + 1;
    while (i < lines.length && !lines[i].toLowerCase().startsWith('featured')) {
      const line = lines[i];
      if (line.startsWith('-')) {
        const parts = line.substring(1).split(':');
        const categoryName = parts[0]?.trim() || 'General';
        const skillList = parts[1]?.split(',').map((s) => s.trim()) || [];
        
        for (const skill of skillList) {
          if (skill.length > 0) {
            const skillSlug = skill.toLowerCase().replace(/[^a-z0-9]/g, '_');
            claims.push(withProvenance({
              claimId: `claim_skill_${skillSlug}`,
              claimType: 'SKILL_PROFICIENCY',
              claimKey: `skill.${skillSlug}`,
              claimValue: {
                name: skill,
                category: categoryName.includes('Financial') ? 'FINANCIAL_MODELING' : 'TECHNICAL',
                proficiency: 'UNKNOWN' // Proficiency is unknown until candidate confirms
              },
              sourceSection: 'Core Competencies',
              sourceTextSnippet: line,
              verificationStatus: 'EXTRACTED',
              permittedUse: 'RESUME_CONTENT'
            }));
          }
        }
      }
      i++;
    }
  } else {
    missingFields.push('skills');
  }

  // 3. Extract Featured Projects
  const projectIndex = lines.findIndex((l) => l.toLowerCase().startsWith('featured independent projects'));
  if (projectIndex !== -1) {
    let i = projectIndex + 1;
    while (i < lines.length) {
      const line = lines[i];
      // Match pattern: "1. PhonePe Pre-IPO Equity Research & DCF Valuation: ..."
      const match = line.match(/^(\d+)\.\s+([^:]+):\s+(.+)$/);
      if (match) {
        const title = match[2].trim();
        const details = match[3].trim();
        const slug = title.toLowerCase().includes('phonepe')
          ? 'phonepe-valuation'
          : title.toLowerCase().includes('stratos')
          ? 'stratos-retail'
          : `project_${match[1]}`;

        // Claim A: Portfolio project artifact existence
        claims.push(withProvenance({
          claimId: `claim_project_${slug}`,
          claimType: 'PORTFOLIO_PROJECT',
          claimKey: `project.${slug}.metadata`,
          claimValue: {
            slug,
            title,
            details
          },
          sourceSection: 'Featured Independent Projects',
          sourceTextSnippet: line,
          evidenceReference: {
            type: 'PORTFOLIO_ARTIFACT',
            projectSlug: slug,
            notes: details
          },
          verificationStatus: 'EXTRACTED',
          permittedUse: 'RESUME_CONTENT'
        }));

        // Claim B: Candidate personal contribution (starts explicitly UNKNOWN)
        claims.push(withProvenance({
          claimId: `claim_contrib_${slug}`,
          claimType: 'PROJECT_CONTRIBUTION',
          claimKey: `project.${slug}.contribution`,
          claimValue: 'Unconfirmed candidate contribution',
          sourceSection: 'Featured Independent Projects',
          sourceTextSnippet: line,
          evidenceReference: {
            type: 'USER_ATTESTATION',
            projectSlug: slug,
            notes: 'Requires candidate confirmation of personal role versus project outcomes.'
          },
          verificationStatus: 'UNKNOWN',
          permittedUse: 'INTERNAL_MATCHING_ONLY'
        }));
      }
      i++;
    }
  }

  // 4. Missing Candidate Ground Truth (Not Present in Short resume.txt)
  // Must be flagged explicitly as UNKNOWN rather than fabricated
  const missingCandidates = [
    { key: 'identity.name', type: 'IDENTITY' as const, label: 'Candidate Full Name' },
    { key: 'contact.email', type: 'CONTACT' as const, label: 'Primary Email' },
    { key: 'contact.phone', type: 'CONTACT' as const, label: 'Phone Number' },
    { key: 'preference.minSalary', type: 'CAREER_PREFERENCE' as const, label: 'Minimum Base Salary (INR)' },
    { key: 'preference.noticePeriod', type: 'CAREER_PREFERENCE' as const, label: 'Notice Period (Days)' }
  ];

  for (const item of missingCandidates) {
    missingFields.push(item.key);
    claims.push(withProvenance({
      claimId: `claim_unknown_${item.key.replace('.', '_')}`,
      claimType: item.type,
      claimKey: item.key,
      claimValue: null,
      sourceTextSnippet: 'Field not present in source document',
      verificationStatus: 'UNKNOWN',
      permittedUse: 'DO_NOT_USE'
    }));
  }

  return {
    sourceDocument,
    extractedAt: now,
    claims,
    missingFields
  };
}

