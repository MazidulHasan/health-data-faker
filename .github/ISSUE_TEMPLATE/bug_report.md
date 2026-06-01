---
name: Bug report
about: Something is broken or producing incorrect output
title: "fix: <short description of the bug>"
labels: bug
assignees: ""
---

## What happened?

<!-- A clear description of the bug. What did you observe? -->

## What did you expect to happen?

<!-- What should the correct behaviour be? -->

## Reproduction steps

<!-- Minimal code that reproduces the bug. -->

```js
import { generatePatient } from 'health-data-faker';

const patient = generatePatient();
console.log(patient);
// Expected: ...
// Got: ...
```

## Environment

| Field | Value |
|---|---|
| `health-data-faker` version | e.g. `0.1.0` |
| Node.js version | e.g. `20.11.0` |
| OS | e.g. `macOS 14`, `Windows 11`, `Ubuntu 22.04` |

## Additional context

<!-- Paste relevant output, error messages, or stack traces here. -->
