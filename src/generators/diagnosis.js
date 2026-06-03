/**
 * generateDiagnosis() — produces a realistic fake clinical diagnosis record.
 * Uses ICD-10-CM codes published by CMS (US government, public domain).
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomDate } from '../utils/random.js';
import { createDiagnosisId } from './identifiers.js';

const icd10Data = require('../data/icd10Codes.json');

const DIAGNOSIS_TYPES    = ['Primary', 'Secondary', 'Comorbidity'];
const DIAGNOSIS_STATUSES = ['Active', 'Resolved', 'Chronic', 'Ruled Out'];

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Generates a fake clinical diagnosis record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.diagnosisId]
 * @param {string}  [overrides.code]        — ICD-10-CM code; if provided, looks up the matching entry
 * @param {string}  [overrides.description]
 * @param {string}  [overrides.category]
 * @param {string}  [overrides.type]        — 'Primary' | 'Secondary' | 'Comorbidity'
 * @param {string}  [overrides.onsetDate]   — ISO string "YYYY-MM-DD"
 * @param {string}  [overrides.status]      — 'Active' | 'Resolved' | 'Chronic' | 'Ruled Out'
 * @returns {object}
 */
export function generateDiagnosis(overrides = {}) {
  const dx = overrides.code
    ? (icd10Data.icd10Codes.find(d => d.code === overrides.code) ?? randomItem(icd10Data.icd10Codes))
    : randomItem(icd10Data.icd10Codes);

  const onsetDate = overrides.onsetDate
    ?? toISODate(randomDate(new Date('2000-01-01'), new Date()));

  return {
    diagnosisId: overrides.diagnosisId ?? createDiagnosisId(),
    code:        overrides.code        ?? dx.code,
    description: overrides.description ?? dx.description,
    category:    overrides.category    ?? dx.category,
    type:        overrides.type        ?? randomItem(DIAGNOSIS_TYPES),
    onsetDate,
    status:      overrides.status      ?? randomItem(DIAGNOSIS_STATUSES),
  };
}
