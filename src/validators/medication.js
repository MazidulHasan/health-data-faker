/**
 * validateMedication(med) — validates a medication record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isOneOf, runRules,
  MEDICATION_STATUSES,
} from './rules.js';

/**
 * @param {object} med
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMedication(med) {
  if (typeof med !== 'object' || med === null) {
    return { valid: false, errors: ['"medication" must be a non-null object'] };
  }

  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(med.medicationId,  'medicationId'),
    () => isPresent(med.rxcui,         'rxcui'),
    () => isPresent(med.name,          'name'),
    () => isPresent(med.genericName,   'genericName'),
    () => isPresent(med.brandName,     'brandName'),
    () => isPresent(med.strength,      'strength'),
    () => isPresent(med.form,          'form'),
    () => isPresent(med.route,         'route'),
    () => isPresent(med.frequency,     'frequency'),
    () => isPresent(med.status,        'status'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isValidId(med.medicationId,  'medicationId'),
    () => isString(med.rxcui,          'rxcui'),
    () => isString(med.name,           'name'),
    () => isString(med.genericName,    'genericName'),
    () => isString(med.brandName,      'brandName'),
    () => isString(med.strength,       'strength'),
    () => isString(med.form,           'form'),
    () => isString(med.route,          'route'),
    () => isString(med.frequency,      'frequency'),
    () => isOneOf(med.status, MEDICATION_STATUSES, 'status'),
  ]);
}
