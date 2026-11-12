/**
 * Client-Side Local PDF Text Extractor
 * 
 * Uses pdfjs-dist locally in the browser or Node test runner.
 * - Zero network requests.
 * - Extracts structured page-by-page text.
 * - Identifies page count and empty pages.
 * - Calculates document SHA-256 fingerprint in memory.
 * - Graceful failure on encrypted or malformed documents.
 */

export interface ExtractedPdfPage {
  pageNumber: number; // 1-based
  text: string;
  charCount: number;
}

export interface PdfExtractionResult {
  isSuccess: boolean;
  errorCode?: 'PDF_ENCRYPTED' | 'PDF_CORRUPT' | 'NO_TEXT_FOUND' | 'PARSER_FAILED';
  errorMessage?: string;
  pageCount: number;
  pages: ExtractedPdfPage[];
  combinedText: string;
  documentFingerprint?: string; // SHA-256
}

/**
 * Computes SHA-256 hex string from ArrayBuffer in both browser and Node.
 */
export async function computeBufferSha256(buffer: ArrayBuffer | Uint8Array): Promise<string> {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const rawBuffer = bytes.buffer instanceof ArrayBuffer
      ? bytes.buffer
      : new Uint8Array(bytes).buffer;
    const hashBuffer = await crypto.subtle.digest('SHA-256', rawBuffer as ArrayBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Node fallback for tests
  try {
    const nodeCrypto = await import('node:crypto');
    return nodeCrypto.createHash('sha256').update(bytes).digest('hex');
  } catch {
    return 'fingerprint_unavailable';
  }
}

/**
 * Extracts all text page-by-page from an ArrayBuffer containing PDF bytes.
 */
export async function extractTextFromPdfBuffer(
  buffer: ArrayBuffer | Uint8Array,
  options?: { password?: string }
): Promise<PdfExtractionResult> {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const fingerprint = await computeBufferSha256(bytes);

  try {
    // Dynamic import of pdfjs-dist to allow tree-shaking and runtime flexibility
    let pdfjsLib: any;
    try {
      pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    } catch {
      pdfjsLib = await import('pdfjs-dist');
    }

    // Configure worker: In Vite and modern bundlers, use local asset URL or fallback to standard worker
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions?.workerSrc) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      } catch {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
      }
    }

    const loadingTask = pdfjsLib.getDocument({
      data: bytes,
      password: options?.password || undefined,
      useSystemFonts: true,
      isEvalSupported: false
    });

    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;

    const pages: ExtractedPdfPage[] = [];
    const textAccumulator: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Assemble line text preserving line breaks
      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item && typeof item.str === 'string') {
          // If vertical position changed substantially, insert newline
          const currentY = item.transform ? item.transform[5] : null;
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
            pageText += '\n';
          } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
            pageText += ' ';
          }
          pageText += item.str;
          lastY = currentY;
        }
      }

      const cleanText = pageText.trim();
      pages.push({
        pageNumber: pageNum,
        text: cleanText,
        charCount: cleanText.length
      });
      if (cleanText.length > 0) {
        textAccumulator.push(cleanText);
      }
    }

    const combined = textAccumulator.join('\n\n');

    if (combined.length === 0) {
      return {
        isSuccess: false,
        errorCode: 'NO_TEXT_FOUND',
        errorMessage: 'The PDF was read successfully but contains zero extractable text (e.g. scanned image-only PDF). OCR is not enabled.',
        pageCount,
        pages,
        combinedText: '',
        documentFingerprint: fingerprint
      };
    }

    return {
      isSuccess: true,
      pageCount,
      pages,
      combinedText: combined,
      documentFingerprint: fingerprint
    };
  } catch (err: any) {
    const errorMsg = String(err?.message || err || '');
    if (errorMsg.includes('PasswordException') || errorMsg.includes('password')) {
      return {
        isSuccess: false,
        errorCode: 'PDF_ENCRYPTED',
        errorMessage: 'This PDF document is encrypted or password-protected. Please provide an unencrypted resume PDF.',
        pageCount: 0,
        pages: [],
        combinedText: '',
        documentFingerprint: fingerprint
      };
    }

    return {
      isSuccess: false,
      errorCode: 'PDF_CORRUPT',
      errorMessage: `Failed to parse PDF document: ${errorMsg}`,
      pageCount: 0,
      pages: [],
      combinedText: '',
      documentFingerprint: fingerprint
    };
  }
}
