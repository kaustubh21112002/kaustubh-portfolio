# Architecture Decision Records (ADRs)

**Confidence:** [VERIFIED]

---

## ADR-001: Preservation of STRATOS DQ-10 as REVIEW
- **Date:** 2026-10-15
- **Status:** CONFIRMED & PERMANENT
- **Context:** Control totals in the 50,000-order retail transactional dataset exhibit Net Revenue > Gross Revenue due to unlinked promotional returns and refund clawbacks.
- **Decision:** Adhere to `PRESERVE → DOCUMENT → FLAG → GOVERN`. The discrepancy must remain permanently categorized as `REVIEW`. Under no circumstances will source numbers be imputed or altered to force mathematical balance.

---

## ADR-002: PhonePe Terminal Value Blended Methodology
- **Date:** 2026-10-18
- **Status:** CONFIRMED
- **Context:** FinTech multiples fluctuate significantly, and perpetuity growth in developing payment markets is subject to regulatory uncertainty.
- **Decision:** Formulate the base-case Terminal Value as an exact 50/50 arithmetic blend of Perpetuity Growth (7.0%) and Exit Multiple (13.15x EV/EBITDA), reconciling to Enterprise Value of ₹33,431.99 Cr.

---

## ADR-003: Pure Client-Side Single Page Application
- **Date:** 2026-10-20
- **Status:** CONFIRMED
- **Context:** High performance, instant transitions, and global edge CDN caching are required for executive recruiter engagement.
- **Decision:** Architect the site as a client-side React 18 SPA built with Vite and Tailwind CSS. Avoid heavy SSR frameworks; isolate dynamic backend interactions to a single stateless Vercel Serverless Function (`api/contact.ts`).

---

## ADR-004: Direct WhatsApp Click-to-Chat over Business API
- **Date:** 2026-11-01
- **Status:** CONFIRMED
- **Context:** Recruiter interaction requires an instant, familiar channel without adding backend complexity or recurring SaaS costs.
- **Decision:** Implement standard WhatsApp Click-to-Chat (`https://wa.me/918080001550?text=...`) natively in the Hero and Contact sections, avoiding server-side WhatsApp Business APIs.

