# External Integrations & Service Architecture

**Confidence:** [VERIFIED]

---

## 1. Slack Incoming Webhook (Contact Dispatcher & Feedback Widget)
- **Components:** [`api/contact.ts`](file:///api/contact.ts), [`api/feedback.ts`](file:///api/feedback.ts), [`.github/workflows/notify-slack.yml`](file:///.github/workflows/notify-slack.yml)
- **Protocol:** Outbound HTTPS POST to `SLACK_WEBHOOK_URL`
- **Workflow Triggers:** [`.github/workflows/notify-slack.yml`](file:///.github/workflows/notify-slack.yml) triggers on `push` to `main`, `deployment_status` (executed exclusively on `state == 'success'`), and manual `workflow_dispatch`.
- **Payload Format:** Formatted Slack Block Kit (`mrkdwn`) with inquiry or feedback assessment details, environment classification, and timestamps.
- **Fail-Safe Behavior:** If `SLACK_WEBHOOK_URL` is unconfigured, endpoints truthfully respond with `503 Service Unavailable`. If Slack returns a non-2xx status, they return `502 Bad Gateway` without claiming delivery succeeded.
- **Setup Requirements:**
  - **Vercel:** Add `SLACK_WEBHOOK_URL` in Project Settings -> Environment Variables for Preview and Production environments.
  - **GitHub Actions:** Add `SLACK_WEBHOOK_URL` as a repository secret under Settings -> Secrets and variables -> Actions.
  - *Status Note:* Slack notifications remain in standby mode until the repository owner adds `SLACK_WEBHOOK_URL` in Vercel and GitHub. Never commit incoming webhook URLs to the git repository.

---

## 2. WhatsApp Click-to-Chat
- **Components:** [`src/components/hero/HeroSection.tsx`](file:///src/components/hero/HeroSection.tsx), [`src/components/contact/ContactSection.tsx`](file:///src/components/contact/ContactSection.tsx)
- **Protocol:** Client-side HTTPS URI scheme (`https://wa.me/918080001550?text=...`)
- **Number Specification:** `918080001550` (International format without `+`, spaces, or dashes).
- **Backend Footprint:** Zero backend dependencies. Executes purely via standard browser deep-link redirection to WhatsApp Web or native mobile client.

---

## 3. Google Sheets / External Model Workbooks
- **Component:** [`src/data/projects.json`](file:///src/data/projects.json)
- **Protocol:** Outbound external verification links (`target="_blank"`, `rel="noopener noreferrer"`)
- **Artifacts Grounded:**
  - PhonePe DCF Model Workbook (Google Sheets)
  - STRATOS Retail Governance Workbook (Google Sheets)
  - EquiTrack Prototype Register (Google Sheets)

