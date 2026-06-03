/**
 * validateDiagnosis(dx) — validates a diagnosis record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isNotFutureDate,
  isOneOf, runRules,
  DIAGNOSIS_TYPES, DIAGNOSIS_STATUSES,
} from './rules.js';

/**
 * @param {object} dx
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateDiagnosis(dx) {
  if (typeof dx !== 'object' || dx === null) {
    return { valid: false, errors: ['"diagnosis" must be a non-null object'] };
  }

  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(dx.diagnosisId,  'diagnosisId'),
    () => isPresent(dx.code,         'code'),
    () => isPresent(dx.description,  'description'),
    () => isPresent(dx.category,     'category'),
    () => isPresent(dx.type,         'type'),
    () => isPresent(dx.onsetDate,    'onsetDate'),
    () => isPresent(dx.status,       'status'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isValidId(dx.diagnosisId,  'diagnosisId'),
    () => isString(dx.code,          'code'),
    () => isString(dx.description,   'description'),
    () => isString(dx.category,      'category'),
    () => isOneOf(dx.type,   DIAGNOSIS_TYPES,    'type'),
    () => isOneOf(dx.status, DIAGNOSIS_STATUSES, 'status'),
    () => isNotFutureDate(dx.onsetDate, 'onsetDate'),
  ]);
}
