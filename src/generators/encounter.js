/**
 * generateEncounter() — produces a realistic fake clinical encounter record.
 * Encounter structure is modelled after the FHIR R4 Encounter resource (hl7.org/fhir/encounter.html).
 * Reason codes use ICD-10-CM codes published by CMS (public domain).
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomNumber, randomDate } from '../utils/random.js';
import { createEncounterId } from './identifiers.js';

const encounterData = require('../data/encounterTypes.json');
const icd10Data     = require('../data/icd10Codes.json');

const ENCOUNTER_STATUSES = ['Finished', 'In Progress', 'Planned', 'Cancelled'];

/**
 * Duration ranges (minutes) keyed by encounter class.
 */
const DURATION_RANGES = {
  Ambulatory:  [15,   60],
  Emergency:   [60,  480],
  Inpatient:   [1440, 10080],
  Observation: [240,  1440],
  Telehealth:  [10,   30],
};

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Generates a fake clinical encounter record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.encounterId]
 * @param {string}  [overrides.status]           — 'Finished' | 'In Progress' | 'Planned' | 'Cancelled'
 * @param {string}  [overrides.class]            — 'Ambulatory' | 'Emergency' | 'Inpatient' | 'Observation' | 'Telehealth'
 * @param {string}  [overrides.type]             — encounter type description
 * @param {string}  [overrides.startDate]        — ISO string "YYYY-MM-DD"
 * @param {string|null} [overrides.endDate]      — ISO string "YYYY-MM-DD"; auto-set when status is 'Finished'
 * @param {number|null} [overrides.duration]     — duration in minutes; auto-set when status is 'Finished'
 * @param {string}  [overrides.reasonCode]       — ICD-10-CM code
 * @param {string}  [overrides.reasonDescription]
 * @param {string}  [overrides.location]
 * @returns {object}
 */
export function generateEncounter(overrides = {}) {
  const encounterClass = overrides.class
    ?? randomItem(encounterData.encounterClasses).display;

  const status   = overrides.status   ?? randomItem(ENCOUNTER_STATUSES);
  const type     = overrides.type     ?? randomItem(encounterData.encounterTypes);
  const location = overrides.location ?? randomItem(encounterData.encounterLocations);

  const reasonDx = overrides.reasonCode
    ? (icd10Data.icd10Codes.find(d => d.code === overrides.reasonCode) ?? null)
    : randomItem(icd10Data.icd10Codes);

  const startDate = overrides.startDate
    ?? toISODate(randomDate(new Date('2020-01-01'), new Date()));

  let endDate  = overrides.endDate  ?? null;
  let duration = overrides.duration ?? null;

  if (status === 'Finished' && endDate === null) {
    const [minMin, maxMin] = DURATION_RANGES[encounterClass] ?? DURATION_RANGES.Ambulatory;
    duration = randomNumber(minMin, maxMin);
    const endMs   = new Date(startDate).getTime() + duration * 60 * 1000;
    const capDate = Date.now();
    endDate = toISODate(new Date(Math.min(endMs, capDate)));
  }

  return {
    encounterId:       overrides.encounterId       ?? createEncounterId(),
    status,
    class:             encounterClass,
    type,
    startDate,
    endDate,
    duration,
    reasonCode:        overrides.reasonCode        ?? (reasonDx?.code        ?? ''),
    reasonDescription: overrides.reasonDescription ?? (reasonDx?.description ?? ''),
    location,
  };
}
