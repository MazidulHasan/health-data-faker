/**
 * validatePatient(patient) — validates a patient record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isNotFutureDate,
  isPositiveInteger, isValidEmail, isValidPhone,
  isOneOf, runRules, BLOOD_GROUPS,
} from './rules.js';

/**
 * Checks that fullName equals "firstName lastName".
 */
function fullNameMatchesNames(patient) {
  const expected = `${patient.firstName} ${patient.lastName}`;
  if (patient.fullName !== expected) {
    return { ok: false, message: `"fullName" must equal firstName + " " + lastName (expected "${expected}")` };
  }
  return { ok: true };
}

/**
 * Checks that age is consistent with dateOfBirth (within ±1 year tolerance
 * to handle edge cases around today's date).
 */
function ageMatchesDob(patient) {
  const dob = new Date(patient.dateOfBirth);
  if (isNaN(dob.getTime())) return { ok: true }; // date already caught by isNotFutureDate
  const today = new Date();
  let expected = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) expected--;
  if (Math.abs(patient.age - expected) > 1) {
    return { ok: false, message: `"age" (${patient.age}) is inconsistent with "dateOfBirth" (${patient.dateOfBirth}); expected ~${expected}` };
  }
  return { ok: true };
}

/**
 * @param {object} patient
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePatient(patient) {
  if (typeof patient !== 'object' || patient === null) {
    return { valid: false, errors: ['"patient" must be a non-null object'] };
  }

  const p = patient;
  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(p.patientId,   'patientId'),
    () => isPresent(p.firstName,   'firstName'),
    () => isPresent(p.lastName,    'lastName'),
    () => isPresent(p.fullName,    'fullName'),
    () => isPresent(p.gender,      'gender'),
    () => isPresent(p.dateOfBirth, 'dateOfBirth'),
    () => isPresent(p.age,         'age'),
    () => isPresent(p.bloodGroup,  'bloodGroup'),
    () => isPresent(p.phone,       'phone'),
    () => isPresent(p.email,       'email'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isString(p.firstName,    'firstName'),
    () => isString(p.lastName,     'lastName'),
    () => isString(p.fullName,     'fullName'),
    () => isString(p.gender,       'gender'),
    () => isValidId(p.patientId,   'patientId'),
    () => isNotFutureDate(p.dateOfBirth, 'dateOfBirth'),
    () => isPositiveInteger(p.age, 'age'),
    () => isOneOf(p.bloodGroup, BLOOD_GROUPS, 'bloodGroup'),
    () => isValidPhone(p.phone,    'phone'),
    () => isValidEmail(p.email,    'email'),
    // ── Cross-field consistency ──────────────────────────────────────────────
    () => fullNameMatchesNames(p),
    () => ageMatchesDob(p),
  ]);
}
