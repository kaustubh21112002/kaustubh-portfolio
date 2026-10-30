# Portfolio Feature Audit & Capability Matrix

**Project:** Kaustubh Nandurkar — Business Analytics & Valuation Portfolio  
**Repository:** `C:\Users\kaust\OneDrive\Desktop\portfolio`  
**Live Website:** [https://kaustubh-portfolio-six.vercel.app/](https://kaustubh-portfolio-six.vercel.app/)  
**Baseline Commit:** `358457b`  
**Audit Date:** October 2026  
**Auditor:** Senior Frontend Engineer & Application Security Specialist  

---

## 1. Executive Summary

This evidence-based feature audit systematically evaluates all 20 requested capabilities against the active repository state and live production build. Features are categorized strictly by their verified empirical state in the codebase:
- **Existing and verified:** Fully functional, verified in source and browser.
- **Partially implemented:** Functional foundations exist, but specific user-facing or technical gaps remain.
- **Missing:** Not yet implemented in the codebase.
- **Not applicable yet:** Irrelevant to the current static portfolio architecture (e.g., passwords, invasive tracking).
- **Blocked by an external dependency:** Requires third-party infrastructure (e.g., serverless Slack webhooks).

---

## 2. 20-Feature Capability Matrix

| # | Feature | Status | Evidence / Relevant Component | Observed Behavior & Remaining Gap |
|---|---|---|---|---|
| 1 | **Dark mode toggle** | Missing | `src/index.css`, `tailwind.config.js` | Currently hardcoded dark theme (`#0b0d13`). No `darkMode: 'class'`, toggle control, or system preference listener. |
| 2 | **Cookie consent banner** | Not applicable yet | `package.json`, public headers | Zero third-party cookies or tracking scripts are deployed. Adding a cosmetic cookie banner without tracking violates privacy UX standards. |
| 3 | **Website search functionality** | Missing | `src/components/projects/ProjectsSection.tsx` | No interactive search or instant filter exists across public projects, research topics, or skills. |
| 4 | **Back-to-top button** | Partially implemented | `src/components/navigation/Header.tsx` (L132) | Logo click scrolls to top, but no dedicated floating scroll-to-top button appears when viewing deep sections. |
| 5 | **Responsive mobile menus** | Existing and verified | `src/components/navigation/Header.tsx` (L184–307) | Full-screen editorial mobile navigation (`01 About` to `07 Contact`) with keyboard trap, ESC close, and aria tags. |
| 6 | **Smooth loading animations** | Existing and verified | `src/index.css` (L20–31), `tailwind.config.js` | CSS transitions (`fadeIn`, smooth scroll), with strict `prefers-reduced-motion: reduce` overrides. |
| 7 | **Interactive hover states** | Existing and verified | All components | Cards, buttons, and navigation chips feature refined hover transitions, glow effects, and cursor feedback. |
| 8 | **Scroll progress indicator** | Existing and verified | `src/components/navigation/Header.tsx` (L110–119) | Fixed top progress bar rendering real-time scroll completion percentage with red gradient. |
| 9 | **One-click copy buttons** | Partially implemented | `src/components/contact/ContactSection.tsx` (L15, L32) | Email and formatted inquiry copy buttons exist with fallback; however, hero touchpoint lacks quick copy. |
| 10 | **Print-friendly stylesheets** | Missing | `src/index.css` | No `@media print` rules exist. Printing renders dark backgrounds, floating navigation, and video wrappers. |
| 11 | **Sticky navigation headers** | Existing and verified | `src/components/navigation/Header.tsx` (L122–130) | Fixed floating frosted pill header (`fixed top-5 z-50`) with backdrop blur and dynamic scroll shadow. |
| 12 | **Skip-to-content accessibility link** | Missing | `src/App.tsx`, `src/components/navigation/Header.tsx` | No keyboard skip link exists before header navigation to jump directly to `<main id="main-content">`. |
| 13 | **Password visibility toggle** | Not applicable yet | N/A | No password fields or authentication exist on this public portfolio. |
| 14 | **UTM tracking** | Not applicable yet | N/A | No marketing campaigns require invasive attribution tracking. Documented for future inquiry attribution. |
| 15 | **Form success states** | Existing and verified | `src/components/contact/ContactSection.tsx` (L334–353) | Clear dispatch notice and clipboard success banner ("Formatted message copied to clipboard"). |
| 16 | **Form error messages** | Existing and verified | `src/components/contact/ContactSection.tsx` (L240–245, L354) | Accessible `role="alert"` validation banner and interactive manual-copy fallback on clipboard failure. |
| 17 | **Confirmation popups** | Not applicable yet | N/A | Portfolio interactions are non-destructive. Routine confirmation dialogs would introduce unnecessary friction. |
| 18 | **Last-updated timestamps** | Partially implemented | `src/data/projects.ts`, `ContactSection.tsx` | Project dates exist (`Q3 2026`, `Q4 2025`); footer has year. No global "last verified / updated" metadata badge. |
| 19 | **Expandable FAQ sections** | Missing | `src/components/` | No structured FAQ answering recruiter questions regarding availability, methodology, or evidence access. |
| 20 | **Mobile-friendly interactions** | Existing and verified | `CaseStudyModal.tsx`, `HeroSection.tsx`, `Header.tsx` | All buttons $\ge 44\text{px}$, swipeable quick-jump chips with fade indicators, cursor glow disabled on touch. |

---

## 3. Prioritized Implementation Roadmap

Based on user requirements and architectural impact:

1. **Phase 2A — Light / Dark / System Theme Architecture (Highest Priority)**:
   - Configure Tailwind `darkMode: 'class'`.
   - Implement `ThemeProvider` with three states (`light`, `dark`, `system`), `localStorage` persistence, and zero-flash inline script.
   - Design an accessible theme switcher pill on desktop and mobile.
   - Refactor semantic background and surface tokens so the light theme provides crisp contrast and dark retains cinematic identity.

2. **Phase 2B — Navigation & Accessibility Polish**:
   - Add accessible "Skip to main content" link at the top of the DOM.
   - Add a subtle floating "Back to top" button visible after scrolling past the hero.

3. **Phase 2C — Copy & Feedback Polish**:
   - Add a one-click copy button with tooltip feedback to the Hero contact touchpoint.

4. **Phase 2D — Factual Recruiter FAQ, Search & Print Styles**:
   - Build an accessible, factual accordion FAQ answering common recruiter questions without inventing claims.
   - Build client-side fuzzy search dialog for projects, skills, and research with `⌘K` shortcut.
   - Add `@media print` rules ensuring clean, ink-friendly output.

---

## 4. Post-Implementation Verification & Resolution Register

Following Phase 2 implementation, the status of the upgraded features was empirically re-verified:

| Feature | Pre-Implementation Status | Final Verified Status | Implementation Resolution |
|---|---|---|---|
| **Dark mode toggle** | Missing | **Existing & Verified** | Built 3-state `ThemeProvider` (`light`, `dark`, `system`), zero-flash script in `index.html`, and `ThemeToggle` component with accessible radiogroup controls. |
| **Website search functionality** | Missing | **Existing & Verified** | Built `QuickSearchModal` indexing public projects, models, skills, and research with `Ctrl+K` / `Cmd+K` global hotkey. |
| **Back-to-top button** | Partially implemented | **Existing & Verified** | Added floating `BackToTop` component appearing at `window.scrollY > 450` with `prefers-reduced-motion` compliance. |
| **One-click copy buttons** | Partially implemented | **Existing & Verified** | Added instant email copy button with animated `Check` feedback alongside the Hero Contact CTA and in ContactSection. |
| **Print-friendly stylesheets** | Missing | **Existing & Verified** | Added `@media print` rules in `src/index.css` stripping floating navigation and enforcing ink-friendly black-on-white typography. |
| **Skip-to-content accessibility link** | Missing | **Existing & Verified** | Added WCAG 2.1 AA compliant skip-to-content link jumping directly to `<main id="main-content">`. |
| **Expandable FAQ sections** | Missing | **Existing & Verified** | Built `FAQSection` with 5 factual recruiter Q&A accordions linked to governed project evidence. |

