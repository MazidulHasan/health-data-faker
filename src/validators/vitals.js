/**
 * validateVitals(vitals) — validates a vitals record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isValidId, isNotFutureDate, runRules,
} from './rules.js';

/**
 * Validates a single vital sign measurement sub-object.
 * Expects { value: number, unit: string, loincCode: string, loincDisplay: string }.
 */
function isValidVitalObject(obj, fieldName) {
  if (typeof obj !== 'object' || obj === null) {
    return { ok: false, message: `"${fieldName}" must be a non-null object` };
  }
  if (typeof obj.value !== 'number' || !isFinite(obj.value)) {
    return { ok: false, message: `"${fieldName}.value" must be a finite number` };
  }
  if (typeof obj.unit !== 'string' || obj.unit.trim() === '') {
    return { ok: false, message: `"${fieldName}.unit" must be a non-empty string` };
  }
  if (typeof obj.loincCode !== 'string' || obj.loincCode.trim() === '') {
    return { ok: false, message: `"${fieldName}.loincCode" must be a non-empty string` };
  }
  return { ok: true };
}

/**
 * @param {object} vitals
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateVitals(vitals) {
  if (typeof vitals !== 'object' || vitals === null) {
    return { valid: false, errors: ['"vitals" must be a non-null object'] };
  }

  return runRules([
    // ── Required top-level fields ────────────────────────────────────────────
    () => isPresent(vitals.vitalId,          'vitalId'),
    () => isPresent(vitals.recordedDate,     'recordedDate'),
    () => isPresent(vitals.height,           'height'),
    () => isPresent(vitals.weight,           'weight'),
    () => isPresent(vitals.bloodPressure,    'bloodPressure'),
    () => isPresent(vitals.heartRate,        'heartRate'),
    () => isPresent(vitals.temperature,      'temperature'),
    () => isPresent(vitals.oxygenSaturation, 'oxygenSaturation'),
    () => isPresent(vitals.respiratoryRate,  'respiratoryRate'),
    () => isPresent(vitals.bmi,              'bmi'),
    // ── Top-level formats ────────────────────────────────────────────────────
    () => isValidId(vitals.vitalId,        'vitalId'),
    () => isNotFutureDate(vitals.recordedDate, 'recordedDate'),
    // ── Vital sub-objects ────────────────────────────────────────────────────
    () => isValidVitalObject(vitals.height,           'height'),
    () => isValidVitalObject(vitals.weight,           'weight'),
    () => isValidVitalObject(vitals.heartRate,        'heartRate'),
    () => isValidVitalObject(vitals.temperature,      'temperature'),
    () => isValidVitalObject(vitals.oxygenSaturation, 'oxygenSaturation'),
    () => isValidVitalObject(vitals.respiratoryRate,  'respiratoryRate'),
    () => isValidVitalObject(vitals.bmi,              'bmi'),
    // ── bloodPressure nested object ──────────────────────────────────────────
    () => {
      if (typeof vitals.bloodPressure !== 'object' || vitals.bloodPressure === null) {
        return { ok: false, message: '"bloodPressure" must be a non-null object' };
      }
      const s = isValidVitalObject(vitals.bloodPressure.systolic,  'bloodPressure.systolic');
      if (!s.ok) return s;
      return isValidVitalObject(vitals.bloodPressure.diastolic, 'bloodPressure.diastolic');
    },
    // ── Clinical range checks ────────────────────────────────────────────────
    () => (vitals.oxygenSaturation?.value >= 0 && vitals.oxygenSaturation?.value <= 100)
            ? { ok: true }
            : { ok: false, message: '"oxygenSaturation.value" must be between 0 and 100' },
  ]);
}
