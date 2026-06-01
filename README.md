# health-data-faker

[![Tests](https://github.com/MazidulHasan/health-data-faker/actions/workflows/test.yml/badge.svg)](https://github.com/MazidulHasan/health-data-faker/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/health-data-faker?style=flat)](https://www.npmjs.com/package/health-data-faker)
[![License: MIT](https://img.shields.io/npm/l/health-data-faker?style=flat)](./LICENSE)
[![Node.js](https://img.shields.io/node/v/health-data-faker?style=flat)](https://nodejs.org)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=flat)](./package.json)

Domain-specific test data generation for healthcare, member, and employee records.
Built for QA automation, API testing, development seeding, and performance testing.

**No Faker. No external dependencies. Pure JavaScript.**

---

## Why health-data-faker?

Most test data libraries are generic. Healthcare applications need data that looks real — realistic patient demographics, valid insurance plan structures, coherent eligibility states, and properly formatted identifiers like MRNs and policy numbers.

`health-data-faker` generates all of it out of the box, with:

- **Zero runtime dependencies** — nothing to audit, nothing to update
- **Override system** — pin any field for targeted test scenarios
- **Built-in validators** — confirm generated data meets your schema before it hits the wire
- **Playwright-ready** — designed to drop into API test suites

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
  generateMember,
  generateEmployee,
  validatePatient,
} from 'health-data-faker';

// Generate a random patient
const patient = generatePatient();
console.log(patient);

// Override specific fields for a test scenario
const female45 = generatePatient({ gender: 'Female', age: 45 });

// Validate before sending to an API
const { valid, errors } = validatePatient(patient);
console.log(valid);  // true
```

---

## API

### Generators

All generators accept an optional `overrides` object. Any field can be pinned — unspecified fields are randomised.

#### `generatePatient(overrides?)`

```js
import { generatePatient } from 'health-data-faker';

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
| `bloodGroup: "O-"` | Pins the blood group |
| Any field | Passed through as-is |

---

#### `generateMember(overrides?)`

```js
import { generateMember } from 'health-data-faker';

generateMember({ status: 'Active' });
// {
//   memberId:      "MBR-18871145",
//   plan: {
//     name:     "Cigna Connect",
//     type:     "HMO",
//     tier:     "Bronze",
//     provider: "Cigna"
//   },
//   policyNumber:  "POL-75162",
//   effectiveDate: "2018-09-18",
//   status:        "Active",
//   eligibility: {
//     isEligible: true,
//     reason:     "Active coverage"
//   }
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
import { generateEmployee } from 'health-data-faker';

generateEmployee({ status: 'Active' });
// {
//   employeeId:  "EMP-4957",
//   firstName:   "Samuel",
//   lastName:    "Gonzalez",
//   department: {
//     name: "Internal Medicine",
//     code: "IM"
//   },
//   designation: {
//     title:    "Supply Chain Coordinator",
//     category: "Operations"
//   },
//   joiningDate: "2020-09-07",
//   status:      "Active",
//   workEmail:   "samuel.gonzalez58@clinicworks.com"
// }
```

---

### Validators

All validators return `{ valid: boolean, errors: string[] }`.
`errors` is empty when `valid` is `true`.

#### `validatePatient(patient)`

Checks all 10 fields: ID format, date not in future, age consistent with DOB, valid blood group, US phone format, email format, `fullName === firstName + ' ' + lastName`.

#### `validateMember(member)`

Checks all 6 fields: ID formats, valid ISO date, status enum, nested `plan` object (type, tier, provider), nested `eligibility` object (`isEligible` is boolean, `reason` is non-empty string).

#### `validateEmployee(employee)`

Checks all 8 fields: ID format, date not in future, status enum, email format, nested `department` (uppercase code), nested `designation` (valid category).

```js
import { generatePatient, validatePatient } from 'health-data-faker';

const patient = generatePatient();
const { valid, errors } = validatePatient(patient);
// { valid: true, errors: [] }

// Invalid record — all errors collected in one call
validatePatient({
  patientId:   'pat-001',       // lowercase prefix — invalid
  firstName:   '',              // empty — invalid
  dateOfBirth: '2099-01-01',   // future date — invalid
  age:         -5,             // negative — invalid
  bloodGroup:  'X+',           // not a real blood group — invalid
  phone:       '8005551234',   // missing parentheses — invalid
  email:       'bademail',     // no @ — invalid
  // ...
});
// {
//   valid: false,
//   errors: [
//     '"firstName" is required',
//     '"patientId" must match format PREFIX-DIGITS (e.g. PAT-10001)',
//     '"dateOfBirth" must not be a future date',
//     '"age" must be a non-negative integer',
//     '"bloodGroup" must be one of [A+, A-, B+, B-, AB+, AB-, O+, O-]',
//     '"phone" must match US format (XXX) XXX-XXXX',
//     '"email" is not a valid email address',
//     ...
//   ]
// }
```

---

## Common test scenarios

```js
import {
  generatePatient,
  generateMember,
  generateEmployee,
} from 'health-data-faker';

// Specific demographics
const senior   = generatePatient({ age: 72 });
const minor    = generatePatient({ age: 16 });
const female45 = generatePatient({ gender: 'Female', age: 45 });

// Insurance edge cases
const activeMember     = generateMember({ status: 'Active' });
const terminatedMember = generateMember({ status: 'Terminated' });
const pendingMember    = generateMember({ status: 'Pending' });

// Specific insurance plan
const platinumMember = generateMember({
  plan: { name: 'Aetna Premier', type: 'PPO', tier: 'Platinum', provider: 'Aetna' },
  status: 'Active',
});

// Department / role targeting
const physician = generateEmployee({
  designation: { title: 'Physician', category: 'Clinical' },
  department:  { name: 'Cardiology', code: 'CD' },
  status:      'Active',
});

const onLeave = generateEmployee({ status: 'On Leave' });

// Bulk seeding (performance / load testing)
const patients   = Array.from({ length: 1000 }, () => generatePatient());
const members    = Array.from({ length: 500  }, () => generateMember());
const employees  = Array.from({ length: 200  }, () => generateEmployee());
```

---

## Playwright API testing

```js
import { test, expect } from '@playwright/test';
import { generatePatient, validatePatient } from 'health-data-faker';

test('POST /api/patients — creates a female patient aged 45', async ({ request }) => {
  const payload = generatePatient({ gender: 'Female', age: 45 });

  // Validate payload before sending
  const { valid, errors } = validatePatient(payload);
  expect(valid, errors.join(', ')).toBe(true);

  const response = await request.post('https://your-api.com/api/patients', {
    data: payload,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.gender).toBe('Female');
  expect(body.age).toBe(45);
});

// Bulk seeding for performance tests
test('seeds 50 patients concurrently', async ({ request }) => {
  const payloads = Array.from({ length: 50 }, () => generatePatient());

  const responses = await Promise.all(
    payloads.map(p =>
      request.post('https://your-api.com/api/patients', { data: p })
    )
  );

  responses.forEach(r => expect(r.status()).toBe(201));
});
```

Full Playwright spec examples are in [`examples/playwright/`](./examples/playwright/).

---

## Fixture datasets

All data lives in `src/data/` as plain JSON — easy to read and extend.

| File | Contents |
|---|---|
| `firstNames.json` | 50 male, 50 female, 20 neutral first names |
| `lastNames.json` | 101 surnames (multicultural) |
| `genders.json` | 5 gender options including non-binary |
| `bloodGroups.json` | All 8 ABO/Rh blood groups |
| `insurancePlans.json` | 15 plans across 5 providers (HMO, PPO, EPO) |
| `departments.json` | 25 clinical and administrative departments |
| `employmentRoles.json` | 30 roles across 5 categories |

---

## Project structure

```
health-data-faker/
├── src/
│   ├── data/              # JSON fixture datasets
│   ├── generators/        # generatePatient, generateMember, generateEmployee
│   ├── validators/        # validatePatient, validateMember, validateEmployee
│   ├── utils/
│   │   └── random.js      # Core random primitives (no external deps)
│   └── index.js           # Public API — explicit named exports
├── tests/                 # 287 unit tests across 10 test suites
└── examples/              # Runnable demos and Playwright spec examples
```

---

## Contributing

Contributions are welcome — new generators, fixture data, validators, and examples.
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.

---

## License

[MIT](./LICENSE) — free to use in personal and commercial projects.
