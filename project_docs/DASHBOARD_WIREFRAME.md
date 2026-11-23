# Portfolio Intelligence OS — Dashboard Wireframe & Analytics Specification

**Document Version:** 1.0.0  
**Status:** Governed Analytics Specification  
**Architecture:** Privacy-Preserving First-Party Telemetry  

---

## 1. Design Principles & Governing Philosophy

- **Structure:** `WHAT MATTERS → WHAT CHANGED → WHY → WHAT TO DO NEXT`
- **Palette:** Neutral-first, restrained dark theme aligned with STRATOS design tokens.
- **Data Integrity:** Honest metric reporting. Clicks represent user engagement/intent, not confirmed conversations. Unavailable historical data is explicitly labeled as `Unspecified` or `Unconfigured`.
- **Zero Fabrication:** No synthetic benchmarks, fake conversion rates, or speculative traffic projections.
- **Privacy Core:** Cookieless, zero persistent visitor IDs, zero third-party pixels.

---

## 2. Layout Wireframe & Reading Flow

```text
+--------------------------------------------------------------------------------------------------+
| PORTFOLIO INTELLIGENCE OS • PRIVATE TELEMETRY                   [● ACTIVE PERSISTENT] [LOGOUT]  |
| First-party, privacy-governed engagement tracking and decision telemetry.                        |
+--------------------------------------------------------------------------------------------------+
| SECTION 1: WHAT MATTERS (One Dominant Executive Insight & Health Status)                         |
| +----------------------------------------------------------------------------------------------+ |
| | DOMINANT INSIGHT: Verified engagement rose 34% this week led by PhonePe DCF model downloads.   |
| | Pipeline Status: Active Persistent • Retention: 90-Day Bounded Rollup • 0 Cookies Stored      | |
| +----------------------------------------------------------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 2: ACQUISITION OVERVIEW & ENGAGEMENT KPIS                                                |
| [ TOTAL SESSIONS ]      [ RESUME DOWNLOADS ]    [ ENGAGEMENT ACTIONS ]  [ TRAFFIC QUALITY ]      |
|      1,420                    184                      96                      98.2%             |
| (+12% vs prior 7d)      (12.9% click rate)       (WhatsApp/Email/Match)   (Verified Human)       |
+--------------------------------------------------------------------------------------------------+
| SECTION 3: WHAT CHANGED (Activity Over Time & Project Performance)                               |
| +-----------------------------------------------+ +--------------------------------------------+ |
| | 30-Day Daily Activity Timeline               | | Flagship Project Popularity Table          | |
| | [Bar Chart: Page Views vs Action Clicks]      | | 1. PhonePe DCF Valuation      (48% share)  | |
| |                                               | | 2. STRATOS Governance          (24% share)  | |
| |                                               | | 3. Spiideo Sports Analytics    (14% share)  | |
| +-----------------------------------------------+ +--------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 4: WHY (Campaign Attribution & Traffic Quality Breakdown)                                |
| +-----------------------------------------------+ +--------------------------------------------+ |
| | Validated Campaign Attribution (UTM Sources) | | Traffic Quality & Automated Bot Filters    | |
| | • linkedin / direct_message: 54%              | | • Verified Human Traffic: 1,394 (98.2%)    | |
| | • email / recruiter_outreach: 28%             | | • Automated Crawlers Filtered: 26 (1.8%)   | |
| | • github / readme: 18%                        | | • Duplicate Events Deduped: 14             | |
| +-----------------------------------------------+ +--------------------------------------------+ |
+--------------------------------------------------------------------------------------------------+
| SECTION 5: WHAT TO DO NEXT (Actionable Executive Recommendations)                               |
| [Recommendation 1] Highlight PhonePe sensitivity table on LinkedIn as top driver of recruiter views |
| [Recommendation 2] Add utm_campaign=q4_outreach to outbound emails to track recruitment cohorts|
+--------------------------------------------------------------------------------------------------+
| SECTION 6: PRIVACY, RETENTION & SYSTEM BOUNDARIES                                                |
| Cookieless Storage: TRUE • Raw Retention: 90 Days Bounded • Host Perimeter: Strict Allowlist     |
+--------------------------------------------------------------------------------------------------+
```

---

## 3. Metric Definitions & Formulas

| Metric | Source Field | Definition | Caveats / Governance Rules |
| :--- | :--- | :--- | :--- |
| **Total Ingested Events** | `COUNT(*)` in `analytics_events` | Total raw events captured in current retention window. | Includes page views and interactive actions. |
| **Page Views** | `event_name = 'page_view'` | Total loads of portfolio pages. | Deduplicated via UUIDv4 eventId. |
| **Resume Click Rate** | `resume_downloads / page_views` | Percentage of page sessions that triggered a resume PDF download. | Intent-based metric; does not guarantee PDF viewing. |
| **Contact Intent Clicks** | `whatsapp_click + email_click + contact_click` | Sum of outbound recruiter engagement CTAs clicked. | Represents intent/click; does NOT represent confirmed conversations. |
| **Job Match Uses** | `event_name = 'job_match_use'` | Invocations of the local JD Match Analyzer tool. | Zero job description text transmitted. |
| **Campaign Attribution** | `campaign.utmSource`, `utmMedium` | Distribution of arrivals via validated query parameters. | Memory-only session tracking. Raw click IDs forbidden. |
| **Verified Human %** | `verified_human / total_events` | Traffic passing bot/crawler heuristic filtering. | Crawlers filtered by User-Agent allowlist. |

