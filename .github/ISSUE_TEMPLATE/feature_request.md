---
name: Feature request
about: Propose a new generator, validator, fixture dataset, or other improvement
title: "feat: <short description>"
labels: enhancement
assignees: ""
---

## What would you like added or changed?

<!-- A clear description of the feature. -->

## What problem does it solve?

<!-- Why is this useful for QA engineers or developers using this library? -->

## Proposed API (if a new generator or validator)

<!-- Show example usage and expected output. -->

```js
import { generateClaim } from 'health-data-faker';

const claim = generateClaim();
// Expected output:
// {
//   claimId:       "CLM-00123",
//   diagnosisCode: "I10",
//   amount:        342.50,
//   status:        "Approved"
// }
```

## Proposed fixture data (if a new dataset)

<!-- List sample values for any new JSON fixture needed. -->

## Alternatives considered

<!-- Have you thought of other approaches? Why is this one better? -->

## Are you willing to implement this?

- [ ] Yes, I'd like to submit a PR
- [ ] No, I'm requesting it for someone else to implement
