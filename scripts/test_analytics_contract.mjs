import assert from 'assert';
import { validateAnalyticsPayload } from '../api/lib/analyticsContract.js';
import { getAnalyticsStorage } from '../api/lib/analyticsStorage.js';
import { formatDailyAggregateRow, syncDailyAggregatesToSheets } from '../api/lib/sheetsSync.js';
import collectHandler from '../api/analytics/collect.js';
import statsHandler from '../api/analytics/stats.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
  }
}

async function itAsync(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
  }
}

console.log('--- Test Suite 1: Analytics Contract & Schema Validation ---');

it('validates a correct page_view event', () => {
  const payload = {
    eventType: 'page_view',
    timestamp: Date.now(),
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  };
  const res = validateAnalyticsPayload(payload);
  assert.strictEqual(res.isValid, true);
});

it('validates a correct project_view event with governed projectId', () => {
  const payload = {
    eventType: 'project_view',
    timestamp: Date.now(),
    path: '/?project=phonepe-valuation',
    referrerCategory: 'social',
    deviceCategory: 'mobile',
    projectId: 'phonepe-valuation'
  };
  const res = validateAnalyticsPayload(payload);
  assert.strictEqual(res.isValid, true);
});

it('rejects an invalid eventType', () => {
  const payload = {
    eventType: 'user_tracking_click',
    timestamp: Date.now(),
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  };
  const res = validateAnalyticsPayload(payload);
  assert.strictEqual(res.isValid, false);
  assert(res.error.includes('Invalid or unsupported eventType'));
});

it('rejects timestamps with excessive future skew', () => {
  const payload = {
    eventType: 'page_view',
    timestamp: Date.now() + 48 * 60 * 60 * 1000,
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  };
  const res = validateAnalyticsPayload(payload);
  assert.strictEqual(res.isValid, false);
  assert(res.error.includes('outside acceptable time window'));
});

it('rejects forbidden PII fields (email, phone, ip, rawIp, message)', () => {
  const fields = ['email', 'phone', 'ip', 'rawIp', 'message', 'jobDescription', 'fingerprint'];
  for (const f of fields) {
    const payload = {
      eventType: 'contact_click',
      timestamp: Date.now(),
      path: '#contact',
      referrerCategory: 'direct',
      deviceCategory: 'desktop',
      [f]: 'some_sensitive_value'
    };
    const res = validateAnalyticsPayload(payload);
    assert.strictEqual(res.isValid, false, `Field ${f} should have been rejected`);
    assert(res.error.includes('Forbidden field present in payload'));
  }
});

it('rejects non-relative or protocol-laden paths', () => {
  const payload = {
    eventType: 'page_view',
    timestamp: Date.now(),
    path: 'https://malicious-site.com/steal',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  };
  const res = validateAnalyticsPayload(payload);
  assert.strictEqual(res.isValid, false);
  assert(res.error.includes('must be a relative path'));
});

console.log('\n--- Test Suite 2: Storage Abstraction & Diagnostic Aggregation ---');

await itAsync('records events and computes aggregated daily metrics without fabrication', async () => {
  const storage = getAnalyticsStorage();
  const now = Date.now();
  await storage.recordEvent({
    eventType: 'page_view',
    timestamp: now,
    path: '/',
    referrerCategory: 'direct',
    deviceCategory: 'desktop'
  });
  await storage.recordEvent({
    eventType: 'project_view',
    timestamp: now,
    path: '/?project=stratos-governance',
    referrerCategory: 'social',
    deviceCategory: 'mobile',
    projectId: 'stratos-governance'
  });
  await storage.recordEvent({
    eventType: 'resume_download',
    timestamp: now,
    path: '/Kaustubh_Nandurkar_Resume.pdf',
    referrerCategory: 'search',
    deviceCategory: 'desktop'
  });

  const summary = await storage.getSummary();
  assert.strictEqual(summary.status, 'UNCONFIGURED_STORAGE');
  assert.strictEqual(summary.isPersistent, false);
  assert.strictEqual(summary.storageBackend, 'memory_transient_diagnostic');
  assert(summary.dailyAggregates.length >= 1);

  const todayStr = new Date(now).toISOString().split('T')[0];
  const dayMetric = summary.dailyAggregates.find((d) => d.date === todayStr);
  assert(dayMetric, 'Today metrics must exist');
  assert(dayMetric.pageViews >= 1);
  assert(dayMetric.projectViews >= 1);
  assert(dayMetric.resumeDownloads >= 1);
  assert(dayMetric.topProjects.some((p) => p.projectId === 'stratos-governance'));
});

