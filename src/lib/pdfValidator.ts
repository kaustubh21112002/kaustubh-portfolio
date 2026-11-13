/**
 * Client-Side Local PDF File Validator
 * 
 * Strict Validation Rules:
 * - Accept PDF files only (.pdf extension, application/pdf MIME type).
 * - Maximum file size constraint (configurable, default 5 MB = 5 * 1024 * 1024 bytes).
 * - Reject 0-byte (empty) files.
 * - Deep header inspection: Verify magic binary bytes `%PDF-` at the start of the file.
 * - Forbid remote transmission: Validation occurs strictly in memory against File or ArrayBuffer.
 */

export interface PdfValidationOptions {
  maxSizeBytes?: number; // default: 5MB
  allowedMimeTypes?: string[];
}

export interface PdfValidationResult {
  isValid: boolean;
  errorCode?:
    | 'FILE_NULL'
    | 'FILE_TOO_LARGE'
    | 'FILE_EMPTY'
    | 'INVALID_EXTENSION'
    | 'INVALID_MIME_TYPE'
    | 'INVALID_PDF_HEADER'
    | 'FILE_READ_ERROR';
  errorMessage?: string;
  fileDetails?: {
    name: string;
    sizeBytes: number;
    mimeType: string;
  };
}

const DEFAULT_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes
const DEFAULT_ALLOWED_MIME_TYPES = ['application/pdf', 'application/x-pdf'];

// PDF Magic Header: %PDF- in ASCII bytes [0x25, 0x50, 0x44, 0x46, 0x2D]
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2D];

/**
 * Validates a PDF file buffer against magic bytes and metadata constraints.
 */
export function validatePdfBuffer(
  buffer: ArrayBuffer | Uint8Array,
  fileName: string = 'document.pdf',
  declaredMimeType: string = 'application/pdf',
  options?: PdfValidationOptions
): PdfValidationResult {
  const maxBytes = options?.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;
  const allowedMimes = options?.allowedMimeTypes ?? DEFAULT_ALLOWED_MIME_TYPES;

  const sizeBytes = buffer.byteLength;

  const fileDetails = {
    name: fileName,
    sizeBytes,
    mimeType: declaredMimeType
  };

  // 1. Check Empty File
  if (sizeBytes === 0) {
    return {
      isValid: false,
      errorCode: 'FILE_EMPTY',
      errorMessage: 'The selected file is empty (0 bytes). Please upload a valid PDF document.',
      fileDetails
    };
  }

  // 2. Check File Size Limit
  if (sizeBytes > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorCode: 'FILE_TOO_LARGE',
      errorMessage: `File size exceeds the allowable limit of ${maxMb} MB.`,
      fileDetails
    };
  }

  // 3. Check File Extension
  const lowerName = fileName.toLowerCase();
  if (!lowerName.endsWith('.pdf')) {
    return {
      isValid: false,
      errorCode: 'INVALID_EXTENSION',
      errorMessage: 'Invalid file extension. Only .pdf files are supported.',
      fileDetails
    };
  }

  // 4. Check Declared MIME Type
  const lowerMime = (declaredMimeType || '').toLowerCase();
  if (lowerMime && !allowedMimes.includes(lowerMime)) {
    return {
      isValid: false,
      errorCode: 'INVALID_MIME_TYPE',
      errorMessage: `Invalid MIME type (${declaredMimeType}). Expected application/pdf.`,
      fileDetails
    };
  }

  // 5. Check Magic Binary Signature (%PDF-)
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 5) {
    return {
      isValid: false,
      errorCode: 'INVALID_PDF_HEADER',
      errorMessage: 'File is too short to contain a valid PDF document header.',
      fileDetails
    };
  }

  // Look for %PDF- in the first 1024 bytes (standard PDF specification allows leading whitespace or comment)
  const searchLimit = Math.min(bytes.length - 4, 1024);
  let magicFound = false;
  for (let i = 0; i < searchLimit; i++) {
    if (
      bytes[i] === PDF_MAGIC_BYTES[0] &&
      bytes[i + 1] === PDF_MAGIC_BYTES[1] &&
      bytes[i + 2] === PDF_MAGIC_BYTES[2] &&
      bytes[i + 3] === PDF_MAGIC_BYTES[3] &&
      bytes[i + 4] === PDF_MAGIC_BYTES[4]
    ) {
      magicFound = true;
      break;
    }
  }

  if (!magicFound) {
    return {
      isValid: false,
      errorCode: 'INVALID_PDF_HEADER',
      errorMessage: 'Invalid PDF binary signature. File does not start with %PDF- header.',
      fileDetails
    };
  }

  return {
    isValid: true,
    fileDetails
  };
}

/**
 * Validates a browser File object before reading.
 */
export async function validatePdfFile(
  file: File,
  options?: PdfValidationOptions
): Promise<PdfValidationResult> {
  if (!file) {
    return {
      isValid: false,
      errorCode: 'FILE_NULL',
      errorMessage: 'No file provided.'
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    return validatePdfBuffer(arrayBuffer, file.name, file.type, options);
  } catch (err: any) {
    return {
      isValid: false,
      errorCode: 'FILE_READ_ERROR',
      errorMessage: `Failed to read file from local disk: ${err.message || 'Unknown error'}`,
      fileDetails: {
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type
      }
    };
  }
}

