/**
 * generateVitals() — produces a realistic fake patient vitals record.
 *
 * LOINC codes embedded below are copyright 1995-2024 Regenstrief Institute,
 * Inc. and the LOINC Committee. Used under the LOINC license (loinc.org/license).
 */

import { randomNumber, randomFloat, randomDate } from '../utils/random.js';
import { createVitalsId } from './identifiers.js';

/**
 * LOINC metadata for each vital sign measurement.
 * Codes are embedded directly since they are fixed clinical standards.
 */
const VITAL_LOINC = {
  height:           { loincCode: '8302-2',  loincDisplay: 'Body height' },
  weight:           { loincCode: '29463-7', loincDisplay: 'Body weight' },
  bpSystolic:       { loincCode: '8480-6',  loincDisplay: 'Systolic blood pressure' },
  bpDiastolic:      { loincCode: '8462-4',  loincDisplay: 'Diastolic blood pressure' },
  heartRate:        { loincCode: '8867-4',  loincDisplay: 'Heart rate' },
  temperature:      { loincCode: '8310-5',  loincDisplay: 'Body temperature' },
  oxygenSaturation: { loincCode: '59408-5', loincDisplay: 'Oxygen saturation by pulse oximetry' },
  respiratoryRate:  { loincCode: '9279-1',  loincDisplay: 'Respiratory rate' },
  bmi:              { loincCode: '39156-5', loincDisplay: 'Body mass index (BMI) [Ratio]' },
};

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Builds a single vital sign measurement object.
 * Override fields take precedence over generated defaults.
 */
function makeVital(loinc, value, unit, overrideObj) {
  return {
    value:        overrideObj?.value        ?? value,
    unit:         overrideObj?.unit         ?? unit,
    loincCode:    overrideObj?.loincCode    ?? loinc.loincCode,
    loincDisplay: overrideObj?.loincDisplay ?? loinc.loincDisplay,
  };
}

/**
 * Generates a fake vitals record containing all standard vital sign measurements.
 * BMI is automatically calculated from height and weight when not overridden.
 *
 * @param {object} overrides
 * @param {string}  [overrides.vitalId]
 * @param {string}  [overrides.recordedDate]          — ISO string "YYYY-MM-DD"
 * @param {object}  [overrides.height]                — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.weight]                — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.bloodPressure]         — { systolic?: {...}, diastolic?: {...} }
 * @param {object}  [overrides.heartRate]             — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.temperature]           — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.oxygenSaturation]      — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.respiratoryRate]       — { value?, unit?, loincCode?, loincDisplay? }
 * @param {object}  [overrides.bmi]                   — { value?, unit?, loincCode?, loincDisplay? }
 * @returns {object}
 */
export function generateVitals(overrides = {}) {
  const heightCm = overrides.height?.value ?? randomNumber(150, 195);
  const weightKg = overrides.weight?.value ?? randomFloat(50, 120, 1);
  const bmiValue = overrides.bmi?.value
    ?? parseFloat((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));

  const recordedDate = overrides.recordedDate
    ?? toISODate(randomDate(new Date('2020-01-01'), new Date()));

  return {
    vitalId: overrides.vitalId ?? createVitalsId(),
    recordedDate,
    height:           makeVital(VITAL_LOINC.height,   heightCm,                                               'cm',          overrides.height),
    weight:           makeVital(VITAL_LOINC.weight,   weightKg,                                               'kg',          overrides.weight),
    bloodPressure: {
      systolic:  makeVital(VITAL_LOINC.bpSystolic,  overrides.bloodPressure?.systolic?.value  ?? randomNumber(100, 140), 'mmHg', overrides.bloodPressure?.systolic),
      diastolic: makeVital(VITAL_LOINC.bpDiastolic, overrides.bloodPressure?.diastolic?.value ?? randomNumber(60, 90),   'mmHg', overrides.bloodPressure?.diastolic),
    },
    heartRate:        makeVital(VITAL_LOINC.heartRate,        overrides.heartRate?.value        ?? randomNumber(55, 100),     'bpm',         overrides.heartRate),
    temperature:      makeVital(VITAL_LOINC.temperature,      overrides.temperature?.value      ?? randomFloat(97.0, 99.5, 1), 'F',           overrides.temperature),
    oxygenSaturation: makeVital(VITAL_LOINC.oxygenSaturation, overrides.oxygenSaturation?.value ?? randomNumber(95, 100),     '%',           overrides.oxygenSaturation),
    respiratoryRate:  makeVital(VITAL_LOINC.respiratoryRate,  overrides.respiratoryRate?.value  ?? randomNumber(12, 20),      'breaths/min', overrides.respiratoryRate),
    bmi:              makeVital(VITAL_LOINC.bmi,              bmiValue,                                                        'kg/m2',       overrides.bmi),
  };
}
