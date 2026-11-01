# Verification Suites & Testing Protocols

**Confidence:** [VERIFIED]

---

## 1. Automated Test Suites Catalog

| Script | Purpose | Test Count | Execution Command |
| :--- | :--- | :--- | :--- |
| `scripts/test_valuation_math.mjs` | Verifies DCF calculations, WACC sensitivity matrix, TV methods | **22/22** [VERIFIED] | `node scripts/test_valuation_math.mjs` |
| `scripts/test_contact_api.mjs` | Tests serverless endpoint validation, honeypot, rate limiting, Slack error handling | **9/9** [VERIFIED] | `node scripts/test_contact_api.mjs` |
| `scripts/test_projects_json_schema.mjs` | Validates schema conformance of `projects.json`, date sorting, duplicate IDs | **6/6** [VERIFIED] | `node scripts/test_projects_json_schema.mjs` |
| `scripts/test_shareable_urls.mjs` | Headless Chrome audit of project query parameter deep links | **6/6** [VERIFIED] | `node scripts/test_shareable_urls.mjs` |
| `scripts/verify_viewports_responsive.mjs` | Verifies horizontal overflow across 375, 430, 768, 1024, 1440px | **5/5** [VERIFIED] | `node scripts/verify_viewports_responsive.mjs` |

---

## 2. CI Automation Workflow (.github/workflows/ci.yml)

The repository defines an automated continuous integration pipeline in [`.github/workflows/ci.yml`](file:///c:/Users/kaust/OneDrive/Desktop/portfolio/.github/workflows/ci.yml) triggered on pushes and pull requests to `main` and `feature/**` branches. The workflow runs on `ubuntu-latest` with Node.js 20.x and executes the following sequence:

1. **Repository Checkout & Node Setup:** Checks out code using `actions/checkout@v4` and configures Node.js 20.x with npm dependency caching.
2. **Clean Dependency Installation:** Executes `npm ci` to install pinned dependencies.
3. **Chrome / Chromium Browser Verification:** Confirms availability of Chrome or installs Chromium for headless Chrome DevTools Protocol (CDP) testing.
4. **Pre-Build Canonical Resume Verification:** Asserts that [`public/Kaustubh_Nandurkar_Resume.pdf`](file:///public/Kaustubh_Nandurkar_Resume.pdf) is intact: exactly **96,435 bytes** with SHA-1 `317857D88309548D9D05E8198FFBF8212C88470C`.
5. **TypeScript Validation:** Runs `npm run typecheck` to validate both client app (`tsconfig.json`) and serverless API (`tsconfig.api.json`).
6. **Valuation Math Verification:** Executes `node scripts/test_valuation_math.mjs` (22/22 tests).
7. **Contact API Contract Verification:** Executes `node scripts/test_contact_api.mjs` (9/9 tests).
8. **Production Build:** Executes `npm run build`.
9. **Post-Build Resume Invariance Verification:** Verifies that the build process did not mutate or replace the canonical resume PDF with a generated review file.
10. **Headless Preview & Deep-Link Verification:** Starts `npx vite preview --port 4173 --host 127.0.0.1` in the background, waits for HTTP health response via curl polling, registers an EXIT trap (`kill -9 $PREVIEW_PID`) to guarantee server termination, and runs `node scripts/test_shareable_urls.mjs` (6 canonical project deep-link tests).

---

## 3. Mandatory Local Verification Order After Changes

```
Step 1: npm run typecheck
        (Compiles client app and serverless function without emitting files)

Step 2: npm run build
        (Verifies production bundle, chunk distribution, asset output)

Step 3: node scripts/test_valuation_math.mjs
        (22/22 pass required)

Step 4: node scripts/test_contact_api.mjs
        (9/9 pass required)

Step 5: node scripts/test_projects_json_schema.mjs
        (6/6 pass required)

Step 6: powershell -Command "Get-FileHash public/Kaustubh_Nandurkar_Resume.pdf -Algorithm SHA1"
        (Must match 317857D88309548D9D05E8198FFBF8212C88470C)
```

