/**
 * generateMedication() — produces a realistic fake medication record.
 * Uses RxNorm RxCUI identifiers from the NLM (nlm.nih.gov/research/umls/rxnorm).
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem } from '../utils/random.js';
import { createMedicationId } from './identifiers.js';

const medicationsData = require('../data/medications.json');

const MEDICATION_STATUSES = ['Active', 'Discontinued', 'Hold', 'Completed'];

const FREQUENCIES = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Once weekly',
  'As needed',
];

/**
 * Generates a fake medication record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.medicationId]
 * @param {string}  [overrides.rxcui]       — looks up matching medication when provided
 * @param {string}  [overrides.name]
 * @param {string}  [overrides.genericName]
 * @param {string}  [overrides.brandName]
 * @param {string}  [overrides.strength]
 * @param {string}  [overrides.form]
 * @param {string}  [overrides.route]
 * @param {string}  [overrides.frequency]
 * @param {string}  [overrides.status]      — 'Active' | 'Discontinued' | 'Hold' | 'Completed'
 * @returns {object}
 */
export function generateMedication(overrides = {}) {
  const med = overrides.rxcui
    ? (medicationsData.medications.find(m => m.rxcui === overrides.rxcui) ?? randomItem(medicationsData.medications))
    : randomItem(medicationsData.medications);

  return {
    medicationId: overrides.medicationId ?? createMedicationId(),
    rxcui:        med.rxcui,
    name:         overrides.name        ?? med.name,
    genericName:  overrides.genericName ?? med.genericName,
    brandName:    overrides.brandName   ?? med.brandName,
    strength:     overrides.strength    ?? med.strength,
    form:         overrides.form        ?? med.form,
    route:        overrides.route       ?? med.route,
    frequency:    overrides.frequency   ?? randomItem(FREQUENCIES),
    status:       overrides.status      ?? randomItem(MEDICATION_STATUSES),
  };
}
