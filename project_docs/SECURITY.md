# Security & Governance Policies

**Confidence:** [VERIFIED]

---

## 1. HTTP Security Headers

Configured in [`vercel.json`](file:///vercel.json) for all routes (`/(.*)`):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

- **Clickjacking Defense:** `X-Frame-Options: DENY` prevents framing in malicious iframes.
- **MIME Confusion Defense:** `X-Content-Type-Options: nosniff` forces strict MIME adherence.
- **Privacy Preservation:** `Referrer-Policy: strict-origin-when-cross-origin` preserves privacy on external navigations.

---

## 2. Serverless Endpoint Defenses

Implemented in [`api/contact.ts`](file:///api/contact.ts):
- **Bot Mitigation (Honeypot):** Hidden input field `honeypot`. If submitted with any text, the endpoint immediately returns `200 OK` without dispatching to Slack.
- **In-Memory Rate Limiting:** Enforces a limit of 5 requests per 10-minute sliding window (`RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000`) per client IP, periodically pruning stale timestamps.
- **Payload Size & Sanitization:** Server caps message length at 2,000 characters (with client UI capping at 1,500 characters); name length is validated between 2 and 100 characters; email format is verified against RFC 5322 regex; JSON payload is strictly parsed.
- **Zero Echoing of Secrets:** Slack webhook URLs and tokens are loaded strictly via `process.env.SLACK_WEBHOOK_URL` and never rendered in client bundles.

Implemented in [`api/feedback.ts`](file:///api/feedback.ts):
- **Origin & Referer Domain Validation:** Strictly enforces origin validation across scheme, host, and port:
  - Canonical production domain: accepts exclusively `https://kaustubh-portfolio-six.vercel.app` (default port 443 only). Rejects `http://` or non-standard ports.
  - Active Preview deployments: matches exclusively against the trusted system runtime variable `process.env.VERCEL_URL` (scheme `https:`, standard port). Broad wildcard prefix matching is disabled.
  - Localhost: `localhost` and `127.0.0.1` are permitted exclusively when the environment is explicitly established as local development (`process.env.VERCEL !== '1'`, `!process.env.VERCEL_ENV`, and `process.env.NODE_ENV === 'development' | 'test'`). They are strictly rejected under Vercel Preview, Vercel Production, or ambiguous environments where `NODE_ENV` is missing or undefined.
  - Origin / Referer Precedence: `Origin` takes precedence; an invalid `Origin` cannot be bypassed with a valid `Referer`. All other domains, unrelated `*.vercel.app` deployments, malformed URLs, and missing origin/referer headers are rejected with `403 Forbidden`.
- **Bot Mitigation (Honeypot):** Hidden input field `honeypot` silently succeeds with `200 OK` without dispatching to Slack.
- **Best-Effort In-Memory Rate Limiting:** Enforces a limit of 3 submissions per hour per client IP (`RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000`). This in-memory state operates per warm serverless instance; it does not provide distributed database-backed rate limiting across disparate cold instances, but provides robust best-effort protection without external infrastructure costs.
- **Slack Mention Injection Prevention:** Sanitizes text to escape mrkdwn characters (`&`, `<`, `>`) and defangs broadcast mentions (`<!channel>`, `<!here>`, `<!everyone>`, `@everyone`, `@here`).
- **Zero Logging or Payload Exposure of IPs:** Visitor IP addresses, browser fingerprints, and webhook credentials are never logged or forwarded in Slack payloads.

---

## 3. Protected Asset Invariants

The executive resume PDF at [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) is strictly protected against automated overwrites:
- File Size: **96,435 bytes**
- SHA-1: `317857D88309548D9D05E8198FFBF8212C88470C`

