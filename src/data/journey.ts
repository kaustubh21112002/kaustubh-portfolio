export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  location: string;
  period: string;
  status: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export const timelineData: TimelineItem[] = [
  {
    id: 'spiideo-internship',
    type: 'experience',
    title: 'Sports Data Analyst Intern',
    organization: 'SPIIDEO',
    location: 'Remote / India',
    period: 'June 2026 – Present',
    status: 'Professional Experience',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Operational sports data analytics internship tagging, verifying, and structuring match video footage into reliable downstream performance datasets.',
    highlights: [
      'Tagged and structured soccer and field hockey match events using automated multi-camera Spiideo tracking platform.',
      'Enforced multi-tier verification protocols ensuring zero timestamp desynchronization across player-attribution sequences.',
      'Delivered high-fidelity structured tabular datasets used by coaching and analytical staff for tactical modeling.'
    ],
    skills: ['Spiideo Camera Systems', 'Event Tagging', 'Data Quality QA', 'Video Analytics']
  },
  {
    id: 'sandip-mba',
    type: 'education',
    title: 'MBA in Business Analytics',
    organization: 'Sandip University',
    location: 'Nashik, Maharashtra',
    period: '2025 – 2027',
    status: 'Academic Degree (In Progress)',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    description: 'Postgraduate management degree specializing in advanced quantitative valuation, business analytics, predictive statistical modeling, and data governance.',
    highlights: [
      'Comprehensive focus on Discounted Cash Flow (DCF), CAPM WACC, and corporate valuation modeling.',
      'Advanced relational database management, SQL star-schema modeling, and Power BI DAX KPI design.',
      'Authored independent Pre-IPO equity research on PhonePe (₹41,631 Cr valuation) and SmartBank 360 feasibility study.'
    ],
    skills: ['DCF Valuation', 'CAPM WACC', 'Power BI & DAX', 'SQL Modeling', 'Business Intelligence']
  },
  {
    id: 'kamla-nehru-bsc',
    type: 'education',
    title: 'BSc in Computer Science',
    organization: 'Kamla Nehru Mahavidyalaya',
    location: 'Nagpur, Maharashtra',
    period: '2021 – 2025',
    status: 'Undergraduate Degree (Grade: 56.7%)',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Undergraduate degree providing deep foundations in computer science, relational database management systems, data structures, and algorithmic logic.',
    highlights: [
      'Developed strong software fundamentals in Python, C++, MySQL relational schema design, and Linux tools.',
      'Designed star-schema database architecture for 10,000+ support ticket records for academic analytics dissertation.',
      'Integrated statistical analysis with programmatic ETL pipelines and frontend visualization engines.'
    ],
    skills: ['Python', 'MySQL', 'Relational Databases', 'Algorithms', 'Data Structures']
  },
  {
    id: 'raisoni-hsc',
    type: 'education',
    title: 'Higher Secondary Certificate (HSC) — Science',
    organization: 'G. H. Raisoni Vidya Niketan',
    location: 'Nagpur, Maharashtra',
    period: '2021',
    status: 'Secondary Certificate (Grade: 67.4%)',
    badgeColor: 'bg-white/5 text-white/60 border-white/10',
    description: 'Rigorous high school science curriculum establishing core quantitative reasoning in mathematics, physics, and computer science.',
    highlights: [
      'Completed coursework in Higher Mathematics, Applied Physics, and Computer Science fundamentals.',
      'Developed quantitative and analytical problem-solving foundation preceding undergraduate studies.'
    ],
    skills: ['Higher Mathematics', 'Analytical Reasoning', 'Physics', 'Computer Science']
  }
];
