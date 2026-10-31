# Design System & UX Specification (DESIGN.md) — Kaustubh Nandurkar Portfolio

**Document Version:** 1.0.0  
**Status:** IMPLEMENTED & AUDITED  
**Design Philosophy:** Editorial Restraint, High-Information Density, Management-Grade Polish

---

## 1. Visual Identity & Design Principles

The design system is engineered for executive scanning, technical credibility, and analytical authority. It avoids generic aesthetic clutter, decorative 3D noise, and low-contrast minimalism in favor of structured financial journalism and clean data visualization.

### Core UX Principles
1. **What Matters → What Changed → Why → What to Do Next:** Every analytical case study answers this progression.
2. **Wireframe First, Information Hierarchy Always:** Every screen leads with the primary headline metric before breaking down technical mechanics.
3. **Restrained Color Palette:** Strict semantic color usage. Red is reserved for brand emphasis and critical flags; green/emerald for verified integrity; amber/yellow for active review states; neutral slate/zinc for structure and readability.
4. **Editorial Typography:** High-contrast serif and sans-serif pairing combining classical academic rigor with contemporary technical interfaces.

---

## 2. Color Tokens & Semantic Palette

Defined in `tailwind.config.js` and `src/index.css`:

### 2.1 Brand & Accent
- **Primary Brand Red (`#ed2026` / `rgb(237, 32, 38)`):** Character canvas background, primary brand accents, scroll progress gradient, active tab indicators.
- **Dark Accent Red (`#c8102e`):** Hover states, button gradients.

### 2.2 Surface & Background System
- **Dark Mode Surfaces:**
  - Base Background: `bg-[#0b0d13]` (Deep obsidian)
  - Card / Panel Surface: `bg-[#131620]` with border `border-slate-800/80`
  - Elevated / Modal Surface: `bg-[#181c2b]` with border `border-slate-700/60`
  - Subtle Hover Surface: `hover:bg-[#1c2236]`
- **Light Mode Surfaces:**
  - Base Background: `bg-[#f8fafc]` (Slate 50)
  - Card / Panel Surface: `bg-white` with border `border-slate-200`
  - Elevated / Modal Surface: `bg-[#ffffff]` with border `border-slate-300`

### 2.3 Semantic Evidence & Status Badges
- **Verified / Production (`EMERALD`):** `text-emerald-400 bg-emerald-500/10 border-emerald-500/20`
- **Active Review / Flagged (`AMBER`):** `text-amber-400 bg-amber-500/10 border-amber-500/20` (Strictly applied to `DQ-10 REVIEW`)
- **Prototype / Research (`BLUE` / `CYAN`):** `text-cyan-400 bg-cyan-500/10 border-cyan-500/20`
- **Neutral / Structural (`SLATE`):** `text-slate-400 bg-slate-800/50 border-slate-700/40`

---

## 3. Typography & Hierarchy

- **Primary Display & Headings:** `font-serif` (`Playfair Display`, `Georgia`, serif) for executive section headers and editorial titling.
- **Body & Structural UI:** `font-sans` (`Inter`, system sans-serif) for high scannability, tabular metrics, and form inputs.
- **Monospace & Code Data:** `font-mono` (`JetBrains Mono`, `Fira Code`, monospace) for financial figures, cell coordinates (e.g. `Cell C13`), formulas, and code snippets.

### Scale
- **Display 1 (Hero Title):** `text-4xl md:text-6xl font-bold tracking-tight`
- **Section Heading (H2):** `text-2xl md:text-3xl font-serif font-bold`
- **Component Subheading (H3):** `text-lg md:text-xl font-semibold`
- **Body Copy:** `text-sm md:text-base leading-relaxed text-slate-300 dark:text-slate-300 light:text-slate-700`
- **Micro-Copy & Badges:** `text-xs uppercase tracking-wider font-mono`

---

## 4. Theme System & Anti-Flash Architecture

Implemented in `src/context/ThemeContext.tsx` and `index.html`:
- **3 Modes:** `light`, `dark`, and `system`.
- **Zero-Flash Execution:** An inline script executes in `<head>` before the DOM renders to read `localStorage.getItem('portfolio-theme')` or evaluate `window.matchMedia('(prefers-color-scheme: dark)')`.
- **Dynamic Transition Prevention:** The script adds a temporary `.disable-transitions` class on theme swap to prevent jarring CSS layout flashing.

---

## 5. Layout, Spacing & Breakpoints

- **Mobile Viewport:** `375px` to `430px` (Full bleed sections, horizontal scroll chips for filters, 44px min tap targets).
- **Tablet Viewport:** `768px` (2-column grids for project explorer, responsive telemetry wrapping).
- **Desktop Viewport:** `1024px` to `1440px` (Max-width `max-w-7xl`, 3-column project cards, side-by-side waterfall charts).
- **Horizontal Overflow Containment:** Controlled via `overflow-x: clip` and `max-width: 100vw` in `src/index.css`.

---

## 6. Accessibility & Motion Guidelines

- **Focus Rings:** High-visibility outline: `focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none`.
- **Motion Reduction:** All CSS transitions and canvas animations are disabled when `prefers-reduced-motion: reduce` is active.
- **Dialog Ergonomics:** Modals feature focus trapping, backdrop blur, explicit close triggers, and `Escape` key listeners.

---

## 7. Cross References
- Requirements: [`PRD.md`](file:///PRD.md)
- Architectural Implementation: [`ARCHITECTURE.md`](file:///ARCHITECTURE.md)
- Decisions: [`DECISIONS.md`](file:///DECISIONS.md)

