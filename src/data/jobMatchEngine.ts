// Deterministic Rule-Based Evidence Matcher for Job Description Analysis
// Strictly bounds matching to governed repository facts without hallucination or arbitrary scores.

import {
  PORTFOLIO_EVIDENCE_REPOSITORY,
  EvidenceSourceItem,
  RequirementMatchResult,
  MatchAnalysisReport,
  RequirementVerdict,
  RequirementCategory
} from './jobMatchKnowledge';

const COMMON_REQUIREMENT_PATTERNS: Array<{
  pattern: RegExp;
  category: RequirementCategory;
  defaultRequirementName: string;
}> = [
  // Technical & Database
  { pattern: /\b(sql|postgres|postgresql|mysql|oracle|sql server|tsql|queries)\b/i, category: 'TECHNICAL_SKILL', defaultRequirementName: 'SQL & Relational Databases' },
  { pattern: /\b(star[\s-]schema|dimensional model|data model|data warehouse|fact table|dimension table)\b/i, category: 'TECHNICAL_SKILL', defaultRequirementName: 'Dimensional Data Modeling' },
  { pattern: /\b(python|pandas|numpy|scipy|data wrangling)\b/i, category: 'TOOL', defaultRequirementName: 'Python for Data Analysis' },
  { pattern: /\b(machine learning|regression|scikit[\s-]learn|predictive model|statistical model|ml)\b/i, category: 'TECHNICAL_SKILL', defaultRequirementName: 'Predictive & Statistical Modeling' },
  { pattern: /\b(eda|exploratory data analysis|outlier|correlation|data exploration)\b/i, category: 'TECHNICAL_SKILL', defaultRequirementName: 'Exploratory Data Analysis (EDA)' },
  { pattern: /\b(excel|spreadsheet|vlookup|xlookup|index match|pivot table)\b/i, category: 'TOOL', defaultRequirementName: 'Advanced Microsoft Excel' },
  { pattern: /\b(power bi|powerbi|dax|tableau|looker|data visualization|dashboard)\b/i, category: 'TOOL', defaultRequirementName: 'Power BI & BI Dashboards' },
  { pattern: /\b(git|github|version control|ci[\s/]cd)\b/i, category: 'TOOL', defaultRequirementName: 'Version Control (Git)' },
  { pattern: /\b(react|typescript|javascript|frontend|ui)\b/i, category: 'TOOL', defaultRequirementName: 'Web & UI Architecture' },

  // Governance & Quality
  { pattern: /\b(data governance|data quality|dq|data integrity|lineage|stewardship)\b/i, category: 'BUSINESS_CAPABILITY', defaultRequirementName: 'Data Governance & Data Quality' },
  { pattern: /\b(reconciliation|audit|discrepancy|exception tracking|financial control)\b/i, category: 'TECHNICAL_SKILL', defaultRequirementName: 'Financial Data Reconciliation' },

  // Business & Operations
  { pattern: /\b(kpi|metrics|business intelligence|decision intelligence|kpi tree)\b/i, category: 'BUSINESS_CAPABILITY', defaultRequirementName: 'KPI Frameworks & Metrics Tree' },
  { pattern: /\b(stakeholder|storytelling|executive presentation|business narrative|communication)\b/i, category: 'BUSINESS_CAPABILITY', defaultRequirementName: 'Executive Storytelling & Communication' },
  { pattern: /\b(operational analytics|bottleneck|sla|turnaround time|service delivery|queue)\b/i, category: 'BUSINESS_CAPABILITY', defaultRequirementName: 'Operational & SLA Analytics' },

  // Financial Valuation
  { pattern: /\b(dcf|discounted cash flow|valuation|financial model|cash flow model|fcff)\b/i, category: 'FINANCIAL_KNOWLEDGE', defaultRequirementName: 'DCF Financial Valuation' },
  { pattern: /\b(wacc|capm|cost of capital|equity risk premium|capital structure)\b/i, category: 'FINANCIAL_KNOWLEDGE', defaultRequirementName: 'Cost of Capital (WACC / CAPM)' },
  { pattern: /\b(terminal value|exit multiple|ebitda multiple|perpetuity growth)\b/i, category: 'FINANCIAL_KNOWLEDGE', defaultRequirementName: 'Terminal Value & Valuation Multiples' },
  { pattern: /\b(sensitivity|scenario|stress test|what[\s-]if|flex table)\b/i, category: 'FINANCIAL_KNOWLEDGE', defaultRequirementName: 'Sensitivity & Scenario Modeling' },
  { pattern: /\b(unit economics|cac|ltv|fintech|banking|capital adequacy)\b/i, category: 'FINANCIAL_KNOWLEDGE', defaultRequirementName: 'FinTech Unit Economics' },

  // Industry & Common Gaps (to truthfully detect missing skills)
  { pattern: /\b(snowflake|bigquery|redshift|synapse)\b/i, category: 'TOOL', defaultRequirementName: 'Cloud Data Warehousing (Snowflake / BigQuery / Redshift)' },
  { pattern: /\b(spark|pyspark|databricks|hadoop)\b/i, category: 'TOOL', defaultRequirementName: 'Distributed Computing (Spark / Databricks)' },
  { pattern: /\b(airflow|dbt|prefect|dag)\b/i, category: 'TOOL', defaultRequirementName: 'Modern Data Orchestration (dbt / Airflow)' },
  { pattern: /\b(aws|azure|gcp|google cloud)\b/i, category: 'TOOL', defaultRequirementName: 'Cloud Infrastructure (AWS / Azure / GCP)' },
  { pattern: /\b(docker|kubernetes|container)\b/i, category: 'TOOL', defaultRequirementName: 'Containerization (Docker / Kubernetes)' },
  { pattern: /\b(kafka|streaming|real[\s-]time stream)\b/i, category: 'TOOL', defaultRequirementName: 'Real-Time Streaming (Kafka / Kinesis)' },
  { pattern: /\b(tableau)\b/i, category: 'TOOL', defaultRequirementName: 'Tableau Desktop / Server' },
  { pattern: /\b(sap|salesforce|erp|crm)\b/i, category: 'TOOL', defaultRequirementName: 'Enterprise ERP / CRM (SAP / Salesforce)' },
  { pattern: /\b(cfa|ca|cpa|frm)\b/i, category: 'EXPERIENCE_QUALIFICATION', defaultRequirementName: 'Professional Certifications (CFA / CA / FRM)' }
];

