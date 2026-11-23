# Portfolio Intelligence OS — Privacy & Consent Specification

**Document Version:** 1.0.0  
**Status:** Architecture Policy Specification  
**Architecture:** Cookieless, First-Party Privacy-Preserving Telemetry  

---

## 1. Data Collection Purpose & Scope

The analytics system for `kaustubh-portfolio` is engineered strictly as a **first-party operational intelligence tool** to measure aggregate technical portfolio engagement, recruiter reach, and resume downloads.

### Core Non-Negotiable Invariants:
1. **Cookieless Operation:** Zero cookies are used for analytics tracking.
2. **Zero Persistent Visitor Tracking:** No visitor IDs, UUIDs, or fingerprints stored in `localStorage`, `sessionStorage`, or IndexedDB.
3. **Ephemeral Event Idempotency Only:** Each logical click/pageview generates a cryptographically random UUIDv4 at the instant of execution to allow server-side network deduplication (`ON CONFLICT (event_id) DO NOTHING`). It is not linked across events or sessions.
4. **Zero IP Address Storage:** Raw IP addresses are inspected exclusively in-memory for sliding-window rate limiting (60 events/minute) and immediately discarded. Never written to logs or PostgreSQL.
5. **Zero User Input Collection:** Form message bodies, job descriptions pasted into the analyzer, email addresses, and phone numbers are strictly scrubbed before payload validation.

---

## 2. Privacy Notice Requirements

A transparent privacy notice is presented to users detailing:
- The exact technical telemetry collected (page path, coarse referrer category, coarse device category, and UTC timestamp).
- That zero advertising pixels or third-party trackers (Google Analytics, Meta Pixel, Hotjar, etc.) are installed on the domain.
- The 90-day bounded retention policy for raw event records.

---

## 3. Consent Management Model

Although first-party cookieless analytics serving legitimate operational monitoring are generally exempt from ePrivacy cookie-consent requirements, best-practice user autonomy is supported:

### A. Preferences Architecture:
```typescript
export interface PrivacyPreferences {
  analyticsConsent: boolean;  // Enables/disables first-party anonymous telemetry
  marketingConsent: boolean;  // Strictly FALSE (zero marketing trackers exist)
  functionalConsent: boolean; // TRUE (theme state in localStorage)
  consentTimestamp: number;
}
```

### B. Controls & Behavior:
- **Accept All:** Records user preference. First-party operational telemetry continues.
- **Reject Analytics:** `trackAnalyticsEvent()` aborts immediately in the browser before generating payloads or dispatching `sendBeacon`/`fetch`.
- **Withdrawal:** Users can toggle preference at any time from the portfolio footer or settings modal. When disabled, telemetry stops immediately.

---

## 4. Data Retention & Deletion Specification

1. **Raw Events (`analytics_events`):**
   - Retained for a maximum of **90 days**.
   - Bounded cleanup batches (`purgeAgedRawEvents`, max 5,000 rows) delete raw events that have already been aggregated.
2. **Aggregated Summaries (`daily_analytics_summary`):**
   - Retained permanently as coarse, anonymized daily sums (page views, resume downloads, project view tallies).
   - Contains zero individual event timestamps, paths, or individual user signatures.

