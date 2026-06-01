/**
 * Playwright API tests — Patient endpoints
 *
 * Demonstrates how to use health-data-faker with Playwright's APIRequestContext.
 * Replace BASE_URL with your actual API base URL before running.
 *
 * Run:  npx playwright test examples/playwright/api-patient.spec.js
 */

import { test, expect } from '@playwright/test';
import { patientPayload } from './helpers/payloads.js';
import { validatePatient } from '../../src/index.js';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

// ─── POST /api/patients ───────────────────────────────────────────────────────

test.describe('POST /api/patients', () => {

  test('creates a patient with fully random data', async ({ request }) => {
    const payload = patientPayload();

    // Confirm the payload itself is valid before sending
    const { valid, errors } = validatePatient(payload);
    expect(valid, `Payload invalid: ${errors.join(', ')}`).toBe(true);

    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      patientId: payload.patientId,
      firstName: payload.firstName,
      lastName:  payload.lastName,
      email:     payload.email,
    });
  });

  test('creates a female patient aged 45', async ({ request }) => {
    const payload = patientPayload({ gender: 'Female', age: 45 });

    expect(payload.gender).toBe('Female');
    expect(payload.age).toBe(45);

    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.gender).toBe('Female');
    expect(body.age).toBe(45);
  });

  test('creates a patient with a specific blood group', async ({ request }) => {
    const payload = patientPayload({ bloodGroup: 'O-' });

    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: payload,
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).bloodGroup).toBe('O-');
  });

  test('creates a patient with a known patientId for idempotency test', async ({ request }) => {
    const payload = patientPayload({ patientId: 'PAT-00001' });

    const first  = await request.post(`${BASE_URL}/api/patients`, { data: payload });
    const second = await request.post(`${BASE_URL}/api/patients`, { data: payload });

    // Expect the API to handle duplicate IDs (adjust to 409 if your API rejects them)
    expect([201, 409]).toContain(second.status());
  });

  test('returns 400 for a missing required field', async ({ request }) => {
    const payload = patientPayload();
    delete payload.email; // remove a required field

    const response = await request.post(`${BASE_URL}/api/patients`, {
      data: payload,
    });

    expect(response.status()).toBe(400);
  });

  test('bulk-creates 10 patients without errors', async ({ request }) => {
    const payloads = Array.from({ length: 10 }, () => patientPayload());

    for (const payload of payloads) {
      const response = await request.post(`${BASE_URL}/api/patients`, {
        data: payload,
      });
      expect(response.status()).toBe(201);
    }
  });

});

// ─── Sample payloads (printed, not sent) ─────────────────────────────────────

test('show sample patient payloads in report', async () => {
  const defaultPayload = patientPayload();
  const femalePayload  = patientPayload({ gender: 'Female', age: 34 });
  const pinnedPayload  = patientPayload({
    patientId:  'PAT-00001',
    firstName:  'Jane',
    lastName:   'Doe',
    bloodGroup: 'A+',
  });

  console.log('Default patient:\n',  JSON.stringify(defaultPayload, null, 2));
  console.log('Female age 34:\n',    JSON.stringify(femalePayload,  null, 2));
  console.log('Pinned fields:\n',    JSON.stringify(pinnedPayload,  null, 2));

  // Structural assertions — no HTTP call needed
  expect(defaultPayload).toHaveProperty('patientId');
  expect(femalePayload.gender).toBe('Female');
  expect(pinnedPayload.firstName).toBe('Jane');
});
