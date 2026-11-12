# UI Component Hierarchy & Design System

> **Scope**: Component catalog, prop interfaces, atomic design tokens, and accessibility standards.  
> **Status**: `VERIFIED`

---

## 1. Master Component Catalog

```
src/components/
├── navigation/
│   └── Header.tsx                      # Top sticky navigation bar with blur backdrop
├── hero/
│   ├── HeroSection.tsx                 # Primary value proposition and CTA buttons
│   └── CharacterCanvas.tsx             # Interactive HTML5 canvas character animation
├── flagship/
│   ├── FlagshipPhonePe.tsx             # Main container for PhonePe valuation model
│   ├── ValuationWaterfallChart.tsx     # Custom SVG waterfall chart
│   ├── ValuationScenarioComparison.tsx # Interactive 5x5 WACC/growth sensitivity table
│   └── ValuationExportModal.tsx        # Modal for exporting financial models as CSV/JSON
├── projects/
│   ├── ProjectsSection.tsx             # Grid of flagship project showcase cards
│   ├── CaseStudyModal.tsx              # Deep-dive interactive modal for selected project
│   ├── StratosDQMatrix.tsx             # Governed data quality engine with DQ-10 audit trail
│   ├── ITSupportArchitectureInteractive.tsx # Interactive architecture diagram for IT Support OS
│   └── ShareProjectButton.tsx          # Copy link and social share trigger
├── journey/
│   └── JourneySection.tsx              # Career progression timeline and achievements
├── skills/
│   └── SkillsSection.tsx               # Categorized skills matrix with proficiency ratings
├── research/
│   └── ResearchSection.tsx             # Academic research and whitepaper citations
├── contact/
│   └── ContactSection.tsx              # Inbound inquiry form with honeypot protection
├── faq/
│   └── FAQSection.tsx                  # Recruiter questions and answers accordion
├── command/
│   └── RecruiterCommandCenter.tsx      # Spotlight search modal (Ctrl+K)
├── assistant/
│   └── PortfolioAssistant.tsx          # Grounded AI chat drawer communicating with Groq
├── analytics/
│   └── PortfolioIntelligenceModal.tsx  # Authenticated administrator telemetry dashboard
├── candidate/
│   ├── ResumeUpload.tsx                # Drag-and-drop client-side PDF parser
│   ├── CandidateReview.tsx             # Candidate qualification review interface
│   ├── ApplicationPackageModal.tsx     # Tailored package editor & deterministic approval gate
│   ├── InterviewIntelligenceModal.tsx  # Company briefing & portfolio rehearsal coach
│   └── ApplicationKanbanBoard.tsx      # Governed application stage pipeline kanban board
└── common/
    ├── DynamicButton.tsx               # Context-aware action button
    ├── HoldToConfirmButton.tsx         # Progressive radial/linear fill button for sensitive actions
    ├── Tooltip.tsx                     # Zero-dependency hover tooltip
    ├── QRCodeSVG.tsx                   # In-memory SVG QR code renderer for mobile handoff
    ├── ErrorBoundary.tsx               # React error boundary catching render crashes
    ├── ThemeToggle.tsx                 # Sun/Moon mode toggle switch
    └── AvailabilityIndicator.tsx       # Live status badge (Immediate / Open to Offers)
```

---

## 2. Design Tokens & Styling Conventions

The UI follows the **STRATOS Management-Grade Design System**:
- **Typography**: Inter / system-ui sans-serif font family.
- **Color Palettes**:
  - **Dark Mode (Default)**: Deep slate backgrounds (`#0B0F19`), card surfaces (`#111827`), borders (`#1F2937`), accent blues (`#3B82F6`), emerald accents (`#10B981`).
  - **Light Mode**: Clean white/neutral-50 backgrounds, neutral-100 card surfaces, subtle slate borders (`#E2E8F0`).
- **Hierarchy Standard**:
  - `WHAT MATTERS` → Prominent headline metrics and executive summary badges.
  - `WHAT CHANGED` → Comparative deltas and waterfall step-downs.
  - `WHY` → Deep-dive case study modals and technical citations.
  - `WHAT TO DO NEXT` → One-click protected resume downloads and direct WhatsApp links.