export interface ParseOptions {
  jobTitle?: string;
  company?: string;
}

/**
 * Extracts distinct requirement candidates from pasted job description text.
 */
export function extractRequirementCandidates(rawText: string): Array<{ name: string; category: RequirementCategory; matchedSnippet: string }> {
  const candidates: Array<{ name: string; category: RequirementCategory; matchedSnippet: string }> = [];
  const lowerText = rawText.toLowerCase();

  for (const item of COMMON_REQUIREMENT_PATTERNS) {
    const match = lowerText.match(item.pattern);
    if (match && match.index !== undefined) {
      // Extract a contextual snippet around the match
      const start = Math.max(0, match.index - 30);
      const end = Math.min(rawText.length, match.index + match[0].length + 45);
      const snippet = rawText.slice(start, end).replace(/\s+/g, ' ').trim();

      candidates.push({
        name: item.defaultRequirementName,
        category: item.category,
        matchedSnippet: `"...${snippet}..."`
      });
    }
  }

  // Deduplicate by name
  const seen = new Set<string>();
  const uniqueCandidates: typeof candidates = [];
  for (const c of candidates) {
    if (!seen.has(c.name)) {
      seen.add(c.name);
      uniqueCandidates.push(c);
    }
  }

  return uniqueCandidates;
}

/**
 * Evaluates candidate requirements against authoritative portfolio evidence repository.
 */
export function evaluateEvidenceMatch(
  requirementName: string,
  category: RequirementCategory,
  snippet: string
): RequirementMatchResult {
  const reqLower = requirementName.toLowerCase();

  // Search repository for high-confidence match
  for (const evidence of PORTFOLIO_EVIDENCE_REPOSITORY) {
    // Exact or direct keyword match
    const hasDirectKeyword = evidence.keywords.some((kw) => reqLower.includes(kw) || kw.includes(reqLower));
    if (hasDirectKeyword) {
      return {
        jobRequirement: requirementName,
        category,
        verdict: 'DEMONSTRATED',
        confidence: 'HIGH',
        matchedEvidence: evidence.evidenceText,
        supportingProject: {
          id: evidence.primaryProject,
          title: evidence.projectTitle
        },
        supportingSkillName: evidence.name,
        explanation: `Directly supported by ${evidence.name} in project "${evidence.projectTitle}". ${evidence.evidenceText}`
      };
    }

    // Partial keyword match
    const hasPartialKeyword = evidence.partialKeywords.some((pkw) => reqLower.includes(pkw) || pkw.includes(reqLower));
    if (hasPartialKeyword) {
      return {
        jobRequirement: requirementName,
        category,
        verdict: 'PARTIAL',
        confidence: 'MEDIUM',
        matchedEvidence: evidence.evidenceText,
        supportingProject: {
          id: evidence.primaryProject,
          title: evidence.projectTitle
        },
        supportingSkillName: evidence.name,
        explanation: `Partially related to candidate competency in ${evidence.name}. Demonstrated in "${evidence.projectTitle}", but requirement may seek deeper specialty or alternative tooling.`
      };
    }
  }

  // If no match found, classify as GAP
  return {
    jobRequirement: requirementName,
    category,
    verdict: 'GAP',
    confidence: 'HIGH',
    matchedEvidence: null,
    supportingProject: null,
    supportingSkillName: null,
    explanation: `No direct evidence found in portfolio project workbooks, datasets, or codebases for "${requirementName}". Recommend candidate prepare relevant conceptual frameworks or bridge with related SQL/Python/BI experience.`
  };
}

/**
 * Analyzes a full job description deterministically against governed portfolio evidence.
 */
