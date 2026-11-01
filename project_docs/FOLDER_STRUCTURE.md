# Folder Structure & Directory Map

**Confidence:** [VERIFIED]

---

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI workflow
├── api/
│   └── contact.ts                     # Vercel Serverless Function (Contact endpoint)
├── docs/                              # Legacy diagnostic and audit markdown reports
├── project_docs/                      # Governed modular documentation system
│   ├── README.md                      # Documentation hub index & reading order
│   ├── PROJECT_CONTEXT.md             # Master analytical source of truth
│   ├── AI_RULES.md                    # Operational protocols & boundaries
│   ├── PROJECT_STATUS.md              # Feature inventory & working-tree status
│   ├── ARCHITECTURE.md                # System diagrams & chunking strategy
│   ├── TECH_STACK.md                  # Detailed dependency matrix
│   ├── FEATURES.md                    # Functional feature breakdown
│   ├── API_REFERENCE.md               # Serverless endpoint documentation
│   ├── SECURITY.md                    # Headers & security defenses
│   ├── TESTING.md                     # Verification scripts & execution orders
│   ├── ROADMAP.md                     # Strategic roadmap & phased milestones
│   ├── ARCHITECTURE_DECISIONS.md      # Confirmed ADRs
│   ├── FOLDER_STRUCTURE.md            # This structural directory map
│   ├── INTEGRATIONS.md                # External services & protocols
│   ├── TASK_TRACKER.md                # Current task status & backlogs
│   └── CHANGELOG.md                   # Chronological development log
├── public/
│   ├── 404.html                       # Custom static 404 page
│   ├── Kaustubh_Nandurkar_Resume.pdf  # Protected resume PDF (96,435 bytes)
│   ├── robots.txt                     # Crawler access permissions
│   └── sitemap.xml                    # Production search sitemap
├── scripts/                           # Test verification suites & tools
├── src/
│   ├── components/                    # Modular UI components
│   │   ├── about/                     # About section & manifesto
│   │   ├── command/                   # Recruiter Command Center
│   │   ├── common/                    # Shared widgets (AvailabilityBlock, skeletons)
│   │   ├── contact/                   # ContactSection & direct channels
│   │   ├── faq/                       # Recruiter FAQ accordion
│   │   ├── flagship/                  # PhonePe DCF model & sensitivity matrix
│   │   ├── hero/                      # HeroSection & character canvas
│   │   ├── journey/                   # Career & education timeline
│   │   ├── metrics/                   # Evidence telemetry bar
│   │   ├── navigation/                # Header navigation bar
│   │   ├── projects/                  # ProjectsSection, CaseStudyModal, briefs
│   │   ├── research/                  # Academic research library
│   │   ├── resume/                    # Resume section & download station
│   │   └── skills/                    # Categorized technical skills
│   ├── config/                        # Portfolio configuration (portfolio.ts)
│   ├── context/                       # React Contexts (ThemeContext.tsx)
│   └── data/                          # Governed data records (projects.json, projects.ts)
├── CHANGE-SCOPE.md                    # Active task change-control boundary
├── FILE-MAP.md                        # Master repository navigation map
├── index.html                         # SPA HTML entry point
├── package.json                       # Dependencies & build scripts
├── tsconfig.json                      # App TypeScript configuration
├── tsconfig.api.json                  # API TypeScript configuration
├── vercel.json                        # Vercel deployment & security headers
└── vite.config.ts                     # Vite build configuration & chunk splitting
```

