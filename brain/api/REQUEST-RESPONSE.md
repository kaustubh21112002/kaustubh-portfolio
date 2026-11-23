# API Request & Response Contracts

> **Scope**: TypeScript types, validation schemas, and parsing error rules.  
> **Status**: `VERIFIED`

---

## 1. Analytics Telemetry Contract (`src/types/analytics.ts` & `server/lib/analyticsContract.ts`)

```typescript
export type EventType =
  | 'page_view'
  | 'project_view'
  | 'resume_download'
  | 'contact_click'
  | 'feedback_submit'
  | 'job_match_use';

export type ReferrerCategory = 'direct' | 'linkedin' | 'github' | 'search' | 'other';
export type DeviceCategory = 'desktop' | 'mobile' | 'tablet';

export interface AnalyticsPayload {
  eventType: EventType;
  path: string;
  projectId?: string;
  referrerCategory: ReferrerCategory;
  deviceCategory: DeviceCategory;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  normalizedPath?: string;
  errorMessage?: string;
}
```

---

## 2. Contact Inbound Schema (`api/contact.ts`)

```typescript
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  _gotcha?: string;
}

export interface ContactResponse {
  success: boolean;
  code: string;
  message: string;
}
```

---

## 3. Dashboard Metrics Schema (`api/analytics/dashboard/stats.ts`)

```typescript
export interface DashboardMetrics {
  totalEvents: number;
  pageViews: number;
  projectViews: number;
  resumeDownloads: number;
  contactClicks: number;
  conversionRate: number;
  deviceBreakdown: Record<string, number>;
  topProjects: Array<{ id: string; views: number }>;
}
```

