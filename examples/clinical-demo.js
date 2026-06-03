/**
 * clinical-demo.js — demonstrates all 5 new clinical generators.
 *
 * Run: node examples/clinical-demo.js
 */

import {
  generateDiagnosis,
  generateLabResult,
  generateMedication,
  generateVitals,
  generateEncounter,
  validateDiagnosis,
  validateLabResult,
  validateMedication,
  validateVitals,
  validateEncounter,
} from '../src/index.js';

// ── generateDiagnosis ─────────────────────────────────────────────────────────

console.log('─── generateDiagnosis ────────────────────────────────────────────');

const diagnosis = generateDiagnosis();
console.log('Random diagnosis:');
console.log(JSON.stringify(diagnosis, null, 2));

const diabetesDx = generateDiagnosis({ code: 'E11.9', type: 'Primary', status: 'Chronic' });
console.log('\nOverridden diagnosis (Type 2 Diabetes, Primary, Chronic):');
console.log(JSON.stringify(diabetesDx, null, 2));

console.log('\nValidation (random):', validateDiagnosis(generateDiagnosis()));

// ── generateLabResult ─────────────────────────────────────────────────────────

console.log('\n─── generateLabResult ────────────────────────────────────────────');

const lab = generateLabResult();
console.log('Random lab result:');
console.log(JSON.stringify(lab, null, 2));

const glucose = generateLabResult({ loincCode: '2345-7', value: 145 });
console.log('\nOverridden lab (Glucose = 145 mg/dL, auto High):');
console.log(JSON.stringify(glucose, null, 2));

console.log('\nValidation (random):', validateLabResult(generateLabResult()));

// ── generateMedication ────────────────────────────────────────────────────────

console.log('\n─── generateMedication ───────────────────────────────────────────');

const medication = generateMedication();
console.log('Random medication:');
console.log(JSON.stringify(medication, null, 2));

const metformin = generateMedication({ rxcui: '860975', status: 'Active', frequency: 'Twice daily' });
console.log('\nOverridden medication (Metformin):');
console.log(JSON.stringify(metformin, null, 2));

console.log('\nValidation (random):', validateMedication(generateMedication()));

// ── generateVitals ────────────────────────────────────────────────────────────

console.log('\n─── generateVitals ───────────────────────────────────────────────');

const vitals = generateVitals();
console.log('Random vitals (all measurements with LOINC codes):');
console.log(JSON.stringify(vitals, null, 2));

const customVitals = generateVitals({
  height: { value: 175 },
  weight: { value: 80 },
  bloodPressure: { systolic: { value: 130 }, diastolic: { value: 85 } },
});
console.log('\nOverridden vitals (175cm, 80kg, BP 130/85):');
console.log(`  BMI auto-calculated: ${customVitals.bmi.value} kg/m2`);
console.log(`  BP: ${customVitals.bloodPressure.systolic.value}/${customVitals.bloodPressure.diastolic.value} mmHg`);

console.log('\nValidation (random):', validateVitals(generateVitals()));

// ── generateEncounter ─────────────────────────────────────────────────────────

console.log('\n─── generateEncounter ────────────────────────────────────────────');

const encounter = generateEncounter();
console.log('Random encounter:');
console.log(JSON.stringify(encounter, null, 2));

const finishedEncounter = generateEncounter({
  class: 'Ambulatory',
  status: 'Finished',
  type: 'Office Visit',
  reasonCode: 'I10',
});
console.log('\nOverridden encounter (Finished, Ambulatory, Hypertension):');
console.log(`  Duration: ${finishedEncounter.duration} minutes`);
console.log(`  End date: ${finishedEncounter.endDate}`);
console.log(`  Reason: ${finishedEncounter.reasonCode} — ${finishedEncounter.reasonDescription}`);

console.log('\nValidation (random):', validateEncounter(generateEncounter()));

// ── Bulk generation example ───────────────────────────────────────────────────

console.log('\n─── Bulk: 5 encounters for a single patient ──────────────────────');
const encounters = Array.from({ length: 5 }, () => generateEncounter({ status: 'Finished' }));
encounters.forEach((enc, i) => {
  console.log(`  ${i + 1}. [${enc.class}] ${enc.type} on ${enc.startDate} — ${enc.duration} min — ${enc.reasonCode}`);
});
