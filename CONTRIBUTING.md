# Contributing to health-data-faker

Thank you for your interest in contributing. This guide covers everything you need
to get started — from filing a bug to shipping a new generator.

---

## Table of contents

1. [Code of conduct](#code-of-conduct)
2. [How to contribute](#how-to-contribute)
3. [Project structure](#project-structure)
4. [Development setup](#development-setup)
5. [Adding a new generator](#adding-a-new-generator)
6. [Adding fixture data](#adding-fixture-data)
7. [Writing tests](#writing-tests)
8. [Commit style](#commit-style)
9. [Pull request process](#pull-request-process)
10. [Design constraints](#design-constraints)

---

## Code of conduct

Be respectful. Harassment, discrimination, and personal attacks will not be
tolerated. Contributors are expected to engage professionally in all project
spaces (issues, PRs, discussions).

---

## How to contribute

| Type | Where to start |
|---|---|
| Bug report | Open a GitHub issue using the **Bug report** template |
| Feature request | Open a GitHub issue using the **Feature request** template |
| New generator | Open an issue first to discuss, then submit a PR |
| New fixture data | Submit a PR directly — low risk, easy to review |
| Documentation | Submit a PR directly |
| Tests | Submit a PR directly |

For anything beyond a small fix, **open an issue before writing code** so the
approach can be agreed on before you invest time.

---

## Project structure

```
health-data-faker/
├── src/
│   ├── data/              # JSON fixture datasets (names, plans, roles, etc.)
│   ├── generators/        # One file per entity (patient, member, employee)
│   ├── validators/        # One file per entity + shared rules.js
│   ├── utils/
│   │   └── random.js      # Core random primitives — no external deps
│   └── index.js           # Public API surface (explicit named exports only)
├── tests/
│   ├── data/              # Fixture dataset tests
│   ├── generators/        # Generator unit tests
│   ├── validators/        # Validator unit tests
│   └── index.test.js      # Public export surface tests
├── examples/              # Runnable demos and Playwright spec examples
└── package.json
```

The rule: **one generator per file, one test file per generator.**

---

## Development setup

**Requirements:** Node.js ≥ 18

```bash
git clone https://github.com/MazidulHasan/health-data-faker.git
cd health-data-faker
npm install
npm test
```

All 287 tests should pass on a clean clone. If they do not, open an issue.

---

## Adding a new generator

Follow these steps exactly — they keep the codebase consistent.

### 1. Create the generator file

```
src/generators/yourEntity.js
```

- Import only from `../utils/random.js`, `../generators/identifiers.js`,
  and JSON files under `../data/`.
- Export a single named function: `generateYourEntity(overrides = {})`.
- Every field must be overridable via the `overrides` argument.
- Use `??` (nullish coalescing) to apply overrides, not `||`.

```js
export function generateYourEntity(overrides = {}) {
  return {
    entityId: overrides.entityId ?? createSomeId(),
    name:     overrides.name     ?? randomItem(someData),
    // ...
  };
}
```

### 2. Add fixture data if needed

Add a new JSON file under `src/data/`. See [Adding fixture data](#adding-fixture-data).

### 3. Add a validator

Create `src/validators/yourEntity.js` using the shared primitives in
`src/validators/rules.js`. Return `{ valid: boolean, errors: string[] }`.

### 4. Export from the public API

Add two named exports to `src/index.js`:

```js
export { generateYourEntity } from './generators/yourEntity.js';
export { validateYourEntity } from './validators/yourEntity.js';
```

### 5. Write tests

Create `tests/generators/yourEntity.test.js` and
`tests/validators/yourEntity.test.js`. See [Writing tests](#writing-tests).

### 6. Add an example

Create `examples/yourEntity-demo.js` with runnable sample output.

---

## Adding fixture data

Fixture files live in `src/data/` as plain JSON.

**Rules:**
- Keys must be camelCase arrays or arrays of objects.
- No duplicates within a dataset.
- If adding objects, every entry must have the same shape.
- Minimum 10 entries per new dataset; aim for 25–50.
- Values must be healthcare/business-safe — no offensive content.
- Add a corresponding test in `tests/data/fixtures.test.js` that
  validates structure, required fields, and uniqueness.

**Example — adding diagnoses:**

```json
{
  "diagnoses": [
    { "code": "I10",   "description": "Essential hypertension" },
    { "code": "E11.9", "description": "Type 2 diabetes mellitus without complications" }
  ]
}
```

---

## Writing tests

- Test files mirror source files: `src/generators/foo.js` →
  `tests/generators/foo.test.js`.
- Use Jest `describe` blocks grouped by feature, not by function name.
- Every generator test must include:
  - Shape test (all fields present, correct count)
  - Each field comes from fixture data (loop 20–50 times)
  - Each override is respected
  - Combined overrides work together
- Every validator test must include:
  - 50 randomly generated records all pass
  - Each required field — missing → fails with a message naming the field
  - Each format rule — invalid value → fails with a message naming the field
  - Multiple errors are collected in a single call (not short-circuited)
- Do not mock `Math.random` — use probabilistic assertions instead
  (run 100–300 times, check both branches appear).

Run tests:

```bash
npm test
```

---

## Commit style

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short summary>
```

| Type | When to use |
|---|---|
| `feat` | New generator, validator, or fixture |
| `fix` | Bug fix |
| `test` | Adding or fixing tests only |
| `data` | Adding or updating fixture JSON |
| `chore` | Build, config, dependency changes |
| `docs` | Documentation only |
| `refactor` | Code change with no behaviour change |

**Examples:**

```
feat(generator): add generateClaim() with claimId and diagnosisCode
data(fixtures): add 30 ICD-10 diagnosis codes to diagnoses.json
fix(validator): validatePatient age check off-by-one on birthday
test(member): add test for Suspended eligibility state
```

Keep the summary under 72 characters. No period at the end.

---

## Pull request process

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes following the guidelines above.
3. Run `npm test` and confirm all tests pass.
4. Push your branch and open a PR against `main`.
5. Fill in the pull request template completely.
6. A maintainer will review within a few days. Please be patient.
7. Address review feedback in new commits — do not force-push during review.
8. Once approved, a maintainer will merge using **squash merge**.

---

## Design constraints

These are non-negotiable. PRs that violate them will not be merged.

| Constraint | Reason |
|---|---|
| **No Faker / @faker-js/faker** | Core project principle — everything built from scratch |
| **No external random libraries** | Zero runtime dependencies is a feature |
| **No runtime dependencies** | `package.json` `dependencies` must remain empty |
| **ES modules only** | `"type": "module"` — no CommonJS `require()` |
| **Node.js ≥ 18** | Minimum engine version |
| **Every generator must accept overrides** | QA engineers need pinned fields |
| **Every generator needs a matching validator** | Library is only useful if output can be verified |
| **Every public function must be exported from `src/index.js`** | Single stable entry point |
| **Test coverage required for all new code** | No untested generators merged |
