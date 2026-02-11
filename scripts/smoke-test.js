#!/usr/bin/env node
/**
 * Smoke tests for deployed application.
 * Usage: node scripts/smoke-test.js [BASE_URL]
 * Example: node scripts/smoke-test.js https://arko-calculator-backend.railway.app
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (err) {
    console.error(`❌ ${name}:`, err.message);
    return false;
  }
}

async function run() {
  console.log(`\nSmoke testing: ${BASE_URL}\n`);

  let passed = 0;
  let failed = 0;

  // 1. Health check
  const healthOk = await test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Invalid response: ${JSON.stringify(data)}`);
  });
  healthOk ? passed++ : failed++;

  // 2. POST /api/calculate with valid input
  const calculateOk = await test('POST /api/calculate (valid input)', async () => {
    const res = await fetch(`${BASE_URL}/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carValue: 50000,
        monthlyRent: 2200,
        interestRateMonth: 0.015,
        financingTermMonths: 48,
        analysisPeriodMonths: 48,
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (!data.cashPurchase?.totalCost) throw new Error('Missing cashPurchase.totalCost');
    if (!data.financedPurchase?.totalCost) throw new Error('Missing financedPurchase.totalCost');
    if (!data.rental?.totalCost) throw new Error('Missing rental.totalCost');
    if (!data.breakEven) throw new Error('Missing breakEven');
  });
  calculateOk ? passed++ : failed++;

  // 3. POST /api/calculate with invalid input (expect 400)
  const validationOk = await test('POST /api/calculate (invalid input → 400)', async () => {
    const res = await fetch(`${BASE_URL}/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carValue: -1 }), // invalid
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });
  validationOk ? passed++ : failed++;

  // 4. POST /api/calculate-timeline (optional - chart data)
  const timelineOk = await test('POST /api/calculate-timeline', async () => {
    const res = await fetch(`${BASE_URL}/api/calculate-timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carValue: 50000,
        monthlyRent: 2200,
        interestRateMonth: 0.015,
        financingTermMonths: 48,
        analysisPeriodMonths: 48,
      }),
    });
    if (res.status === 404) {
      // Endpoint may not exist in older deployments
      console.warn('  (calculate-timeline not found - skipping)');
      return;
    }
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.timeline?.length) throw new Error('Missing or empty timeline');
  });
  timelineOk ? passed++ : failed++;

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
