/**
 * Playwright API tests — Employee endpoints
 *
 * Demonstrates how to use health-data-faker with Playwright's APIRequestContext.
 * Replace BASE_URL with your actual API base URL before running.
 *
 * Run:  npx playwright test examples/playwright/api-employee.spec.js
 */

import { test, expect } from '@playwright/test';
import { employeePayload } from './helpers/payloads.js';
import { validateEmployee } from '../../src/index.js';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

// ─── POST /api/employees ──────────────────────────────────────────────────────

test.describe('POST /api/employees', () => {

  test('creates an employee with fully random data', async ({ request }) => {
    const payload = employeePayload();

    const { valid, errors } = validateEmployee(payload);
    expect(valid, `Payload invalid: ${errors.join(', ')}`).toBe(true);

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      employeeId: payload.employeeId,
      firstName:  payload.firstName,
      lastName:   payload.lastName,
      workEmail:  payload.workEmail,
    });
  });

  test('creates an Active employee in a specific department', async ({ request }) => {
    const payload = employeePayload({
      department: { name: 'Cardiology', code: 'CD' },
      status:     'Active',
    });

    expect(payload.department.code).toBe('CD');
    expect(payload.status).toBe('Active');

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.department.code).toBe('CD');
  });

  test('creates a Clinical Physician employee', async ({ request }) => {
    const payload = employeePayload({
      designation: { title: 'Physician', category: 'Clinical' },
      status:      'Active',
    });

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.designation.title).toBe('Physician');
    expect(body.designation.category).toBe('Clinical');
  });

  test('creates an employee with a fixed joining date for tenure testing', async ({ request }) => {
    const payload = employeePayload({
      joiningDate: '2018-03-01',
      status:      'Active',
    });

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).joiningDate).toBe('2018-03-01');
  });

  test('creates an On Leave employee', async ({ request }) => {
    const payload = employeePayload({ status: 'On Leave' });

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(201);
    expect((await response.json()).status).toBe('On Leave');
  });

  test('returns 400 for a missing required field', async ({ request }) => {
    const payload = employeePayload();
    delete payload.workEmail;

    const response = await request.post(`${BASE_URL}/api/employees`, {
      data: payload,
    });

    expect(response.status()).toBe(400);
  });

  test('bulk-creates one employee per status type', async ({ request }) => {
    const statuses = ['Active', 'On Leave', 'Terminated', 'Probation', 'Resigned'];

    for (const status of statuses) {
      const payload  = employeePayload({ status });
      const response = await request.post(`${BASE_URL}/api/employees`, { data: payload });
      expect(response.status()).toBe(201);
    }
  });

  test('bulk-creates 20 random employees for performance/load seeding', async ({ request }) => {
    const payloads = Array.from({ length: 20 }, () => employeePayload());

    const responses = await Promise.all(
      payloads.map(p =>
        request.post(`${BASE_URL}/api/employees`, { data: p })
      )
    );

    responses.forEach(r => expect(r.status()).toBe(201));
  });

});

// ─── Sample payloads (printed, not sent) ─────────────────────────────────────

test('show sample employee payloads in report', async () => {
  const defaultPayload   = employeePayload();
  const clinicalPayload  = employeePayload({
    designation: { title: 'Registered Nurse', category: 'Clinical' },
    department:  { name: 'Emergency Medicine', code: 'EM' },
    status:      'Active',
  });
  const onLeavePayload   = employeePayload({ status: 'On Leave' });

  console.log('Default employee:\n',  JSON.stringify(defaultPayload,  null, 2));
  console.log('Clinical nurse:\n',    JSON.stringify(clinicalPayload, null, 2));
  console.log('On Leave employee:\n', JSON.stringify(onLeavePayload,  null, 2));

  expect(defaultPayload).toHaveProperty('employeeId');
  expect(clinicalPayload.designation.title).toBe('Registered Nurse');
  expect(onLeavePayload.status).toBe('On Leave');
});
