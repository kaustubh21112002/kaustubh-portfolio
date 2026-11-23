# External Service Integrations & Cloud Bridges

> **Scope**: Integration contracts with Neon, Groq Cloud, Slack Webhooks, and WhatsApp.  
> **Status**: `VERIFIED`

---

## 1. Neon Serverless PostgreSQL

- **Integration Mode**: Direct SQL over HTTPS via `@neondatabase/serverless`.
- **Environment Dependency**: `DATABASE_URL` (Format: `postgresql://user:pass@host/neondb?sslmode=require`).
- **Resilience**: The query handler wraps database calls in `try/catch` blocks, gracefully returning HTTP `503 STORAGE_UNAVAILABLE` rather than crashing the lambda process when cold starts or networking glitches occur.

---

## 2. Groq Cloud AI Inference (`llama-3.3-70b-versatile`)

- **Integration Mode**: OpenAI-compatible chat completion streaming API (`https://api.groq.com/openai/v1/chat/completions`).
- **Environment Dependency**: `GROQ_API_KEY`.
- **Parameters**:
  - `model`: `llama-3.3-70b-versatile`
  - `temperature`: `0.2` (Low temperature for grounded, non-hallucinatory output)
  - `max_tokens`: `1024`
  - `stream`: `true`
- **Fallback Handling**: If `GROQ_API_KEY` is absent or the Groq API returns non-200, `/api/assistant` emits a static, helpful offline response rather than failing abruptly.

---

## 3. Slack Webhooks Dispatcher

- **Integration Mode**: HTTPS POST dispatching Slack Block Kit JSON payloads.
- **Environment Dependency**: `SLACK_WEBHOOK_URL`.
- **Payload Format**:
  ```json
  {
    "text": "New Recruiter Inquiry from Alex Mercer",
    "blocks": [
      {
        "type": "header",
        "text": { "type": "plain_text", "text": "📬 New Portfolio Inquiry" }
      },
      {
        "type": "section",
        "fields": [
          { "type": "mrkdwn", "text": "*Name:*\nAlex Mercer" },
          { "type": "mrkdwn", "text": "*Email:*\nalex.mercer@fintech.com" }
        ]
      },
      {
        "type": "section",
        "text": { "type": "mrkdwn", "text": "*Message:*\n..." }
      }
    ]
  }
  ```

---

## 4. WhatsApp Direct Click-to-Chat

- **Integration Mode**: Client-side hyperlink using the WhatsApp universal API.
- **Invariant Link**: `https://wa.me/918080001550`
- **Pre-filled Text**: Encoded inquiry string directing recruiters to direct communication.

