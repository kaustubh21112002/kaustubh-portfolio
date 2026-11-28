import type { MetricItem } from './projects';

export interface ProjectManifest {
  id: string;
  title: string;
  summary: string;
  metrics: MetricItem[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  updatedAt: string;
  version: string;
}

const VALID_CLASSIFICATIONS = new Set([
  'DEMONSTRATED',
  'MODEL ESTIMATE',
  'PROTOTYPE DEMO',
  'STUDY ESTIMATE',
  'OPERATIONAL SLA',
  'BENCHMARK PARAMETER',
]);

function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

function isValidHttpUrl(val: unknown): val is string {
  if (!isNonEmptyString(val)) return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Strict runtime validator for external release manifests.
 * Enforces zero silent overrides: invalid or incomplete manifests are rejected
 * with a clear warning so local verified project data remains intact.
 */
export function validateProjectManifest(
  manifest: unknown,
  expectedId?: string
): manifest is ProjectManifest {
  if (!manifest || typeof manifest !== 'object') {
    console.warn(`[ManifestSync] Rejected non-object manifest for "${expectedId ?? 'unknown'}".`);
    return false;
  }

  const m = manifest as Record<string, unknown>;

  if (!isNonEmptyString(m.id) || (expectedId && m.id !== expectedId)) {
    console.warn(`[ManifestSync] Rejected manifest: invalid or mismatched id ("${String(m.id)}").`);
    return false;
  }
  if (!isNonEmptyString(m.title) || !isNonEmptyString(m.summary)) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": missing title or summary.`);
    return false;
  }
  if (!isNonEmptyString(m.version) || !isNonEmptyString(m.updatedAt)) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": missing version or updatedAt.`);
    return false;
  }
  if (!Array.isArray(m.stack) || m.stack.length === 0 || !m.stack.every(isNonEmptyString)) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": stack must be a non-empty string array.`);
    return false;
  }
  if (!Array.isArray(m.metrics) || m.metrics.length === 0) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": metrics must be a non-empty array.`);
    return false;
  }

  for (const item of m.metrics) {
    if (!item || typeof item !== 'object') {
      console.warn(`[ManifestSync] Rejected manifest "${m.id}": invalid metric entry.`);
      return false;
    }
    const metric = item as Record<string, unknown>;
    if (!isNonEmptyString(metric.label) || !isNonEmptyString(metric.value)) {
      console.warn(`[ManifestSync] Rejected manifest "${m.id}": metric missing label or value.`);
      return false;
    }
    if (
      metric.classification !== undefined &&
      (typeof metric.classification !== 'string' || !VALID_CLASSIFICATIONS.has(metric.classification))
    ) {
      console.warn(
        `[ManifestSync] Rejected manifest "${m.id}": invalid metric classification "${String(metric.classification)}".`
      );
      return false;
    }
  }

  if (m.liveUrl !== undefined && !isValidHttpUrl(m.liveUrl)) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": invalid liveUrl.`);
    return false;
  }
  if (m.repoUrl !== undefined && !isValidHttpUrl(m.repoUrl)) {
    console.warn(`[ManifestSync] Rejected manifest "${m.id}": invalid repoUrl.`);
    return false;
  }

  return true;
}

/**
 * Validated external release manifests synced from source repositories
 * (e.g. equitrack-analytics-os, it-support-analytics).
 * Empty by default until a tagged release (v*) pushes a verified manifest.
 */
export const externalManifests: Record<string, ProjectManifest> = {};
