# Job Source Feasibility & Integration Analysis

**Document Version:** 1.0.1  
**Status:** Ingestion Feasibility Audit  
**Geography:** India & Global Remote  
**Policy:** Authorized APIs, Permitted Feeds, Public Career Portals & Manual Intake (Strict Anti-Scraping Compliance & Zero Automated DOM Extraction Claims)

---

## 1. Executive Principles & Regulatory Compliance

To protect the candidate's professional reputation, maintain operational integrity, and respect platform terms of service:
- **No Anti-Bot Bypassing:** The Copilot will never attempt to solve CAPTCHAs, defeat Cloudflare Turnstile, rotate residential proxies, or reverse-engineer private mobile APIs.
- **Clarification on URL Submissions:** A candidate submitting a job URL into the UI does **NOT** grant legal or technical license to perform automated DOM extraction or scrape restricted pages. Direct DOM extraction on aggregator pages (LinkedIn, Naukri, Indeed) is strictly avoided unless an authorized public endpoint exists.
- **Permitted Ingestion Methods:**
  1. **Primary Compliant Ingestion:** Direct user copy-paste of job title, company name, location, and description text into the Copilot ingestion modal.
  2. **Manual Document Upload:** Upload of raw job description text files or candidate-saved job summary documents.
  3. **Official ATS Board APIs:** Greenhouse, Lever, Ashby public JSON endpoints for target employer boards.
  4. **Open Syndicated Feeds:** RemoteOK, Himalayas, WWR public RSS/JSON feeds.
  5. **Candidate-Authorized Email Parsing:** Forwarded alert emails parsed in a private webhook.
- **Immediate Fallback Protocol:** Whenever URL metadata resolution fails, encounters a CAPTCHA/bot challenge, or is prohibited by robots.txt, the system gracefully falls back to prompt the candidate for direct text paste.

---

## 2. Independent Source Evaluations

### 2.1 LinkedIn

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **Restricted / Enterprise Only.** LinkedIn's Official Job Search APIs (Talent Solutions / Member Data APIs) are strictly gated for enterprise ATS partners; individual developer access is not provided. |
| **Access & Automation Restrictions** | Aggressive bot detection (Cloudflare + custom challenges). Headless browsing or unauthorized scraping violates LinkedIn User Agreement Section 8.2 and risks permanent personal profile ban. |
| **Authentication** | OAuth 2.0 (restricted scope). |
| **Data Freshness** | High (real-time). |
| **Permitted Discovery Method** | **1. Direct User Copy-Paste / Upload (Primary):** Candidate pastes job title, company, and description text directly into the Copilot modal.<br>**2. Authorized Email Alert Ingestion:** Candidate forwards official LinkedIn Job Alert emails to a dedicated copilot webhook; email body is parsed cleanly.<br>**3. User URL Reference:** User pastes a link for reference and canonical ID tracking (without automated DOM extraction). |
| **Fallback Strategy** | Immediate fallback to direct text paste if link metadata cannot be extracted via open graph headers. |
| **Risks & Limitations** | Scraping LinkedIn directly is strictly prohibited. Automated application dispatch via "Easy Apply" without enterprise partner API is unfeasible and unsafe. |

---

### 2.2 Naukri (Info Edge)

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **Enterprise Recruiter Only.** Naukri API (Zwayam / e-Hire) is strictly B2B for recruiters posting jobs, not for candidates pulling job streams. |
| **Access & Automation Restrictions** | Strict Akamai Bot Manager and rate limiting. Unauthorized scraping triggers immediate IP bans. |
| **Authentication** | B2B API Key (Recruiter accounts only). |
| **Data Freshness** | High for Indian Domestic Market (Bengaluru, Mumbai, Pune, NCR). |
| **Permitted Discovery Method** | **1. Direct User Copy-Paste / Upload (Primary):** Candidate pastes job description and requirements directly.<br>**2. Email Notification Parser:** Parses daily Naukri Job Mailer recommendations forwarded by the user.<br>**3. User URL Reference:** Stored for deep-linking candidate to apply page. |
| **Fallback Strategy** | Direct user manual text entry. |
| **Risks & Limitations** | No public developer feed. Ingestion must rely on candidate-mediated triggers. |

---

### 2.3 Company Career Pages (Direct ATS Platforms)

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Target ATS Providers** | **Greenhouse, Lever, Ashby, Workday, SmartRecruiters.** |
| **Official Integration** | **High Feasibility via Public Job Board APIs.**<br>- **Greenhouse:** Documented public JSON API: `https://boards-api.greenhouse.io/v1/boards/{company}/jobs`<br>- **Lever:** Documented public JSON API: `https://api.lever.co/v0/postings/{company}`<br>- **Ashby:** Public Job Board API: `https://api.ashbyhq.com/posting-api/job-board/{company}` |
| **Access Restrictions** | Permitted by ATS vendors for candidate-facing job discovery. Read-only, no CAPTCHA on board APIs. |
| **Authentication** | Zero authentication required for public job board feeds. |
| **Data Freshness** | Real-time canonical truth directly from the hiring employer. |
| **Permitted Discovery Method** | Scheduled polling (e.g. daily) of configured target company boards (e.g., top 100 high-growth fintechs, data platforms, and product companies in India & Remote). |
| **Fallback Strategy** | Fallback to candidate pasting single job link. |
| **Risks & Limitations** | Must maintain an active registry of target company ATS slugs (e.g., `phonepe`, `cred`, `swiggy`, `razorpay`). |

