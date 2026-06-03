import { validateLabResult } from '../../src/validators/lab.js';
import { generateLabResult } from '../../src/generators/lab.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateLabResult — generated records', () => {
  test('passes for 50 randomly generated lab results', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateLabResult(generateLabResult());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Return shape ─────────────────────────────────────────────────────────────

describe('validateLabResult — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateLabResult(generateLabResult());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateLabResult(null).valid).toBe(false);
    expect(validateLabResult(42).valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateLabResult — required fields', () => {
  const REQUIRED = [
    'labId', 'loincCode', 'loincDisplay', 'shortName', 'value',
    'unit', 'referenceRange', 'interpretation', 'status', 'collectedDate', 'category',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const lab = generateLabResult();
      delete lab[field];
      const r = validateLabResult(lab);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── labId format ─────────────────────────────────────────────────────────────

describe('validateLabResult — labId format', () => {
  test('passes with valid ID', () => {
    expect(validateLabResult(generateLabResult({ labId: 'LAB-000001' })).valid).toBe(true);
  });

  test('fails with no prefix', () => {
    const r = validateLabResult(generateLabResult({ labId: '123456' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('labId'))).toBe(true);
  });
});

// ─── value ────────────────────────────────────────────────────────────────────

describe('validateLabResult — value', () => {
  test('fails when value is negative', () => {
    const r = validateLabResult(generateLabResult({ value: -1, interpretation: 'Low' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"value"'))).toBe(true);
  });

  test('fails when value is not a number', () => {
    const lab = generateLabResult();
    lab.value = 'high';
    expect(validateLabResult(lab).valid).toBe(false);
  });
});

// ─── interpretation ───────────────────────────────────────────────────────────

describe('validateLabResult — interpretation', () => {
  test('passes for all valid interpretations', () => {
    ['Normal', 'High', 'Low', 'Critical High', 'Critical Low'].forEach(interpretation => {
      expect(validateLabResult(generateLabResult({ interpretation })).valid).toBe(true);
    });
  });

  test('fails for invalid interpretation', () => {
    const r = validateLabResult(generateLabResult({ interpretation: 'Unknown' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"interpretation"'))).toBe(true);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateLabResult — status', () => {
  test('passes for all valid statuses', () => {
    ['final', 'preliminary', 'corrected', 'cancelled'].forEach(status => {
      expect(validateLabResult(generateLabResult({ status })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateLabResult(generateLabResult({ status: 'pending' }));
    expect(r.valid).toBe(false);
  });
});

// ─── referenceRange ───────────────────────────────────────────────────────────

describe('validateLabResult — referenceRange', () => {
  test('fails when referenceRange is not an object', () => {
    const lab = generateLabResult();
    lab.referenceRange = 'normal';
    expect(validateLabResult(lab).valid).toBe(false);
  });

  test('fails when referenceRange.low is not a number', () => {
    const lab = generateLabResult();
    lab.referenceRange = { low: 'zero', high: 100 };
    expect(validateLabResult(lab).valid).toBe(false);
  });
});

// ─── collectedDate ────────────────────────────────────────────────────────────

describe('validateLabResult — collectedDate', () => {
  test('fails for future date', () => {
    const r = validateLabResult(generateLabResult({ collectedDate: '2099-01-01' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('collectedDate'))).toBe(true);
  });
});
