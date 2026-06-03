# health-data-faker

[![Tests](https://github.com/MazidulHasan/health-data-faker/actions/workflows/test.yml/badge.svg)](https://github.com/MazidulHasan/health-data-faker/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/health-data-faker?style=flat)](https://www.npmjs.com/package/health-data-faker)
[![License: MIT](https://img.shields.io/npm/l/health-data-faker?style=flat)](./LICENSE)
[![Node.js](https://img.shields.io/node/v/health-data-faker?style=flat)](https://nodejs.org)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat)](./package.json)

Domain-specific test data generation for healthcare applications.
Covers patient demographics, insurance, staff, clinical diagnoses, lab results, medications, vitals, and encounters.
Built for QA automation, API testing, development seeding, and performance testing.

**No Faker. No external dependencies. Pure JavaScript.**

---

## Why health-data-faker?

Most test data libraries are generic. Healthcare applications need data that looks real and follows clinical standards — realistic patient demographics, valid insurance structures, ICD-10 diagnosis codes, LOINC lab observations, RxNorm medication identifiers, and FHIR-inspired encounter records.

`health-data-faker` generates all of it out of the box, with:

- **Zero runtime dependencies** — nothing to audit, nothing to update
- **Industry-standard codes** — ICD-10-CM diagnoses, LOINC lab tests, RxNorm medications
- **FHIR-inspired structure** — encounter and vitals records follow HL7 FHIR R4 field conventions
- **Override system** — pin any field for targeted test scenarios
- **Built-in validators** — confirm generated data meets your schema before it hits the wire
- **Playwright-ready** — designed to drop into API test suites

---

## Healthcare standards used

| Standard | Covers | Source |
|---|---|---|
| **ICD-10-CM** | Diagnosis codes | CMS (US public domain) |
| **LOINC** | Lab tests & vital sign observations | Regenstrief Institute (free with attribution) |
| **RxNorm** | Medication identifiers (RxCUI) | NLM (freely redistributable) |
| **FHIR R4** | Encounter & vitals field structure | HL7 (open standard) |

See [`NOTICES`](./NOTICES) for full attribution.

---

## Installation

```bash
npm install health-data-faker
```

Requires Node.js ≥ 18.

---

## Quick start

```js
import {
  generatePatient,
  generateDiagnosis,
  generateLabResult,
  generateMedication,
  generateVitals,
  generateEncounter,
  validatePatient,
  validateEncounter,
} from 'health-data-faker';

// Generate a random patient
const patient = generatePatient({ gender: 'Female', age: 45 });

// Generate a clinical diagnosis (ICD-10-CM)
const diagnosis = generateDiagnosis({ code: 'I10', type: 'Primary', status: 'Chronic' });

// Generate a lab result (LOINC)
const glucose = generateLabResult({ loincCode: '2345-7', value: 145 });
// → { shortName: 'Glucose', value: 145, unit: 'mg/dL', interpretation: 'High', ... }

// Generate a medication (RxNorm)
const medication = generateMedication({ rxcui: '860975', status: 'Active' });
// → { genericName: 'Metformin', brandName: 'Glucophage', strength: '500 mg', ... }

// Generate vitals with auto-calculated BMI
const vitals = generateVitals({ height: { value: 175 }, weight: { value: 80 } });
// → { bmi: { value: 26.1, loincCode: '39156-5', ... }, ... }

// Generate a clinical encounter (FHIR-inspired)
const encounter = generateEncounter({ class: 'Ambulatory', status: 'Finished', reasonCode: 'I10' });

// Validate before sending to an API
const { valid, errors } = validateEncounter(encounter);
console.log(valid); // true
```

---

## API

All generators accept an optional `overrides` object. Any field can be pinned — unspecified fields are randomised. All validators return `{ valid: boolean, errors: string[] }`.

---

### Demographics generators

#### `generatePatient(overrides?)`

```js
generatePatient();
// {
//   patientId:   "PAT-53831",
//   firstName:   "Kimberly",
//   lastName:    "Williams",
//   fullName:    "Kimberly Williams",
//   gender:      "Female",
//   dateOfBirth: "1980-07-31",
//   age:         45,
//   bloodGroup:  "B-",
//   phone:       "(617) 592-9025",
//   email:       "kimberly.williams397@protonmail.com"
// }
```

| Override | Effect |
|---|---|
| `gender: "Female"` | Picks a female first name from the fixture pool |
| `age: 45` | Back-calculates a matching `dateOfBirth` |
| `dateOfBirth: "1990-01-01"` | Pins DOB and derives age from it |
| Any field | Passed through as-is |

---

#### `generateMember(overrides?)`

```js
generateMember({ status: 'Active' });
// {
//   memberId:      "MBR-18871145",
//   plan: {
//     name: "Cigna Connect", type: "HMO", tier: "Bronze", provider: "Cigna"
//   },
//   policyNumber:  "POL-75162",
//   effectiveDate: "2018-09-18",
//   status:        "Active",
//   eligibility: { isEligible: true, reason: "Active coverage" }
// }
```

`eligibility` is automatically derived from `status`:

| Status | `isEligible` | Reason |
|---|---|---|
| Active | `true` | Active coverage |
| Inactive | `false` | Coverage inactive |
| Terminated | `false` | Coverage terminated |
| Pending | `false` | Pending enrollment |
| Suspended | `false` | Coverage suspended |

---

#### `generateEmployee(overrides?)`

```js
generateEmployee({ status: 'Active' });
// {
//   employeeId:  "EMP-4957",
//   firstName:   "Samuel",
//   lastName:    "Gonzalez",
//   department:  { name: "Internal Medicine", code: "IM" },
//   designation: { title: "Supply Chain Coordinator", category: "Operations" },
//   joiningDate: "2020-09-07",
//   status:      "Active",
//   workEmail:   "samuel.gonzalez58@clinicworks.com"
// }
```

---

### Clinical generators

#### `generateDiagnosis(overrides?)`

Generates a clinical diagnosis record using **ICD-10-CM** codes (50 curated codes across 10 categories).

```js
generateDiagnosis();
// {
//   diagnosisId: "DX-048219",
//   code:        "E11.9",
//   description: "Type 2 diabetes mellitus without complications",
//   category:    "Endocrine",
//   type:        "Primary",
//   onsetDate:   "2019-04-12",
//   status:      "Chronic"
// }
```

| Field | Values |
|---|---|
| `type` | `Primary`, `Secondary`, `Comorbidity` |
| `status` | `Active`, `Resolved`, `Chronic`, `Ruled Out` |
| `code` | Any ICD-10-CM code — overriding auto-fills `description` and `category` |

Available ICD-10 categories: Endocrine, Cardiovascular, Respiratory, Digestive, Musculoskeletal, Genitourinary, Mental Health, Neurological, Neoplasm, Preventive, Symptoms.

---

#### `generateLabResult(overrides?)`

Generates a lab result using **LOINC** codes (30 common tests with reference ranges). Interpretation is automatically derived from the value.

```js
generateLabResult({ loincCode: '2345-7', value: 145 });
// {
//   labId:          "LAB-029341",
//   loincCode:      "2345-7",
//   loincDisplay:   "Glucose [Mass/volume] in Serum or Plasma",
//   shortName:      "Glucose",
//   value:          145,
//   unit:           "mg/dL",
//   referenceRange: { low: 70, high: 99 },
//   interpretation: "High",
//   status:         "final",
//   collectedDate:  "2024-03-10",
//   category:       "Metabolic"
// }
```

**Auto-derived interpretation** from value vs reference range:

| Condition | Interpretation |
|---|---|
| Within range | `Normal` |
| Above `high` | `High` |
| Below `low` | `Low` |
| Above `high × 1.5` | `Critical High` |
| Below `low × 0.7` | `Critical Low` |

When generating without a value override, results are weighted 70% Normal, 30% abnormal.

| Field | Values |
|---|---|
| `status` | `final`, `preliminary`, `corrected`, `cancelled` |
| `loincCode` | Any LOINC code from the fixture — overriding auto-fills all metadata |

Available categories: Metabolic, Renal, Electrolytes, CBC, Lipids, Liver, Coagulation, Inflammatory.

---

#### `generateMedication(overrides?)`

Generates a medication record using **RxNorm** RxCUI identifiers (30 common medications).

```js
generateMedication({ rxcui: '860975' });
// {
//   medicationId: "MED-118043",
//   rxcui:        "860975",
//   name:         "Metformin HCl 500 MG Oral Tablet",
//   genericName:  "Metformin",
//   brandName:    "Glucophage",
//   strength:     "500 mg",
//   form:         "Tablet",
//   route:        "Oral",
//   frequency:    "Twice daily",
//   status:       "Active"
// }
```

| Field | Values |
|---|---|
| `status` | `Active`, `Discontinued`, `Hold`, `Completed` |
| `frequency` | Once daily, Twice daily, Three times daily, Every 6 hours, As needed, … |
| `rxcui` | Any RxCUI from the fixture — overriding auto-fills name, generic, brand, strength, form, route |

---

#### `generateVitals(overrides?)`

Generates a complete vitals record with all standard measurements. Each vital includes an embedded **LOINC** code. BMI is automatically calculated from height and weight.

```js
generateVitals({ height: { value: 175 }, weight: { value: 80 } });
// {
//   vitalId:      "VIT-773291",
//   recordedDate: "2024-01-15",
//   height:           { value: 175, unit: "cm",          loincCode: "8302-2",  loincDisplay: "Body height" },
//   weight:           { value: 80,  unit: "kg",          loincCode: "29463-7", loincDisplay: "Body weight" },
//   bloodPressure: {
//     systolic:     { value: 118, unit: "mmHg",          loincCode: "8480-6",  loincDisplay: "Systolic blood pressure" },
//     diastolic:    { value: 76,  unit: "mmHg",          loincCode: "8462-4",  loincDisplay: "Diastolic blood pressure" }
//   },
//   heartRate:        { value: 72,  unit: "bpm",         loincCode: "8867-4",  loincDisplay: "Heart rate" },
//   temperature:      { value: 98.4,unit: "F",           loincCode: "8310-5",  loincDisplay: "Body temperature" },
//   oxygenSaturation: { value: 98,  unit: "%",           loincCode: "59408-5", loincDisplay: "Oxygen saturation by pulse oximetry" },
//   respiratoryRate:  { value: 16,  unit: "breaths/min", loincCode: "9279-1",  loincDisplay: "Respiratory rate" },
//   bmi:              { value: 26.1,unit: "kg/m2",       loincCode: "39156-5", loincDisplay: "Body mass index (BMI) [Ratio]" }
// }
```

Each measurement sub-object supports partial overrides — provide only the fields you need:

```js
// Override just the value; unit and LOINC metadata are filled in automatically
generateVitals({
  height:           { value: 180 },
  weight:           { value: 90 },
  bloodPressure:    { systolic: { value: 135 }, diastolic: { value: 88 } },
  oxygenSaturation: { value: 96 },
});
```

---

#### `generateEncounter(overrides?)`

Generates a clinical encounter record following **FHIR R4** Encounter field conventions. When `status` is `Finished`, `endDate` and `duration` are automatically calculated.

```js
generateEncounter({ class: 'Ambulatory', status: 'Finished', reasonCode: 'I10' });
// {
//   encounterId:       "ENC-509124",
//   status:            "Finished",
//   class:             "Ambulatory",
//   type:              "Office Visit",
//   startDate:         "2024-02-20",
//   endDate:           "2024-02-20",
//   duration:          35,
//   reasonCode:        "I10",
//   reasonDescription: "Essential (primary) hypertension",
//   location:          "Outpatient Clinic"
// }
```

| Field | Values |
|---|---|
| `status` | `Finished`, `In Progress`, `Planned`, `Cancelled` |
| `class` | `Ambulatory`, `Emergency`, `Inpatient`, `Observation`, `Telehealth` |
| `reasonCode` | Any ICD-10-CM code — overriding auto-fills `reasonDescription` |
| `duration` | Auto-set in minutes when `Finished`; `null` otherwise |
| `endDate` | Auto-set when `Finished`; `null` otherwise |

**Auto-generated duration ranges by class:**

| Class | Range |
|---|---|
| Ambulatory | 15–60 min |
| Telehealth | 10–30 min |
| Emergency | 60–480 min (1–8 hr) |
| Observation | 240–1440 min (4–24 hr) |
| Inpatient | 1440–10080 min (1–7 days) |

---

### Validators

All validators return `{ valid: boolean, errors: string[] }`. All errors are collected in a single call — no fail-fast.

| Validator | Checks |
|---|---|
| `validatePatient(p)` | ID format, DOB not future, age consistent with DOB, blood group enum, US phone, email, fullName consistency |
| `validateMember(m)` | ID formats, valid ISO date, status enum, nested `plan` object, nested `eligibility` object |
| `validateEmployee(e)` | ID format, DOB not future, status enum, email, nested `department`, nested `designation` |
| `validateDiagnosis(d)` | ID format, code/description/category non-empty, `type` and `status` enums, onsetDate not future |
| `validateLabResult(l)` | ID format, LOINC code non-empty, value non-negative number, referenceRange shape, interpretation and status enums, collectedDate not future |
| `validateMedication(m)` | ID format, all string fields non-empty, `status` enum |
| `validateVitals(v)` | ID format, recordedDate not future, each vital sub-object has numeric value + non-empty unit + loincCode, bloodPressure shape, oxygenSaturation 0–100 |
| `validateEncounter(e)` | ID format, status/class enums, startDate not future, endDate ≥ startDate when present, duration non-negative integer when present |

```js
import { generateLabResult, validateLabResult } from 'health-data-faker';

const lab = generateLabResult();
const { valid, errors } = validateLabResult(lab);
// { valid: true, errors: [] }

// Invalid record — all errors collected at once
validateLabResult({
  labId:          'bad',
  loincCode:      '2345-7',
  loincDisplay:   'Glucose',
  shortName:      'Glucose',
  value:          -5,            // negative — invalid
  unit:           'mg/dL',
  referenceRange: { low: 70, high: 99 },
  interpretation: 'Normal',
  status:         'pending',     // not a valid status — invalid
  collectedDate:  '2099-01-01', // future date — invalid
  category:       'Metabolic',
});
// {
//   valid: false,
//   errors: [
//     '"labId" must match format PREFIX-DIGITS (e.g. PAT-10001)',
//     '"value" must be a non-negative finite number',
//     '"status" must be one of [final, preliminary, corrected, cancelled]',
//     '"collectedDate" must not be a future date'
//   ]
// }
```

---

## Common test scenarios

```js
import {
  generatePatient, generateMember, generateEmployee,
  generateDiagnosis, generateLabResult, generateMedication,
  generateVitals, generateEncounter,
} from 'health-data-faker';

// ── Demographics ─────────────────────────────────────────────────────────────

const senior   = generatePatient({ age: 72 });
const minor    = generatePatient({ age: 16 });
const female45 = generatePatient({ gender: 'Female', age: 45 });

const activeMember    = generateMember({ status: 'Active' });
const terminatedMember = generateMember({ status: 'Terminated' });
const platinumPPO     = generateMember({
  plan:   { name: 'Aetna Premier', type: 'PPO', tier: 'Platinum', provider: 'Aetna' },
  status: 'Active',
});

const cardiologyPhysician = generateEmployee({
  designation: { title: 'Physician', category: 'Clinical' },
  department:  { name: 'Cardiology', code: 'CD' },
  status:      'Active',
});

// ── Clinical ──────────────────────────────────────────────────────────────────

// Chronic comorbidities for a patient
const comorbidities = [
  generateDiagnosis({ code: 'E11.9', type: 'Primary',     status: 'Chronic' }),
  generateDiagnosis({ code: 'I10',   type: 'Comorbidity', status: 'Chronic' }),
  generateDiagnosis({ code: 'E78.5', type: 'Comorbidity', status: 'Active'  }),
];

// Abnormal lab results (out-of-range values)
const highGlucose  = generateLabResult({ loincCode: '2345-7', value: 210 });  // Critical High
const lowPotassium = generateLabResult({ loincCode: '2823-3', value: 2.8 });  // Low

// Specific medication lookup
const metformin  = generateMedication({ rxcui: '860975', status: 'Active', frequency: 'Twice daily' });
const lisinopril = generateMedication({ rxcui: '314076', status: 'Active' });

// Vitals with elevated BP
const hypertensiveVitals = generateVitals({
  bloodPressure: { systolic: { value: 162 }, diastolic: { value: 98 } },
});

// Different encounter classes
const officeVisit  = generateEncounter({ class: 'Ambulatory', status: 'Finished', type: 'Office Visit' });
const erVisit      = generateEncounter({ class: 'Emergency',  status: 'Finished' });
const telehealth   = generateEncounter({ class: 'Telehealth', status: 'Finished' });
const plannedVisit = generateEncounter({ status: 'Planned' });
// → plannedVisit.endDate === null, plannedVisit.duration === null

// ── Bulk seeding ──────────────────────────────────────────────────────────────

const patients    = Array.from({ length: 1000 }, () => generatePatient());
const encounters  = Array.from({ length: 500  }, () => generateEncounter({ status: 'Finished' }));
const labResults  = Array.from({ length: 200  }, () => generateLabResult());
```

---

## Playwright API testing

```js
import { test, expect } from '@playwright/test';
import {
  generatePatient,
  generateEncounter,
  generateLabResult,
  validatePatient,
  validateEncounter,
} from 'health-data-faker';

test('POST /api/patients — creates a female patient aged 45', async ({ request }) => {
  const payload = generatePatient({ gender: 'Female', age: 45 });

  // Validate before sending
  const { valid, errors } = validatePatient(payload);
  expect(valid, errors.join(', ')).toBe(true);

  const response = await request.post('https://your-api.com/api/patients', { data: payload });
  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.gender).toBe('Female');
  expect(body.age).toBe(45);
});

test('POST /api/encounters — finished ambulatory encounter with hypertension reason', async ({ request }) => {
  const payload = generateEncounter({
    class:      'Ambulatory',
    status:     'Finished',
    reasonCode: 'I10',
  });

  const { valid } = validateEncounter(payload);
  expect(valid).toBe(true);
  expect(payload.duration).toBeGreaterThan(0);
  expect(payload.endDate).not.toBeNull();

  const response = await request.post('https://your-api.com/api/encounters', { data: payload });
  expect(response.status()).toBe(201);
});

test('seeds 50 patients concurrently', async ({ request }) => {
  const payloads = Array.from({ length: 50 }, () => generatePatient());

  const responses = await Promise.all(
    payloads.map(p => request.post('https://your-api.com/api/patients', { data: p }))
  );

  responses.forEach(r => expect(r.status()).toBe(201));
});
```

---

## Fixture datasets

All data lives in `src/data/` as plain JSON — easy to read and extend.

### Demographics

| File | Contents |
|---|---|
| `firstNames.json` | 50 male, 50 female, 20 neutral first names |
| `lastNames.json` | 101 surnames (multicultural) |
| `genders.json` | 5 gender options including non-binary |
| `bloodGroups.json` | All 8 ABO/Rh blood groups |
| `insurancePlans.json` | 15 plans across 5 providers (HMO, PPO, EPO) |
| `departments.json` | 25 clinical and administrative departments |
| `employmentRoles.json` | 30 roles across 5 categories |

### Clinical

| File | Contents | Standard |
|---|---|---|
| `icd10Codes.json` | 50 diagnosis codes across 10 categories | ICD-10-CM (CMS, public domain) |
| `loincLabs.json` | 30 lab tests with reference ranges and units | LOINC (Regenstrief, free with attribution) |
| `medications.json` | 30 medications with RxCUI, generic/brand names, strength | RxNorm (NLM, freely redistributable) |
| `encounterTypes.json` | Encounter classes, types, and location names | — |

---

## Project structure

```
health-data-faker/
├── src/
│   ├── data/                  # JSON fixture datasets (demographics + clinical)
│   ├── generators/
│   │   ├── patient.js         # generatePatient
│   │   ├── member.js          # generateMember
│   │   ├── employee.js        # generateEmployee
│   │   ├── diagnosis.js       # generateDiagnosis  (ICD-10-CM)
│   │   ├── lab.js             # generateLabResult  (LOINC)
│   │   ├── medication.js      # generateMedication (RxNorm)
│   │   ├── vitals.js          # generateVitals     (LOINC + FHIR)
│   │   ├── encounter.js       # generateEncounter  (FHIR R4)
│   │   └── identifiers.js     # ID creator utilities
│   ├── validators/
│   │   ├── patient.js         # validatePatient
│   │   ├── member.js          # validateMember
│   │   ├── employee.js        # validateEmployee
│   │   ├── diagnosis.js       # validateDiagnosis
│   │   ├── lab.js             # validateLabResult
│   │   ├── medication.js      # validateMedication
│   │   ├── vitals.js          # validateVitals
│   │   ├── encounter.js       # validateEncounter
│   │   └── rules.js           # Shared validation primitives
│   ├── utils/
│   │   └── random.js          # Core random primitives (no external deps)
│   └── index.js               # Public API — 16 named exports
├── tests/                     # 525 unit tests across 20 test suites
├── examples/
│   ├── clinical-demo.js       # All 5 clinical generators with examples
│   └── playwright/            # Playwright spec examples
└── NOTICES                    # Third-party attributions (LOINC, ICD-10-CM, RxNorm)
```

---

## Third-party notices

This package uses data from open healthcare standards:

- **LOINC** codes are copyright Regenstrief Institute, Inc. and the LOINC Committee. Used under the [LOINC license](https://loinc.org/license/).
- **ICD-10-CM** codes are published by CMS and NCHS. As US government works, they are in the public domain.
- **RxNorm** identifiers are from the NLM RxNorm database, freely available for use and redistribution.

See [`NOTICES`](./NOTICES) for full attribution details.

---

## Contributing

Contributions are welcome — new generators, fixture data, validators, and examples.
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## License

[MIT](./LICENSE) — free to use in personal and commercial projects.
