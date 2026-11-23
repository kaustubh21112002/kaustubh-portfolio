# Frontend State Management & Multi-Tab Synchronization

> **Scope**: Reactive state architecture, Context API, multi-tab broadcast channels, and local storage patterns.  
> **Status**: `VERIFIED`

---

## 1. State Topology Overview

The application enforces a **Localized & Isolated State Architecture**. Global state is kept intentionally minimal to prevent unnecessary root re-renders.

```
[Global Scope: ThemeContext]
       │ (Dark / Light Mode, Syncs across tabs via storage events)
       │
[Page Scope: App.tsx]
       ├── Active Modal ID (CaseStudyModal, CommandCenter, AdminDashboard, etc.)
       └── Mobile Navigation Drawer Open / Closed State
       │
[Feature Scope: Local Component State]
       ├── FlagshipPhonePe: WACC, Terminal Growth, Selected Scenario, Terminal Method
       ├── PortfolioIntelligenceModal: Auth state, Passphrase input, Telemetry filters
       ├── PortfolioAssistant: Message history, Input text, Streaming status
       └── CandidateReview: Parsed claims, Score breakdown, Filter criteria
```

---

## 2. Multi-Tab Synchronization Mechanics

The platform synchronizes state across browser tabs using native browser APIs without external socket dependencies:

1. **Theme Synchronization**:
   - `ThemeContext.tsx` listens to the native `window.addEventListener('storage', ...)` event.
   - When a user changes the theme in Tab A, Tab B automatically catches the `portfolio_theme` key update and applies the corresponding CSS classes (`dark` / `light`) immediately.
2. **Admin Logout Broadcast**:
   - When an administrator logs out in `PortfolioIntelligenceModal.tsx`, a broadcast signal is emitted via `localStorage.setItem('admin_logout_signal', Date.now().toString())`.
   - Other open tabs detect the signal and automatically lock the intelligence modal, terminating the local session without requiring a manual page refresh.
3. **Candidate Claims Sandboxing (Phase 8)**:
   - Candidate resumes and parsed claims are stored exclusively in `sessionStorage`.
   - `sessionStorage` is strictly scoped to the active browser tab, ensuring candidate data cannot leak across unrelated tabs or persist after the browser tab is closed.

