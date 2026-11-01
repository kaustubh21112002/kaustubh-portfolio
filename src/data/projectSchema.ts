export interface MetricItemSchema {
  label: string;
  value: string;
  subtext?: string;
  classification?: 'DEMONSTRATED' | 'MODEL ESTIMATE' | 'PROTOTYPE DEMO' | 'STUDY ESTIMATE' | 'OPERATIONAL SLA' | 'BENCHMARK PARAMETER';
}

export interface CaseStudySectionSchema {
  title: string;
  subtitle?: string;
  content: string[];
  metrics?: MetricItemSchema[];
  table?: {
    headers: string[];
    rows: (string | number)[][];
  };
  callout?: {
    type: 'note' | 'warning' | 'insight';
    text: string;
  };
}

export interface CaseStudySchema {
  researchQuestion: string;
  executiveSummary: string;
  sections: CaseStudySectionSchema[];
  disclaimer?: string;
}

export interface ProjectDataSchema {
  id: string;
  title: string;
  status: 'In progress' | 'Completed' | 'Paused';
  lastUpdated: string;
  oneLineSummary: string;
  problem: string;
  data: string;
  method: string;
  result: string;
  tools: string[];
  links: { label: string; url: string }[];
  keyMetrics?: MetricItemSchema[];
  caseStudy?: CaseStudySchema;
}

export function validateProjectsData(data: unknown): ProjectDataSchema[] {
  if (!Array.isArray(data)) {
    throw new Error('projects.json root must be an array');
  }

  const ids = new Set<string>();
  const allowedStatuses = new Set(['In progress', 'Completed', 'Paused']);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  data.forEach((p, index) => {
    if (!p.id || typeof p.id !== 'string') {
      throw new Error(`Project at index ${index} is missing a valid 'id'`);
    }
    if (ids.has(p.id)) {
      throw new Error(`Duplicate project id found: '${p.id}'`);
    }
    ids.add(p.id);

    if (!p.title || typeof p.title !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'title'`);
    }

    if (!allowedStatuses.has(p.status)) {
      throw new Error(`Project '${p.id}' has invalid status: '${p.status}'. Must be one of: 'In progress', 'Completed', 'Paused'`);
    }

    if (!p.lastUpdated || !dateRegex.test(p.lastUpdated) || isNaN(Date.parse(p.lastUpdated))) {
      throw new Error(`Project '${p.id}' has invalid lastUpdated date: '${p.lastUpdated}'. Must be YYYY-MM-DD.`);
    }

    if (!p.oneLineSummary || typeof p.oneLineSummary !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'oneLineSummary'`);
    }

    if (!p.problem || typeof p.problem !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'problem'`);
    }

    if (!p.data || typeof p.data !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'data'`);
    }

    if (!p.method || typeof p.method !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'method'`);
    }

    if (!p.result || typeof p.result !== 'string') {
      throw new Error(`Project '${p.id}' missing valid 'result'`);
    }

    if (!Array.isArray(p.tools)) {
      throw new Error(`Project '${p.id}' tools must be an array`);
    }

    if (!Array.isArray(p.links)) {
      throw new Error(`Project '${p.id}' links must be an array`);
    }

    for (const l of p.links) {
      if (!l.label || !l.url) {
        throw new Error(`Project '${p.id}' has a link missing 'label' or 'url'`);
      }
    }

    // Validate keyMetrics if present
    if (p.keyMetrics !== undefined) {
      if (!Array.isArray(p.keyMetrics)) {
        throw new Error(`Project '${p.id}' keyMetrics must be an array`);
      }
      for (const m of p.keyMetrics) {
        if (!m.label || typeof m.label !== 'string') {
          throw new Error(`Project '${p.id}' metric missing valid 'label'`);
        }
        if (m.value === undefined || typeof m.value !== 'string') {
          throw new Error(`Project '${p.id}' metric '${m.label}' missing valid 'value'`);
        }
      }
    }

    // Validate caseStudy if present
    if (p.caseStudy !== undefined) {
      if (typeof p.caseStudy !== 'object' || p.caseStudy === null) {
        throw new Error(`Project '${p.id}' caseStudy must be an object`);
      }
      if (!Array.isArray(p.caseStudy.sections)) {
        throw new Error(`Project '${p.id}' caseStudy.sections must be an array`);
      }
      for (const [sIdx, s] of p.caseStudy.sections.entries()) {
        if (!s.title || typeof s.title !== 'string') {
          throw new Error(`Project '${p.id}' section ${sIdx} missing valid 'title'`);
        }
        if (!Array.isArray(s.content)) {
          throw new Error(`Project '${p.id}' section '${s.title}' content must be an array`);
        }
      }
    }
  });

  return data as ProjectDataSchema[];
}

export function getLatestProjectUpdateDate(projects: ProjectDataSchema[]): string {
  if (!projects || projects.length === 0) return 'Not available';
  const dates = projects.map(p => p.lastUpdated).sort();
  const latestIso = dates[dates.length - 1];
  
  // Format to standard human-readable display e.g. "October 2026" or "October 31, 2026"
  const dateObj = new Date(latestIso + 'T00:00:00Z');
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}
