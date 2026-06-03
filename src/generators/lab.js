/**
 * generateLabResult() — produces a realistic fake laboratory test result.
 *
 * LOINC codes used in this file are copyright 1995-2024 Regenstrief Institute,
 * Inc. and the LOINC Committee. Used under the LOINC license (loinc.org/license).
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomDate, randomFloat } from '../utils/random.js';
import { createLabId } from './identifiers.js';

const loincData = require('../data/loincLabs.json');

const LAB_STATUSES = ['final', 'preliminary', 'corrected', 'cancelled'];

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Generates a plausible numeric value for the given lab test,
 * weighted mostly (70%) within the normal reference range.
 * Returns both the value and its derived interpretation.
 */
function generateValueAndInterpretation(lab) {
  const { low, high } = lab.referenceRange;
  const decimals = lab.decimals ?? 1;
  const range    = high - low;
  const roll     = Math.random();

  if (roll < 0.70) {
    return { value: randomFloat(low, high, decimals), interpretation: 'Normal' };
  }
  if (roll < 0.85) {
    const hiMax = high + range * 0.5;
    return { value: randomFloat(high, Math.max(high, hiMax), decimals), interpretation: 'High' };
  }
  if (roll < 0.92) {
    const loMin = Math.max(0, low - range * 0.5);
    return { value: randomFloat(loMin, Math.max(loMin, low), decimals), interpretation: 'Low' };
  }
  if (roll < 0.97) {
    const critHiMin = high + range * 0.5;
    const critHiMax = high + range * 1.5;
    return { value: randomFloat(critHiMin, Math.max(critHiMin, critHiMax), decimals), interpretation: 'Critical High' };
  }
  const critLoMin = Math.max(0, low - range);
  const critLoMax = Math.max(critLoMin, Math.max(0, low - range * 0.5));
  return { value: randomFloat(critLoMin, critLoMax, decimals), interpretation: 'Critical Low' };
}

/**
 * Derives an interpretation label from a value and reference range.
 */
function deriveInterpretation(value, referenceRange) {
  const { low, high } = referenceRange;
  if (value < low  * 0.70) return 'Critical Low';
  if (value < low)          return 'Low';
  if (value > high * 1.50)  return 'Critical High';
  if (value > high)         return 'High';
  return 'Normal';
}

/**
 * Generates a fake lab result record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.labId]
 * @param {string}  [overrides.loincCode]      — looks up the matching LOINC entry when provided
 * @param {string}  [overrides.loincDisplay]
 * @param {string}  [overrides.shortName]
 * @param {number}  [overrides.value]          — auto-derives interpretation when provided
 * @param {string}  [overrides.unit]
 * @param {object}  [overrides.referenceRange] — { low: number, high: number }
 * @param {string}  [overrides.interpretation] — overrides auto-derived value
 * @param {string}  [overrides.status]
 * @param {string}  [overrides.collectedDate]  — ISO string "YYYY-MM-DD"
 * @param {string}  [overrides.category]
 * @returns {object}
 */
export function generateLabResult(overrides = {}) {
  const lab = overrides.loincCode
    ? (loincData.loincLabs.find(l => l.loincCode === overrides.loincCode) ?? randomItem(loincData.loincLabs))
    : randomItem(loincData.loincLabs);

  const refRange = overrides.referenceRange ?? lab.referenceRange;

  let value, interpretation;
  if (overrides.value !== undefined) {
    value         = overrides.value;
    interpretation = deriveInterpretation(value, refRange);
  } else {
    const gen     = generateValueAndInterpretation({ ...lab, referenceRange: refRange });
    value         = gen.value;
    interpretation = gen.interpretation;
  }

  const collectedDate = overrides.collectedDate
    ?? toISODate(randomDate(new Date('2020-01-01'), new Date()));

  return {
    labId:          overrides.labId          ?? createLabId(),
    loincCode:      lab.loincCode,
    loincDisplay:   overrides.loincDisplay   ?? lab.display,
    shortName:      overrides.shortName      ?? lab.shortName,
    value,
    unit:           overrides.unit           ?? lab.unit,
    referenceRange: { ...refRange },
    interpretation: overrides.interpretation ?? interpretation,
    status:         overrides.status         ?? 'final',
    collectedDate,
    category:       overrides.category       ?? lab.category,
  };
}
