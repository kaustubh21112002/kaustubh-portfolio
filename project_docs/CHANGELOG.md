# Project Changelog

All notable technical and architectural changes to this repository are documented in this log.

---

## [Phase 5.8] - 2026-11-01
### Added
- Created `CHANGE-SCOPE.md` at repository root defining strict change boundaries and reusable allowlists.
- Created `project_docs/` directory structure with 16 modular architecture, security, and governance files.
- Defined explicit 7-step reading order for AI coding agents.

## [Task 2] - 2026-11-01
### Added
- Integrated WhatsApp Click-to-Chat (`https://wa.me/918080001550`) in `HeroSection.tsx` and `ContactSection.tsx`.
- Implemented accessible aria labels, safe URL encoding, and responsive layout testing across 5 viewports.

## [Task 1] - 2026-11-01
### Added
- Created root-level `FILE-MAP.md` directory mapping repository entry points, functional modules, and reverse dependencies.

## [Phase 5.4 / 5.4.1] - 2026-10-31
### Added
- Centralized project metadata into `src/data/projects.json` with schema validation in `projectSchema.ts`.
- Integrated Recruiter `AvailabilityBlock.tsx` and dynamic `Last updated: <date>` footer calculation.
- Created custom static fallback at `public/404.html`.
- Implemented EquiTrack Analytics OS prototype case study record with status `"In progress"`.

## [Phase 5.3] - 2026-10-31
### Added
- Genuine viewport-deferred lazy loading for PhonePe DCF model via `DeferredFlagshipPhonePe.tsx` (`IntersectionObserver` with 200px margin).
- True route/component-level lazy loading for `CaseStudyModal` and `ProjectSummaryModal` in `ProjectsSection.tsx`.

## [Phase 5.1] - 2026-10-30
### Added
- Protected canonical resume PDF (`96,435 bytes`) with automated SHA-1 integrity guard in `scripts/generate_resume_pdf.mjs`.
- Configured GitHub Actions CI workflow in `.github/workflows/ci.yml`.