export function analyzeJobDescription(rawText: string, options: ParseOptions = {}): MatchAnalysisReport {
  const trimmed = rawText.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  if (!trimmed || wordCount < 5) {
    throw new Error('Job description is too short. Please provide at least 5 words to evaluate requirements.');
  }

  const candidates = extractRequirementCandidates(trimmed);
  const requirementMatches: RequirementMatchResult[] = candidates.map((c) =>
    evaluateEvidenceMatch(c.name, c.category, c.matchedSnippet)
  );

  // If no common keywords were extracted, create a generic informative result
  if (requirementMatches.length === 0) {
    requirementMatches.push({
      jobRequirement: 'General Analytics / Quantitative Qualifications',
      category: 'BUSINESS_CAPABILITY',
      verdict: 'PARTIAL',
      confidence: 'LOW',
      matchedEvidence: 'MBA in Business Analytics with quantitative DCF modeling, relational SQL pipelines, and Power BI reporting.',
      supportingProject: {
        id: 'stratos-governance',
        title: 'STRATOS AI Governance'
      },
      supportingSkillName: 'Analytics & Decision Intelligence',
      explanation: 'No specific industry or technology keywords matched the standard profile. General analytical capabilities are applicable.'
    });
  }

  const demonstratedCount = requirementMatches.filter((r) => r.verdict === 'DEMONSTRATED').length;
  const partialCount = requirementMatches.filter((r) => r.verdict === 'PARTIAL').length;
  const gapCount = requirementMatches.filter((r) => r.verdict === 'GAP').length;
  const totalEvaluated = requirementMatches.length;

  // Governed Coverage Formula: (Demonstrated * 1.0 + Partial * 0.5) / Total * 100
  // Capped and clearly described as evidence coverage, NOT hiring probability
  const rawCoverage = totalEvaluated > 0 ? ((demonstratedCount * 1.0 + partialCount * 0.5) / totalEvaluated) * 100 : 0;
  const coveragePercentage = Math.round(rawCoverage);

  // Identify matching projects
  const projectCounts = new Map<string, { title: string; count: number; skills: Set<string> }>();
  for (const m of requirementMatches) {
    if (m.supportingProject) {
      const pid = m.supportingProject.id;
      const existing = projectCounts.get(pid) || {
        title: m.supportingProject.title,
        count: 0,
        skills: new Set()
      };
      existing.count += m.verdict === 'DEMONSTRATED' ? 1 : 0.5;
      if (m.supportingSkillName) existing.skills.add(m.supportingSkillName);
      projectCounts.set(pid, existing);
    }
  }

  const topMatchingProjects = Array.from(projectCounts.entries())
    .map(([id, data]) => ({
      id,
      title: data.title,
      matchedRequirementsCount: Math.round(data.count),
      demonstratedSkills: Array.from(data.skills)
    }))
    .sort((a, b) => b.matchedRequirementsCount - a.matchedRequirementsCount)
    .slice(0, 3);

  // Relevant demonstrated skills
  const relevantSkills = Array.from(
    new Set(
      requirementMatches
        .filter((r) => r.verdict === 'DEMONSTRATED' && r.supportingSkillName)
        .map((r) => r.supportingSkillName as string)
    )
  );

  // Gaps
  const identifiedGaps = requirementMatches
    .filter((r) => r.verdict === 'GAP')
    .map((r) => r.jobRequirement);

  // Preparation recommendations
  const recommendedPreparationTopics: string[] = [];
  if (identifiedGaps.length > 0) {
    for (const gap of identifiedGaps.slice(0, 3)) {
      recommendedPreparationTopics.push(
        `Review fundamentals and architecture of ${gap} to articulate transferable knowledge from existing SQL, Python, and dimensional data modeling experience.`
      );
    }
  } else {
    recommendedPreparationTopics.push(
      'Deepen walkthrough preparation for PhonePe DCF valuation sensitivity mechanics and STRATOS automated DQ-10 exception audits.'
    );
  }

  // Resume alignment suggestions
  const resumeAlignmentSuggestions: string[] = [];
  if (demonstratedCount > 0) {
    resumeAlignmentSuggestions.push(
      `Lead interview presentations with the ${topMatchingProjects[0]?.title || 'PhonePe / STRATOS'} case study to highlight verified match with core job competencies.`
    );
  }
  if (partialCount > 0) {
    resumeAlignmentSuggestions.push(
      'Emphasize transferable analytical discipline (e.g. bridging relational schema modeling into modern warehouse contexts).'
    );
  }

  return {
    jobTitle: options.jobTitle?.trim() || undefined,
    company: options.company?.trim() || undefined,
    timestamp: new Date().toISOString(),
    inputWordCount: wordCount,
    totalRequirementsEvaluated: totalEvaluated,
    demonstratedCount,
    partialCount,
    gapCount,
    coveragePercentage,
    calculationExplanation: `Evidence coverage represents the verified proportion of extracted job requirements supported by existing portfolio deliverables (Demonstrated = 1.0 weight, Partial = 0.5 weight, Gap = 0.0). This metric indicates evidence alignment only and is not a hiring probability.`,
    topMatchingProjects,
    relevantSkills,
    identifiedGaps,
    recommendedPreparationTopics,
    resumeAlignmentSuggestions,
    requirementMatches
  };
}
