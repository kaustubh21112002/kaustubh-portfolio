export interface SocialLinks {
  email: string;
  linkedIn: string;
  github: string;
  phone?: string;
  location?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface PortfolioConfig {
  name: string;
  fullName: string;
  scriptName: string;
  role: string;
  headline: string;
  shortBio: string;
  location: string;
  socials: SocialLinks;
  resumePath: string;
  resumeAvailable: boolean;
  profilePhoto: string;
  characterBgColor: string; // Exact sampled background: #ed2026 / RGB(237, 32, 38)
  education: {
    degree: string;
    institution: string;
    period: string;
    details: string;
  }[];
  experience: {
    role: string;
    organization: string;
    period: string;
    responsibilities: string[];
  }[];
  skills: SkillCategory[];
  governancePrinciples: {
    id: string;
    title: string;
    description: string;
  }[];
}

export const portfolioConfig: PortfolioConfig = {
  name: "Kaustubh",
  fullName: "Kaustubh K. Nandurkar",
  scriptName: "Kaustubh",
  role: "Business Analytics & Financial Valuation",
  headline: "Turning Business Questions into Analytical Insights.",
  shortBio: "MBA in Business Analytics candidate connecting quantitative valuation, SQL & Power BI analytics pipelines, and governed data architecture.",
  location: "Nagpur / Nashik, India",
  socials: {
    email: "kaustubhnandurkar21@gmail.com",
    linkedIn: "https://www.linkedin.com/in/kaustubhnandurkar",
    github: "https://github.com/kaustubh21112002",
    phone: "+91 8080001550",
    location: "India"
  },
  resumePath: "/Kaustubh_Nandurkar_Resume.pdf",
  resumeAvailable: true,
  profilePhoto: "/profile.png",
  characterBgColor: "#ed2026",
  education: [
    {
      degree: "MBA - Business Analytics",
      institution: "Sandip University, Nashik",
      period: "2025 – 2027",
      details: "Focus on Quantitative Valuation, Financial Modeling, Predictive Modeling, and Business Intelligence."
    },
    {
      degree: "BSc - Computer Science",
      institution: "Kamla Nehru Mahavidyalaya, Nagpur",
      period: "2021 – 2025",
      details: "Grade: 56.7%. Foundational computing, database architecture, and algorithms."
    },
    {
      degree: "HSC - Science",
      institution: "G. H. Raisoni Vidya Niketan, Nagpur",
      period: "2021",
      details: "Grade: 67.4%."
    }
  ],
  experience: [
    {
      role: "Sports Data Analyst Intern",
      organization: "SPIIDEO",
      period: "June 2026 – Present",
      responsibilities: [
        "Tagged and validated soccer and field hockey match events using Spiideo video tracking platform.",
        "Converted recorded match footage into structured event datasets.",
        "Performed rigorous quality checks to ensure accurate event annotation and analytical consistency."
      ]
    }
  ],
  skills: [
    {
      title: "Financial & Valuation Modeling",
      skills: ["DCF Valuation", "WACC / CAPM Modeling", "EV/EBITDA Multiples", "EV-to-Equity Bridge", "Scenario Analysis", "Financial Statements"]
    },
    {
      title: "Data Analytics & Engineering",
      skills: ["Power BI & DAX", "SQL (PostgreSQL, MySQL)", "Python (Pandas, Scikit-Learn)", "Data Modeling", "Excel Financial Modeling"]
    },
    {
      title: "Data Governance & Quality",
      skills: ["PRESERVE → DOCUMENT → FLAG → GOVERN", "Attribution Modeling", "11 Validation Controls", "Forensic Data Reconciliation", "Audit Exception Tracking"]
    },
    {
      title: "Technology & Front-End",
      skills: ["React 18", "TypeScript", "Vite", "Canvas 2D Graphics", "REST APIs", "Modern Editorial UI"]
    }
  ],
  governancePrinciples: [
    {
      id: "preserve-govern",
      title: "PRESERVE → DOCUMENT → FLAG → GOVERN",
      description: "Never silently alter or impute missing source data. Preserve exceptions, flag irregularities, and govern definitions transparently."
    },
    {
      id: "rigor-first",
      title: "Descriptive Rigor Before Prescriptive Leaps",
      description: "Distinguish observed facts from speculative assumptions. Never claim causality from observational data alone."
    },
    {
      id: "unit-economics",
      title: "Reconciled Financial Truth",
      description: "Balance sheet, income statement, and free cash flows must tie back to audited controls without fabricated benchmarks."
    }
  ]
};
