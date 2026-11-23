# Explainable Job Matching & Scoring Specification

**Document Version:** 1.0.0  
**Status:** Algorithmic Specification  
**Governing Rule:** Absolute Explainability & Fact-Grounding (Zero Hallucinated Fit)  

---

## 1. Core Philosophy & Anti-Hallucination Mandate

Many AI job matchers produce opaque, inflated percentages (e.g., "96% Match!") that mislead candidates and fail ATS filters. The Career Copilot implements an **Explainable Scoring Framework**:
- **Strict Requirement Decoupling:** Evaluates opportunities across four mutually exclusive categories:
  1. *Hard Eligibility Requirements:* Mandatory binary gates (work authorization, mandatory licenses, uncompromisable notice period constraints).
  2. *Employer Preferences:* Nice-to-have tools, preferred years of experience, target industry exposure.
  3. *Candidate Preferences:* Compensation floor (INR CTC / LPA), target locations, hybrid/remote stance.
  4. *Unknown / Missing Information:* Undisclosed compensation, unstated tech stack details, unclarified team sizing.
- **Evidence-Backed Citations:** Every matched requirement must cite a verified project or work achievement from the candidate model.
- **Truthful Gap Analysis:** Lacking requirements are explicitly listed as `CRITICAL_GAP` or `TRANSFERABLE_GAP`—never disguised or ignored.
- **No Guarantees:** Scores reflect semantic alignment with stated job descriptions; they **never claim or guarantee interview callbacks or employment offers**.

---

## 2. Multi-Dimensional Scoring Dimensions

The composite **Job Fit Score (0 to 100)** is computed across six transparent dimensions:

```text
COMPOSITE SCORE = (Skills Alignment × 0.35)
                + (Experience & Seniority × 0.20)
                + (Responsibilities Alignment × 0.15)
                + (Education & Certifications × 0.10)
                + (Location & Work Model × 0.10)
                + (Compensation & Preference × 0.10)
                - (Penalty for Unmet Hard Constraints)
```

### 2.1 Dimension Breakdown

| Dimension | Weight | Evaluation Method | Scoring Criteria |
| :--- | :---: | :--- | :--- |
| **1. Skills Alignment** | **35%** | Deterministic token matching + semantic similarity on technical skills & tools. | • 100%: All core skills present with project evidence.<br>• 70%: Primary technical skills present (e.g. SQL, Python, BI), secondary tool gap.<br>• <40%: Core technical stack missing. |
| **2. Experience & Seniority** | **20%** | Years of relevant experience calibrated against role title expectations. | • Full points if within ±1 year of stated experience.<br>• Penalized proportionally if candidate is under-qualified by >2 years. |
| **3. Responsibilities Alignment** | **15%** | Semantic cosine similarity between job duties and verified candidate achievements. | Measures whether daily work matches candidate's demonstrated background (e.g., building financial DCF models vs managing Jira backlog). |
| **4. Education & Qualifications** | **10%** | Exact check against degree level (Bachelor's, Master's) and field. | Full score if candidate meets minimum degree criteria. |
| **5. Location & Work Model** | **10%** | Binary match on geographic city or Remote compatibility. | • 100%: Role matches preferred cities (Bengaluru/Mumbai) or verified Remote.<br>• 0%: Requires relocation to unapproved city without hybrid flexibility. |
| **6. Compensation & Preferences** | **10%** | Comparison of offered CTC / budget against candidate minimum base. | • 100%: Offered salary meets or exceeds candidate floor.<br>• Neutral (50%): Salary undisclosed in JD.<br>• 0%: Offered budget is below candidate minimum floor. |

---

## 3. Four-Tier Requirement Taxonomy & Filtering

The engine explicitly separates facts, preferences, and missing data into four distinct evaluation buckets:

### 3.1 Tier A: Hard Eligibility Requirements (Binary Gates)
- **Citizenship & Work Authorization:** Immediate disqualification if candidate lacks authorization in role country and sponsorship is not offered.
- **Mandatory Professional Licensure:** (e.g. CPA, MBBS, Bar admission).
- **Hard Notice Period:** Flags roles strictly requiring immediate joining (<15 days) when candidate notice period is 30+ days.
*Outcome:* If any Tier A requirement fails, the overall status is `INELIGIBLE`, and scoring is halted.

### 3.2 Tier B: Employer Preferences (Weighted Match)
- Nice-to-have tools (e.g., Tableau preferred if PowerBI is core).
- Preferred domain exposure (e.g., prior Fintech or E-commerce experience).
- Desired seniority range (e.g., 4–6 years).
*Outcome:* Contributes to the standard 0–100 alignment score.

### 3.3 Tier C: Candidate Preferences (Bidirectional Satisfaction)
- Minimum base compensation (INR CTC floor).
- Preferred geographic cities (Bengaluru, Mumbai, Pune) and work model (Hybrid/Remote).
- Target role families (Analytics Engineering, BI Architecture).
*Outcome:* Modulates the recommendation tier; does not penalize ATS keyword match but flags role as `CANDIDATE_FRICTION` if salary is below floor.

### 3.4 Tier D: Unknown / Missing Information (Uncertainty Tracking)
- Undisclosed salary budgets (common in Indian JDs).
- Vague team sizing or reporting hierarchy.
- Generic tech stack descriptions ("familiarity with modern analytics").
*Outcome:* Tracked explicitly in `uncertaintyNotes`. Reduces the `confidenceScore` (0.0 to 1.0) rather than inventing assumptions.

---

## 4. Structured Match Output Schema

The matching engine emits a strictly validated JSON structure:

```typescript
export type RequirementVerdict = 'EXACT_MATCH' | 'STRONG_TRANSFERABLE' | 'PARTIAL_GAP' | 'MISSING_UNMET';

export interface RequirementAuditItem {
  requirementName: string;
  category: 'TECHNICAL_SKILL' | 'TOOL' | 'BUSINESS_CAPABILITY' | 'FINANCIAL_KNOWLEDGE' | 'QUALIFICATION';
  verdict: RequirementVerdict;
  candidateEvidenceCitation?: {
    projectId?: string;
    experienceId?: string;
    verifiedTextSnippet: string;
  };
  gapRemediationNote?: string;
}

export interface ExplainableJobMatchReport {
  overallScore: number; // 0 - 100
  recommendationTier: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_FIT' | 'POOR_FIT';
  isEligible: boolean;
  hardGateFailures: string[];
  dimensionScores: {
    skills: number;
    experience: number;
    responsibilities: number;
    education: number;
    location: number;
    compensation: number;
  };
  matchedRequirements: RequirementAuditItem[];
  missingRequirements: RequirementAuditItem[];
  confidenceScore: number; // 0.0 - 1.0 (based on JD completeness)
  uncertaintyNotes: string[];
}
```

---

## 5. Calibration, Evaluation & Continuous Improvement

1. **Precision Calibration:** Tested against a reference benchmark of 50 historic Data & Analytics job descriptions with known human ratings.
2. **Confidence Metric:** The engine explicitly scores the *completeness* of the job description. If a JD is brief (under 50 words) or omits key requirements, `confidenceScore` drops and an `uncertaintyNote` is displayed: *"Job description lacks detail on team structure and daily tech stack."*
3. **Zero Grade Inflation:** Thresholds:
   - **85–100:** Strong Match (Immediate shortlist recommendation).
   - **70–84:** Good Match (Viable with tailored resume emphasis).
   - **50–69:** Moderate Fit (Has gaps requiring discussion in cover letter).
   - **<50:** Poor Fit (Ignored or archived).

