/**
 * validateEncounter(enc) — validates a clinical encounter record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isNotFutureDate,
  isOneOf, runRules,
  ENCOUNTER_STATUSES, ENCOUNTER_CLASSES,
} from './rules.js';

/**
 * @param {object} enc
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateEncounter(enc) {
  if (typeof enc !== 'object' || enc === null) {
    return { valid: false, errors: ['"encounter" must be a non-null object'] };
  }

  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(enc.encounterId,       'encounterId'),
    () => isPresent(enc.status,            'status'),
    () => isPresent(enc.class,             'class'),
    () => isPresent(enc.type,              'type'),
    () => isPresent(enc.startDate,         'startDate'),
    () => isPresent(enc.reasonCode,        'reasonCode'),
    () => isPresent(enc.reasonDescription, 'reasonDescription'),
    () => isPresent(enc.location,          'location'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isValidId(enc.encounterId,       'encounterId'),
    () => isOneOf(enc.status, ENCOUNTER_STATUSES, 'status'),
    () => isOneOf(enc.class,  ENCOUNTER_CLASSES,  'class'),
    () => isString(enc.type,               'type'),
    () => isNotFutureDate(enc.startDate,   'startDate'),
    () => isString(enc.reasonCode,         'reasonCode'),
    () => isString(enc.reasonDescription,  'reasonDescription'),
    () => isString(enc.location,           'location'),
    // ── endDate: optional; when present must be valid and >= startDate ───────
    () => {
      if (enc.endDate === null || enc.endDate === undefined) return { ok: true };
      const check = isNotFutureDate(enc.endDate, 'endDate');
      if (!check.ok) return check;
      if (new Date(enc.endDate) < new Date(enc.startDate)) {
        return { ok: false, message: '"endDate" must be on or after "startDate"' };
      }
      return { ok: true };
    },
    // ── duration: optional; when present must be a non-negative integer ──────
    () => {
      if (enc.duration === null || enc.duration === undefined) return { ok: true };
      if (!Number.isInteger(enc.duration) || enc.duration < 0) {
        return { ok: false, message: '"duration" must be a non-negative integer when provided' };
      }
      return { ok: true };
    },
  ]);
}
