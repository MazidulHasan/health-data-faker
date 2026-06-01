## Summary

<!-- What does this PR add, fix, or change? One or two sentences. -->

## Type of change

- [ ] Bug fix
- [ ] New generator
- [ ] New validator
- [ ] New / expanded fixture data
- [ ] Test improvement
- [ ] Documentation
- [ ] Chore / refactor

## Related issue

Closes #<!-- issue number -->

## Changes made

<!-- List the files added or modified and what each one does. -->

- `src/generators/foo.js` — added `generateFoo()` with fields: ...
- `src/validators/foo.js` — added `validateFoo()` with checks: ...
- `src/data/foo.json` — added N fixture entries for ...
- `src/index.js` — exported `generateFoo` and `validateFoo`
- `tests/generators/foo.test.js` — N tests covering shape, overrides, ...
- `tests/validators/foo.test.js` — N tests covering required fields, formats, ...

## Design constraints checklist

- [ ] No Faker / @faker-js/faker used
- [ ] No external random libraries used
- [ ] No new runtime dependencies added (`dependencies` in package.json is empty)
- [ ] ES modules only — no `require()`
- [ ] Generator accepts an `overrides` object and every field is overridable
- [ ] Matching validator added for any new generator
- [ ] New functions exported from `src/index.js`

## Tests

- [ ] `npm test` passes locally with no failures
- [ ] New tests added for all new code
- [ ] Generated records pass their own validator (round-trip test included)

## Sample output

<!-- Paste example output from running your generator or example script. -->

```json
{
  "exampleField": "exampleValue"
}
```
