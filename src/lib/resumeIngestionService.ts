/**
 * Client-Side Resume Ingestion & PDF Parser Service
 * 
 * Orchestrates:
 * 1. File validation (extension, size, MIME type, PDF magic bytes).
 * 2. In-memory local extraction using pdfExtractor (pdfjs-dist).
 * 3. Atomic claim creation via candidateExtractor.
 * 4. Zero network transmission, zero cloud storage, zero logging of PII.
 */

import { validatePdfFile, validatePdfBuffer, type PdfValidationResult } from './pdfValidator';
import { extractTextFromPdfBuffer, type PdfExtractionResult } from './pdfExtractor';
import { extractClaimsFromResumeText, type ExtractionResult } from './candidateExtractor';
import type { CandidateClaim } from '../types/candidate.js';

export interface ResumeIngestionResult {
  isSuccess: boolean;
  errorCode?: string;
  errorMessage?: string;
  fileName: string;
  fileSizeBytes: number;
  documentFingerprint?: string;
  pageCount: number;
  extractedClaims: CandidateClaim[];
  missingFields: string[];
  extractionSummary: {
    totalClaimsExtracted: number;
    unconfirmedDraftClaimsCount: number;
    unknownAttributesCount: number;
    skillsCount: number;
    projectsCount: number;
  };
}

/**
 * Ingests a candidate PDF file locally and outputs unconfirmed draft claims.
 */
export async function ingestResumePdfFile(
  file: File,
  options?: { maxSizeBytes?: number }
): Promise<ResumeIngestionResult> {
  const fileName = file?.name || 'document.pdf';
  const fileSizeBytes = file?.size || 0;

  // 1. File Validation
  const validation: PdfValidationResult = await validatePdfFile(file, options);
  if (!validation.isValid) {
    return {
      isSuccess: false,
      errorCode: validation.errorCode,
      errorMessage: validation.errorMessage,
      fileName,
      fileSizeBytes,
      pageCount: 0,
      extractedClaims: [],
      missingFields: [],
      extractionSummary: {
        totalClaimsExtracted: 0,
        unconfirmedDraftClaimsCount: 0,
        unknownAttributesCount: 0,
        skillsCount: 0,
        projectsCount: 0
      }
    };
  }

  // 2. Read file to ArrayBuffer
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err: any) {
    return {
      isSuccess: false,
      errorCode: 'FILE_READ_FAILED',
      errorMessage: `Could not read file contents: ${err.message || 'Unknown error'}`,
      fileName,
      fileSizeBytes,
      pageCount: 0,
      extractedClaims: [],
      missingFields: [],
      extractionSummary: {
        totalClaimsExtracted: 0,
        unconfirmedDraftClaimsCount: 0,
        unknownAttributesCount: 0,
        skillsCount: 0,
        projectsCount: 0
      }
    };
  }

  // 3. Extract text from PDF buffer
  return ingestResumePdfBuffer(arrayBuffer, fileName);
}

/**
 * Ingests a PDF from raw ArrayBuffer / Uint8Array (usable in both browser and tests).
 */
export async function ingestResumePdfBuffer(
  buffer: ArrayBuffer | Uint8Array,
  fileName: string = 'document.pdf',
  declaredMime: string = 'application/pdf',
  options?: { maxSizeBytes?: number }
): Promise<ResumeIngestionResult> {
  const fileSizeBytes = buffer.byteLength;

  // 1. Buffer Validation
  const validation = validatePdfBuffer(buffer, fileName, declaredMime, options);
  if (!validation.isValid) {
    return {
      isSuccess: false,
      errorCode: validation.errorCode,
      errorMessage: validation.errorMessage,
      fileName,
      fileSizeBytes,
      pageCount: 0,
      extractedClaims: [],
      missingFields: [],
      extractionSummary: {
        totalClaimsExtracted: 0,
        unconfirmedDraftClaimsCount: 0,
        unknownAttributesCount: 0,
        skillsCount: 0,
        projectsCount: 0
      }
    };
  }

  // 2. Text Extraction
  const extraction: PdfExtractionResult = await extractTextFromPdfBuffer(buffer);
  if (!extraction.isSuccess) {
    return {
      isSuccess: false,
      errorCode: extraction.errorCode,
      errorMessage: extraction.errorMessage,
      fileName,
      fileSizeBytes,
      documentFingerprint: extraction.documentFingerprint,
      pageCount: extraction.pageCount,
      extractedClaims: [],
      missingFields: [],
      extractionSummary: {
        totalClaimsExtracted: 0,
        unconfirmedDraftClaimsCount: 0,
        unknownAttributesCount: 0,
        skillsCount: 0,
        projectsCount: 0
      }
    };
  }

  // 3. Parse Claims with Provenance
  const claimResult: ExtractionResult = extractClaimsFromResumeText(extraction.combinedText, {
    sourceDocument: fileName,
    sourceDocumentFingerprint: extraction.documentFingerprint,
    extractionMethod: 'RESUME_PDF_LOCAL_PARSER',
    sourcePageNumber: extraction.pageCount > 0 ? 1 : undefined
  });

  const extracted = claimResult.claims;
  const unknownCount = extracted.filter((c) => c.verificationStatus === 'UNKNOWN').length;
  const draftCount = extracted.filter((c) => c.verificationStatus === 'EXTRACTED').length;
  const skillsCount = extracted.filter((c) => c.claimType === 'SKILL_PROFICIENCY').length;
  const projectsCount = extracted.filter((c) => c.claimType === 'PORTFOLIO_PROJECT').length;

  return {
    isSuccess: true,
    fileName,
    fileSizeBytes,
    documentFingerprint: extraction.documentFingerprint,
    pageCount: extraction.pageCount,
    extractedClaims: extracted,
    missingFields: claimResult.missingFields,
    extractionSummary: {
      totalClaimsExtracted: extracted.length,
      unconfirmedDraftClaimsCount: draftCount,
      unknownAttributesCount: unknownCount,
      skillsCount,
      projectsCount
    }
  };
}
