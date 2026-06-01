/**
 * Playwright API tests — Member endpoints
 *
 * Demonstrates how to use health-data-faker with Playwright's APIRequestContext.
 * Replace BASE_URL with your actual API base URL before running.
 *
 * Run:  npx playwright test examples/playwright/api-member.spec.js
 */

import { test, expect } from '@playwright/test';
import { memberPayload } from './helpers/payloads.js';
import { validateMember } from '../../src/index.js';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

// ─── POST /api/members ────────────────────────────────────────────────────────

test.describe('POST /api/members', () => {

  test('creates a member with fully random data', async ({ request }) => {
    const payload = memberPayload();

    const { valid, errors } = validateMember(payload);
    expect(valid, `Payload invalid: ${errors.join(', ')}`).toBe(true);

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      memberId:     payload.memberId,
      policyNumber: payload.policyNumber,
      status:       payload.status,
    });
  });

  test('creates an Active member and confirms eligibility', async ({ request }) => {
    const payload = memberPayload({ status: 'Active' });

    expect(payload.eligibility.isEligible).toBe(true);
    expect(payload.eligibility.reason).toBe('Active coverage');

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.eligibility.isEligible).toBe(true);
  });

  test('creates a Terminated member and confirms ineligibility', async ({ request }) => {
    const payload = memberPayload({ status: 'Terminated' });

    expect(payload.eligibility.isEligible).toBe(false);

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.eligibility.isEligible).toBe(false);
    expect(body.eligibility.reason).toBe('Coverage terminated');
  });

  test('creates a member with a specific insurance plan', async ({ request }) => {
    const plan = { name: 'Aetna Premier', type: 'PPO', tier: 'Platinum', provider: 'Aetna' };
    const payload = memberPayload({ plan, status: 'Active' });

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.plan.name).toBe('Aetna Premier');
    expect(body.plan.tier).toBe('Platinum');
  });

  test('creates a member with a fixed effective date for date-range testing', async ({ request }) => {
    const payload = memberPayload({
      effectiveDate: '2023-01-01',
      status:        'Active',
    });

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).effectiveDate).toBe('2023-01-01');
  });

  test('returns 400 for a missing required field', async ({ request }) => {
    const payload = memberPayload();
    delete payload.plan;

    const response = await request.post(`${BASE_URL}/api/members`, {
      data: payload,
    });

    expect(response.status()).toBe(400);
  });

  test('bulk-creates one member per status type', async ({ request }) => {
    const statuses = ['Active', 'Inactive', 'Terminated', 'Pending', 'Suspended'];

    for (const status of statuses) {
      const payload  = memberPayload({ status });
      const response = await request.post(`${BASE_URL}/api/members`, { data: payload });
      expect(response.status()).toBe(201);
    }
  });

});

// ─── Sample payloads (printed, not sent) ─────────────────────────────────────

test('show sample member payloads in report', async () => {
  const defaultPayload    = memberPayload();
  const activePayload     = memberPayload({ status: 'Active' });
  const terminatedPayload = memberPayload({ status: 'Terminated' });

  console.log('Default member:\n',    JSON.stringify(defaultPayload,    null, 2));
  console.log('Active member:\n',     JSON.stringify(activePayload,     null, 2));
  console.log('Terminated member:\n', JSON.stringify(terminatedPayload, null, 2));

  expect(activePayload.eligibility.isEligible).toBe(true);
  expect(terminatedPayload.eligibility.isEligible).toBe(false);
  expect(defaultPayload).toHaveProperty('memberId');
});
