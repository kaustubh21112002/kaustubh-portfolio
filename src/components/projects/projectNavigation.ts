import { Project, projects } from '../../data/projects';

export const CANONICAL_PROJECT_IDS = [
  'phonepe-valuation',
  'stratos-governance',
  'spiideo-sports-analytics',
  'it-support-analytics',
  'smartbank-360',
  'equitrack-analytics-os'
] as const;

export type CanonicalProjectId = typeof CANONICAL_PROJECT_IDS[number];

/**
 * Checks if a string is a valid canonical project ID
 */
export function isValidProjectId(id: string | null | undefined): id is CanonicalProjectId {
  if (!id) return false;
  return (CANONICAL_PROJECT_IDS as readonly string[]).includes(id);
}

/**
 * Resolves a Project from an ID or returns null if not found
 */
export function getProjectById(id: string | null | undefined): Project | null {
  if (!id) return null;
  return projects.find((p: Project) => p.id === id) || null;
}

/**
 * Generates the canonical shareable URL for a project detail
 */
export function getProjectShareUrl(projectId: string, view: 'case-study' | 'brief' = 'case-study'): string {
  if (typeof window === 'undefined') {
    return `/?project=${encodeURIComponent(projectId)}`;
  }
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?project=${encodeURIComponent(projectId)}${view === 'brief' ? '&view=brief' : ''}`;
}

/**
 * Parses project navigation parameters from current window URL
 */
export function parseProjectUrlParams(): { projectId: string | null; view: 'case-study' | 'brief' } {
  if (typeof window === 'undefined') {
    return { projectId: null, view: 'case-study' };
  }
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('project');
  const viewParam = params.get('view');
  const view = viewParam === 'brief' ? 'brief' : 'case-study';
  return { projectId, view };
}

/**
 * Updates URL search params for project navigation without trigger page reload
 */
export function setProjectUrlParam(projectId: string | null, view: 'case-study' | 'brief' = 'case-study'): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (projectId && isValidProjectId(projectId)) {
    url.searchParams.set('project', projectId);
    if (view === 'brief') {
      url.searchParams.set('view', 'brief');
    } else {
      url.searchParams.delete('view');
    }
  } else {
    url.searchParams.delete('project');
    url.searchParams.delete('view');
  }

  // Use pushState so browser Back/Forward operates as history steps
  window.history.pushState({ projectId, view }, '', url.toString());
}

/**
 * Replaces current URL search params without adding a new history stack entry
 */
export function replaceProjectUrlParam(projectId: string | null, view: 'case-study' | 'brief' = 'case-study'): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (projectId && isValidProjectId(projectId)) {
    url.searchParams.set('project', projectId);
    if (view === 'brief') {
      url.searchParams.set('view', 'brief');
    } else {
      url.searchParams.delete('view');
    }
  } else {
    url.searchParams.delete('project');
    url.searchParams.delete('view');
  }

  window.history.replaceState({ projectId, view }, '', url.toString());
}

/**
 * Computes adjacent canonical projects for sequential previous / next navigation
 */
export function getAdjacentProjects(currentProjectId: string): {
  prevProject: Project;
  nextProject: Project;
  currentIndex: number;
  totalCount: number;
} {
  const currentIndex = projects.findIndex((p: Project) => p.id === currentProjectId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const totalCount = projects.length;

  const prevIndex = (safeIndex - 1 + totalCount) % totalCount;
  const nextIndex = (safeIndex + 1) % totalCount;

  return {
    prevProject: projects[prevIndex],
    nextProject: projects[nextIndex],
    currentIndex: safeIndex,
    totalCount
  };
}
