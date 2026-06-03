/**
 * validateLabResult(lab) — validates a lab result record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isNotFutureDate,
  isOneOf, runRules,
  LAB_STATUSES, LAB_INTERPRETATIONS,
} from './rules.js';

/**
 * Checks that referenceRange is an object with numeric low and high fields.
 */
function isValidReferenceRange(range) {
  if (typeof range !== 'object' || range === null) {
    return { ok: false, message: '"referenceRange" must be a non-null object' };
  }
  if (typeof range.low !== 'number' || !isFinite(range.low)) {
    return { ok: false, message: '"referenceRange.low" must be a finite number' };
  }
  if (typeof range.high !== 'number' || !isFinite(range.high)) {
    return { ok: false, message: '"referenceRange.high" must be a finite number' };
  }
  return { ok: true };
}

/**
 * @param {object} lab
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateLabResult(lab) {
  if (typeof lab !== 'object' || lab === null) {
    return { valid: false, errors: ['"lab" must be a non-null object'] };
  }

  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(lab.labId,          'labId'),
    () => isPresent(lab.loincCode,      'loincCode'),
    () => isPresent(lab.loincDisplay,   'loincDisplay'),
    () => isPresent(lab.shortName,      'shortName'),
    () => isPresent(lab.value,          'value'),
    () => isPresent(lab.unit,           'unit'),
    () => isPresent(lab.referenceRange, 'referenceRange'),
    () => isPresent(lab.interpretation, 'interpretation'),
    () => isPresent(lab.status,         'status'),
    () => isPresent(lab.collectedDate,  'collectedDate'),
    () => isPresent(lab.category,       'category'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isValidId(lab.labId,          'labId'),
    () => isString(lab.loincCode,       'loincCode'),
    () => isString(lab.loincDisplay,    'loincDisplay'),
    () => isString(lab.unit,            'unit'),
    () => isString(lab.category,        'category'),
    () => (typeof lab.value === 'number' && isFinite(lab.value) && lab.value >= 0)
            ? { ok: true }
            : { ok: false, message: '"value" must be a non-negative finite number' },
    () => isValidReferenceRange(lab.referenceRange),
    () => isOneOf(lab.interpretation, LAB_INTERPRETATIONS, 'interpretation'),
    () => isOneOf(lab.status, LAB_STATUSES, 'status'),
    () => isNotFutureDate(lab.collectedDate, 'collectedDate'),
  ]);
}
