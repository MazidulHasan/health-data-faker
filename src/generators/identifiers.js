/**
 * Identifier generators for healthcare/member/employee records.
 * All functions return deterministic-format strings with configurable prefixes.
 */

import { randomNumber, randomDigits } from '../utils/random.js';

/**
 * Zero-pads a number to a minimum width.
 * @param {number} num
 * @param {number} width
 * @returns {string}
 */
function pad(num, width) {
  return String(num).padStart(width, '0');
}

/**
 * Generates a Patient ID.
 * Default format: PAT-#####  (5-digit number, range 10000–99999)
 * @param {{ prefix?: string, min?: number, max?: number, pad?: number }} options
 * @returns {string}  e.g. "PAT-10001"
 */
export function createPatientId({
  prefix = 'PAT',
  min = 10000,
  max = 99999,
  padWidth = 0,
} = {}) {
  const num = randomNumber(min, max);
  const formatted = padWidth > 0 ? pad(num, padWidth) : String(num);
  return `${prefix}-${formatted}`;
}

/**
 * Generates a Member ID.
 * Default format: MBR-########  (8-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "MBR-20260045"
 */
export function createMemberId({
  prefix = 'MBR',
  digits = 8,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createMemberId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates an Employee ID.
 * Default format: EMP-####  (4-digit number, range 1000–9999)
 * @param {{ prefix?: string, min?: number, max?: number, padWidth?: number }} options
 * @returns {string}  e.g. "EMP-4839"
 */
export function createEmployeeId({
  prefix = 'EMP',
  min = 1000,
  max = 9999,
  padWidth = 0,
} = {}) {
  const num = randomNumber(min, max);
  const formatted = padWidth > 0 ? pad(num, padWidth) : String(num);
  return `${prefix}-${formatted}`;
}

/**
 * Generates a Policy Number.
 * Default format: POL-#####  (5-digit number, range 10000–99999)
 * @param {{ prefix?: string, min?: number, max?: number, padWidth?: number }} options
 * @returns {string}  e.g. "POL-78292"
 */
export function createPolicyNumber({
  prefix = 'POL',
  min = 10000,
  max = 99999,
  padWidth = 0,
} = {}) {
  const num = randomNumber(min, max);
  const formatted = padWidth > 0 ? pad(num, padWidth) : String(num);
  return `${prefix}-${formatted}`;
}

/**
 * Generates a Diagnosis ID.
 * Default format: DX-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "DX-004821"
 */
export function createDiagnosisId({
  prefix = 'DX',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createDiagnosisId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates a Lab Result ID.
 * Default format: LAB-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "LAB-029341"
 */
export function createLabId({
  prefix = 'LAB',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createLabId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates a Medication Record ID.
 * Default format: MED-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "MED-118043"
 */
export function createMedicationId({
  prefix = 'MED',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createMedicationId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates a Vitals Record ID.
 * Default format: VIT-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "VIT-773291"
 */
export function createVitalsId({
  prefix = 'VIT',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createVitalsId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates an Encounter ID.
 * Default format: ENC-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "ENC-509124"
 */
export function createEncounterId({
  prefix = 'ENC',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createEncounterId: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}

/**
 * Generates a Medical Record Number (MRN).
 * Default format: MRN-######  (6-digit zero-padded number)
 * @param {{ prefix?: string, digits?: number }} options
 * @returns {string}  e.g. "MRN-000123"
 */
export function createMRN({
  prefix = 'MRN',
  digits = 6,
} = {}) {
  if (typeof digits !== 'number' || digits < 1) {
    throw new Error('createMRN: digits must be a positive integer');
  }
  return `${prefix}-${randomDigits(digits)}`;
}