console.log('\n--- Test Suite 3: Google Sheets Idempotent Adapter ---');

it('formats governed 9-column daily aggregate row cleanly', () => {
  const sampleDay = {
    date: '2026-11-05',
    pageViews: 12,
    projectViews: 5,
    resumeDownloads: 2,
    contactClicks: 1,
    whatsappClicks: 1,
    emailClicks: 0,
    jobMatchUses: 3,
    topProjects: [{ projectId: 'stratos-governance', count: 3 }],
    referrers: { search: 4, direct: 6, social: 2 },
    devices: { desktop: 10, mobile: 2 }
  };

  const row = formatDailyAggregateRow(sampleDay);
  assert.strictEqual(row.length, 9);
  assert.strictEqual(row[0], '2026-11-05');
  assert.strictEqual(row[1], 12);
  assert.strictEqual(row[2], 'N/A (Cookieless)');
  assert.strictEqual(row[3], 5);
  assert.strictEqual(row[4], 2);
  assert.strictEqual(row[5], 1);
  assert.strictEqual(row[6], 1);
  assert.strictEqual(row[7], 0);
  assert.strictEqual(row[8], 'direct'); // Top referrer
});

await itAsync('reports STANDBY_UNCONFIGURED gracefully when credentials are not configured', async () => {
  const res = await syncDailyAggregatesToSheets([
    {
      date: '2026-11-05',
      pageViews: 10,
      projectViews: 2,
      resumeDownloads: 1,
      contactClicks: 0,
      whatsappClicks: 0,
      emailClicks: 0,
      jobMatchUses: 1,
      topProjects: [],
      referrers: { direct: 10 },
      devices: { desktop: 10 }
    }
  ]);
  assert.strictEqual(res.status, 'STANDBY_UNCONFIGURED');
  assert.strictEqual(res.syncedRowsCount, 0);
  assert(res.message.includes('standby'));
  assert.strictEqual(res.payloadSummary.length, 1);
});

console.log('\n--- Test Suite 4: Ingestion & Aggregation Route Guards ---');

await itAsync('rejects non-POST methods on /api/analytics/collect with 405', async () => {
  let statusCode = 0;
  let responseData = null;
  const mockReq = { method: 'GET', headers: {} };
  const mockRes = {
    setHeader: () => mockRes,
    status: (c) => { statusCode = c; return mockRes; },
    json: (d) => { responseData = d; return mockRes; },
    end: () => {}
  };

  await collectHandler(mockReq, mockRes);
  assert.strictEqual(statusCode, 405);
  assert.strictEqual(responseData.code, 'METHOD_NOT_ALLOWED');
});

await itAsync('blocks unauthenticated requests to /api/analytics/stats with 503 or 401', async () => {
  let statusCode = 0;
  let responseData = null;
  const mockReq = { method: 'GET', headers: {} };
  const mockRes = {
    setHeader: () => mockRes,
    status: (c) => { statusCode = c; return mockRes; },
    json: (d) => { responseData = d; return mockRes; },
    end: () => {}
  };

  await statsHandler(mockReq, mockRes);
  // Without PORTFOLIO_INTELLIGENCE_KEY in env, returns 503 AUTH_UNCONFIGURED
  assert(statusCode === 503 || statusCode === 401);
  assert(responseData.code === 'AUTH_UNCONFIGURED' || responseData.code === 'UNAUTHORIZED');
});

console.log(`\n========================================`);
console.log(`Analytics OS Test Suite: ${passed}/${total} passed`);
console.log(`========================================`);

if (passed !== total) {
  process.exit(1);
}

