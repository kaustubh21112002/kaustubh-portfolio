// Server-side Portfolio Context Builder
// Aggregates and bounds factual context from governed project data, FAQ data, and resume text.
// Strictly server-only: Excludes placeholders, unknown values, and bounds total context size.

import fs from 'fs';
import path from 'path';

interface ProjectRecord {
  id: string;
  title: string;
  status: string;
  lastUpdated: string;
  oneLineSummary: string;
  problem: string;
  data: string;
  method: string;
  result: string;
  tools: string[];
  keyMetrics?: Array<{ label: string; value: string }>;
  caseStudy?: {
    sections?: Array<{ title: string; content?: string }>;
  };
}

interface FaqEntry {
  category?: string;
  question: string;
  answer: string;
}

const PLACEHOLDER_PATTERNS = [
  /\[ADD VALUE\]/i,
  /\[ADD LINK\]/i,
  /\[PLACEHOLDER\]/i
];

function containsPlaceholder(val: unknown): boolean {
  if (typeof val === 'string') {
    return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(val));
  }
  if (Array.isArray(val)) {
    return val.some(containsPlaceholder);
  }
  if (val !== null && typeof val === 'object') {
    return Object.values(val).some(containsPlaceholder);
  }
  return false;
}

const MAX_CONTEXT_LENGTH = 16000;

export function buildPortfolioContext(): string {
  const sections: string[] = [];

  // 1. Projects Data (src/data/projects.json)
  try {
    const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    if (fs.existsSync(projectsPath)) {
      const raw = fs.readFileSync(projectsPath, 'utf8');
      const projects: ProjectRecord[] = JSON.parse(raw);

      const projectSummaries: string[] = [];
      for (const p of projects) {
        if (containsPlaceholder(p)) continue;

        let entry = `### Project: ${p.title} (${p.status})\n`;
        if (p.oneLineSummary) entry += `Summary: ${p.oneLineSummary}\n`;
        if (p.problem) entry += `Problem: ${p.problem}\n`;
        if (p.data) entry += `Data: ${p.data}\n`;
        if (p.method) entry += `Method: ${p.method}\n`;
        if (p.result) entry += `Result: ${p.result}\n`;
        if (p.tools?.length) entry += `Tools: ${p.tools.join(', ')}\n`;

        if (p.keyMetrics?.length) {
          const metricsStr = p.keyMetrics
            .filter((m) => !containsPlaceholder(m))
            .map((m) => `${m.label}: ${m.value}`)
            .join(' | ');
          if (metricsStr) entry += `Key Metrics: ${metricsStr}\n`;
        }

        projectSummaries.push(entry.trim());
      }

      if (projectSummaries.length > 0) {
        sections.push(`## Governed Projects\n\n${projectSummaries.join('\n\n')}`);
      }
    }
  } catch (_e) {
    // Fail silently in reading; keep remaining context robust
  }

  // 2. FAQ Data (src/data/faq.json)
  try {
    const faqPath = path.join(process.cwd(), 'src', 'data', 'faq.json');
    if (fs.existsSync(faqPath)) {
      const raw = fs.readFileSync(faqPath, 'utf8');
      const faqs: FaqEntry[] = JSON.parse(raw);

      const validFaqs = faqs
        .filter((f) => !containsPlaceholder(f))
        .map((f) => `Q: ${f.question}\nA: ${f.answer}`);

      if (validFaqs.length > 0) {
        sections.push(`## Frequently Asked Questions\n\n${validFaqs.join('\n\n')}`);
      }
    }
  } catch (_e) {
    // Ignore error
  }

  // 3. Resume Text (src/data/resume.txt)
  try {
    const resumePath = path.join(process.cwd(), 'src', 'data', 'resume.txt');
    if (fs.existsSync(resumePath)) {
      const raw = fs.readFileSync(resumePath, 'utf8');
      if (!containsPlaceholder(raw)) {
        sections.push(`## Professional Background & Resume\n\n${raw.trim()}`);
      }
    }
  } catch (_e) {
    // Ignore error
  }

  const combined = sections.join('\n\n---\n\n');
  if (combined.length > MAX_CONTEXT_LENGTH) {
    return combined.slice(0, MAX_CONTEXT_LENGTH) + '\n\n[Context bounded for brevity]';
  }

  return combined;
}

