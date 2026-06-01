/**
 * Preview generated payloads without running Playwright.
 * Run: node examples/playwright/payloads-preview.js
 */

import { patientPayload, memberPayload, employeePayload } from './helpers/payloads.js';
import { validatePatient, validateMember, validateEmployee } from '../../src/index.js';

function check(label, payload, validate) {
  const { valid, errors } = validate(payload);
  const icon = valid ? '✓' : '✗';
  console.log(`\n${icon} ${label} — valid: ${valid}`);
  if (!valid) errors.forEach(e => console.log(`  ERROR: ${e}`));
  console.log(JSON.stringify(payload, null, 2));
}

console.log('════════════════════════════════════');
console.log(' Request Body Previews');
console.log('════════════════════════════════════');

// ── Patient payloads ────────────────────────────────────────────────────────
check('patientPayload() — default',           patientPayload(),                           validatePatient);
check('patientPayload() — Female, age 45',    patientPayload({ gender: 'Female', age: 45 }), validatePatient);
check('patientPayload() — pinned fields',     patientPayload({
  patientId: 'PAT-00001', firstName: 'Jane', lastName: 'Doe', bloodGroup: 'A+',
}), validatePatient);

// ── Member payloads ─────────────────────────────────────────────────────────
check('memberPayload() — default',            memberPayload(),                    validateMember);
check('memberPayload() — Active',             memberPayload({ status: 'Active' }), validateMember);
check('memberPayload() — Terminated',         memberPayload({ status: 'Terminated' }), validateMember);

// ── Employee payloads ───────────────────────────────────────────────────────
check('employeePayload() — default',          employeePayload(),                       validateEmployee);
check('employeePayload() — Active Physician', employeePayload({
  designation: { title: 'Physician', category: 'Clinical' },
  department:  { name: 'Cardiology', code: 'CD' },
  status:      'Active',
}), validateEmployee);
check('employeePayload() — On Leave',         employeePayload({ status: 'On Leave' }), validateEmployee);