---

### 2.4 Indeed

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **Indeed Publisher API / RapidAPI feeds.** Indeed deprecated general candidate Publisher APIs in favor of enterprise employer tools. |
| **Access Restrictions** | Heavy Cloudflare bot detection on consumer search pages. Scraping web search pages violates Terms of Service. |
| **Authentication** | OAuth 2.0 / API Key where partner access is approved. |
| **Data Freshness** | Very High. |
| **Permitted Discovery Method** | **User-submitted URLs** or permitted syndicated RSS job alerts configured by the candidate. |
| **Fallback Strategy** | Direct candidate link submission. |
| **Risks & Limitations** | Unsanctioned scraping will lead to immediate IP rate limiting. |

---

### 2.5 Google Jobs

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **IndexNow / Job Posting Structured Data (Schema.org).** Google does not offer a free official "Search Jobs" consumer API. Custom Search JSON API can query structured `JobPosting` schema with strict daily quotas (100 free queries/day). |
| **Access Restrictions** | Scraping Google search results violates Google Terms of Service and triggers reCAPTCHA. |
| **Authentication** | Google Cloud API Key for Custom Search Engine (CSE). |
| **Data Freshness** | Aggregated daily. |
| **Permitted Discovery Method** | Configured Google Custom Search Engine querying targeted domains with structured schema: `site:boards.greenhouse.io OR site:jobs.lever.co "Business Analyst" India`. |
| **Fallback Strategy** | ATS direct board polling. |
| **Risks & Limitations** | Paid search queries beyond quota. Best used for targeted discovery sweeps rather than high-frequency polling. |

---

### 2.6 Wellfound (formerly AngelList Talent)

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **No Public Candidate Job Search API.** APIs are restricted to paying enterprise recruiting partners. |
| **Access Restrictions** | Cloudflare Turnstile protection on web listings. |
| **Authentication** | Enterprise Recruiter Token only. |
| **Data Freshness** | High for global startups and high-growth remote roles. |
| **Permitted Discovery Method** | **1. User URL Submission:** Candidate submits specific job link.<br>**2. Daily Alert Email Ingestion:** Parsing Wellfound job recommendation emails forwarded by the user. |
| **Fallback Strategy** | Candidate manual submission. |
| **Risks & Limitations** | Direct web scraping is blocked by Turnstile. |

---

### 2.7 Secondary Portals & Community Feeds (RemoteOK, Himalayas, Jobspresso)

| Dimension | Assessment & Evidence |
| :--- | :--- |
| **Official Integration** | **Open Public Feeds Available.**<br>- **RemoteOK:** Official public JSON API: `https://remoteok.com/api`<br>- **Himalayas:** Official public job feed / API.<br>- **We Work Remotely:** Official RSS feeds by category. |
| **Access Restrictions** | Permitted by operators provided rate limits (1 req / 5-15 mins) and Attribution headers are respected. |
| **Authentication** | None required for public syndicated feeds. |
| **Data Freshness** | High for remote roles matching IST or flexible timezones. |
| **Permitted Discovery Method** | Scheduled polling (every 6 hours) with cached ETag / `If-Modified-Since` headers. |
| **Fallback Strategy** | Skip cycle if feed is temporarily down. |
| **Risks & Limitations** | Lower volume for Indian domestic on-site roles; high value for international remote roles. |

---

## 3. Recommended Source Portfolio Matrix

| Source Category | Ingestion Mechanism | Automation Feasibility | Primary Value |
| :--- | :--- | :--- | :--- |
| **Tier 1 Company Career Pages** | Public ATS JSON APIs (Greenhouse, Lever, Ashby) | **Fully Automated (100% Permitted)** | Cleanest data, direct employer application, zero aggregator noise |
| **Remote Syndicate Feeds** | Official Public Feeds (RemoteOK, Himalayas RSS) | **Fully Automated (100% Permitted)** | High-quality global remote opportunities |
| **Candidate-Initiated Intake** | Single-URL Ingest & Parsing Tool in UI | **User-Initiated (100% Permitted)** | Any LinkedIn, Naukri, or Indeed posting the candidate spots |
| **Authorized Email Alerts** | Candidate Email Forwarding Webhook | **Semi-Automated (100% Permitted)** | Captures personalized algorithms from LinkedIn & Naukri without scraping |
| **Aggregator Web Scraping** | Headless Chrome scraping of search pages | **PROHIBITED** | Breaches ToS, triggers CAPTCHAs, high maintenance fragility |

