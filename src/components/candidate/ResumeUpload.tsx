import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, XCircle, RefreshCw, Lock } from 'lucide-react';
import { ingestResumePdfFile, ResumeIngestionResult } from '../../lib/resumeIngestionService';
import type { CandidateClaim } from '../../types/candidate';

export interface ResumeUploadProps {
  onExtractionComplete?: (result: ResumeIngestionResult) => void;
  onReset?: () => void;
  maxSizeBytes?: number; // default: 5MB
}

export type UploadState =
  | 'IDLE'
  | 'VALIDATING'
  | 'EXTRACTING'
  | 'SUCCESS'
  | 'ERROR';

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onExtractionComplete,
  onReset,
  maxSizeBytes = 5 * 1024 * 1024
}) => {
  const [state, setState] = useState<UploadState>('IDLE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeIngestionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const resetAll = useCallback(() => {
    setState('IDLE');
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onReset) onReset();
  }, [onReset]);

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setState('VALIDATING');

    try {
      setState('EXTRACTING');
      const extractionResult = await ingestResumePdfFile(file, { maxSizeBytes });

      if (!extractionResult.isSuccess) {
        setState('ERROR');
        setErrorMessage(extractionResult.errorMessage || 'Failed to extract text from PDF.');
        setResult(extractionResult);
      } else {
        setState('SUCCESS');
        setResult(extractionResult);
        if (onExtractionComplete) {
          onExtractionComplete(extractionResult);
        }
      }
    } catch (err: any) {
      setState('ERROR');
      setErrorMessage(`Unexpected extraction error: ${err.message || 'Unknown error'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setMagneticOffset({ x: 0, y: 0 });
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
    if (dropzoneRef.current) {
      const rect = dropzoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.12;
      const deltaY = (e.clientY - centerY) * 0.12;
      // Clamp magnetic pull to a subtle max ±14px
      setMagneticOffset({
        x: Math.max(-14, Math.min(14, deltaX)),
        y: Math.max(-14, Math.min(14, deltaY)),
      });
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setMagneticOffset({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6">
      {/* Header & Local Privacy Badge */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Resume PDF Ingestion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Local-only processing. Your resume is parsed strictly in-memory within your browser.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <Lock className="w-3.5 h-3.5" />
          Zero Cloud Upload
        </span>
      </div>

      {/* Main Upload Dropzone */}
      {state === 'IDLE' && (
        <div
          ref={dropzoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            transform: isDragOver
              ? `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`
              : 'translate3d(0, 0, 0)',
            transition: isDragOver ? 'transform 100ms ease-out' : 'transform 260ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer will-change-transform ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-lg shadow-blue-500/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-gray-50/50 dark:bg-gray-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Click to select PDF or drag and drop here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum file size: {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB • Standard PDF only
          </p>
        </div>
      )}

      {/* Processing States */}
      {(state === 'VALIDATING' || state === 'EXTRACTING') && (
        <div className="py-8 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {state === 'VALIDATING' ? 'Validating binary PDF signature...' : 'Extracting text and claims locally...'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedFile?.name} ({(selectedFile?.size ? selectedFile.size / 1024 : 0).toFixed(1)} KB)
          </p>
        </div>
      )}

      {/* Success State */}
      {state === 'SUCCESS' && result && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Local Extraction Successful
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                File: <span className="font-medium">{result.fileName}</span> ({result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'})
              </p>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Claims</span>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {result.extractionSummary.totalClaimsExtracted}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">Draft Claims</span>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {result.extractionSummary.unconfirmedDraftClaimsCount}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">Unknown Fields</span>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {result.extractionSummary.unknownAttributesCount}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <span className="text-xs text-gray-500 dark:text-gray-400">Skills / Projects</span>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {result.extractionSummary.skillsCount} / {result.extractionSummary.projectsCount}
              </p>
            </div>
          </div>

          {/* Mandatory Governance Notice */}
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-medium">Mandatory Verification Notice:</span> Extracted information is a draft. It has not been verified or approved by you. Claims must be reviewed and confirmed before inclusion in any application.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end pt-2">
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors border border-gray-300 dark:border-gray-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Upload Different PDF
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {state === 'ERROR' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                Extraction Failed
              </h4>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                {errorMessage}
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

