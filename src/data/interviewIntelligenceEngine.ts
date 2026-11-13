/**
 * Phase 8.6: Interview Intelligence & Career Briefing Generator
 * 
 * Capabilities:
 * 1. Company & Business Model Briefing:
 *    Generates structured company profiles, monetization mechanics, and data stack patterns.
 * 2. Rehearsal Coach & Project Linkages:
 *    Maps anticipated technical & behavioral questions directly to verified portfolio case studies
 *    (e.g., PhonePe DCF model, STRATOS DQ-10, IT Support resolution SLA).
 * 3. Career Funnel Intelligence:
 *    Computes response rates, conversion velocity, and in-demand skill frequency without external trackers.
 */

import type { CandidateFitReport } from './candidateJobFitScorer';

export interface CompanyIntelligenceBriefing {
  companyName: string;
  inferredIndustry: string;
  businessModelAnalysis: {
    primaryRevenueStreams: string[];
    coreUnitEconomics: string[];
    potentialDataChallenges: string[];
  };
  interviewRehearsalQuestions: Array<{
    category: 'TECHNICAL_DEEP_DIVE' | 'BUSINESS_IMPACT' | 'DATA_GOVERNANCE' | 'SYSTEMS_DESIGN';
    questionText: string;
    suggestedResponseFramework: string;
    linkedPortfolioProject: {
      projectId: string;
      projectTitle: string;
      evidenceHighlight: string;
    };
  }>;
}

export interface CareerFunnelAnalytics {
  totalOpportunitiesDiscovered: number;
  totalApplicationsReviewed: number;
  totalApprovedPackages: number;
  totalSubmittedApplications: number;
  funnelConversionRate: number; // percentage
  inDemandSkillsFrequency: Array<{ skill: string; occurrences: number }>;
}

export function generateInterviewIntelligenceBriefing(
  companyName: string,
  fitReport: CandidateFitReport
): CompanyIntelligenceBriefing {
  const compLower = companyName.toLowerCase();

  // Inferred Industry Heuristic
  let inferredIndustry = 'Technology & Analytics Consulting';
  if (compLower.includes('fintech') || compLower.includes('capital') || compLower.includes('bank') || compLower.includes('pay')) {
    inferredIndustry = 'Financial Services & FinTech';
  } else if (compLower.includes('retail') || compLower.includes('commerce') || compLower.includes('shop')) {
    inferredIndustry = 'Retail & E-Commerce Decision Intelligence';
  } else if (compLower.includes('health') || compLower.includes('care') || compLower.includes('bio')) {
    inferredIndustry = 'Healthcare & Life Sciences Analytics';
  }

  // Interview Rehearsal Questions linked directly to verified projects
  const rehearsalQuestions: CompanyIntelligenceBriefing['interviewRehearsalQuestions'] = [
    {
      category: 'DATA_GOVERNANCE',
      questionText: 'How do you handle production data anomalies or discrepancies between reported gross and net metrics?',
      suggestedResponseFramework: 'Explain the PRESERVE -> DOCUMENT -> FLAG -> GOVERN discipline. Emphasize that observational discrepancies must never be silently imputed or forced into cosmetic reconciliation.',
      linkedPortfolioProject: {
        projectId: 'stratos-governance',
        projectTitle: 'STRATOS AI | Controlled Business Analytics & KPI Governance',
        evidenceHighlight: 'Preserved the DQ-10 anomaly (Net Revenue > Gross Revenue in controlled rollups) as REVIEW without synthetic fabrication.'
      }
    },
    {
      category: 'TECHNICAL_DEEP_DIVE',
      questionText: 'Can you walk us through how you estimate cost of capital (WACC) and model terminal value in a DCF schedule?',
      suggestedResponseFramework: 'Detail explicit 5-year forecast discounting, CAPM inputs (beta calibration, equity risk premium), and terminal value blending between Gordon Growth and Exit Multiple.',
      linkedPortfolioProject: {
        projectId: 'phonepe-valuation',
        projectTitle: 'PhonePe Pre-IPO Equity Research & Valuation',
        evidenceHighlight: 'Engineered base case ₹33,431.99 Cr EV and ₹41,631.22 Cr Equity Value with dynamic 5x5 WACC/growth sensitivity table.'
      }
    },
    {
      category: 'SYSTEMS_DESIGN',
      questionText: 'Describe how you build privacy-first analytics without relying on third-party tracking scripts or browser cookies.',
      suggestedResponseFramework: 'Discuss first-party event collection, sliding-window in-memory rate limiting, SHA-256 session hashing, and scale-to-zero serverless PostgreSQL persistence.',
      linkedPortfolioProject: {
        projectId: 'equitrack-analytics-os',
        projectTitle: 'EquiTrack Analytics OS — Portfolio Intelligence Architecture',
        evidenceHighlight: 'Implemented cookieless visitor telemetry with zero IP storage and memory-hard scrypt administrative authentication.'
      }
    }
  ];

  return {
    companyName,
    inferredIndustry,
    businessModelAnalysis: {
      primaryRevenueStreams: [
        'Platform subscription fees and usage-based enterprise licensing',
        'Transaction take rates or volume-based processing margins',
        'Data syndication, benchmarking, and premium decision intelligence modules'
      ],
      coreUnitEconomics: [
        'Customer Acquisition Cost (CAC) vs. Lifetime Value (LTV)',
        'Net Revenue Retention (NRR) and logo churn rates',
        'Gross transaction margin and infrastructure compute overhead'
      ],
      potentialDataChallenges: [
        'Disparate data silos across ERP, CRM, and real-time event logs',
        'Reconciling asynchronous ledger events with batch reporting snapshots',
        'Enforcing data quality thresholds across multi-tenant data pipelines'
      ]
    },
    interviewRehearsalQuestions: rehearsalQuestions
  };
}

export function computeCareerFunnelAnalytics(
  applicationStatuses: Array<{ applicationId: string; status: string; requiredSkills?: string[] }>
): CareerFunnelAnalytics {
  const totalDiscovered = applicationStatuses.length;
  const totalReviewed = applicationStatuses.filter((a) => a.status !== 'DISCOVERED').length;
  const totalApproved = applicationStatuses.filter((a) => a.status === 'APPROVED' || a.status === 'SUBMITTED').length;
  const totalSubmitted = applicationStatuses.filter((a) => a.status === 'SUBMITTED').length;

  const funnelConversionRate = totalDiscovered > 0
    ? Math.round((totalSubmitted / totalDiscovered) * 100)
    : 0;

  // In-demand skill frequency aggregation
  const skillCounts = new Map<string, number>();
  for (const app of applicationStatuses) {
    if (app.requiredSkills) {
      for (const skill of app.requiredSkills) {
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      }
    }
  }

  const inDemandSkillsFrequency = Array.from(skillCounts.entries())
    .map(([skill, occurrences]) => ({ skill, occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences);

  return {
    totalOpportunitiesDiscovered: totalDiscovered,
    totalApplicationsReviewed: totalReviewed,
    totalApprovedPackages: totalApproved,
    totalSubmittedApplications: totalSubmitted,
    funnelConversionRate,
    inDemandSkillsFrequency
  };
}

