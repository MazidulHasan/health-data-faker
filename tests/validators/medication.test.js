import { validateMedication } from '../../src/validators/medication.js';
import { generateMedication } from '../../src/generators/medication.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateMedication — generated records', () => {
  test('passes for 50 randomly generated medications', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateMedication(generateMedication());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Return shape ─────────────────────────────────────────────────────────────

describe('validateMedication — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateMedication(generateMedication());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateMedication(null).valid).toBe(false);
    expect(validateMedication('string').valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateMedication — required fields', () => {
  const REQUIRED = [
    'medicationId', 'rxcui', 'name', 'genericName', 'brandName',
    'strength', 'form', 'route', 'frequency', 'status',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const med = generateMedication();
      delete med[field];
      const r = validateMedication(med);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── medicationId format ──────────────────────────────────────────────────────

describe('validateMedication — medicationId format', () => {
  test('passes with valid ID', () => {
    expect(validateMedication(generateMedication({ medicationId: 'MED-000001' })).valid).toBe(true);
  });

  test('fails with no prefix', () => {
    const r = validateMedication(generateMedication({ medicationId: '123456' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('medicationId'))).toBe(true);
  });

  test('fails with lowercase prefix', () => {
    expect(validateMedication(generateMedication({ medicationId: 'med-000001' })).valid).toBe(false);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateMedication — status', () => {
  test('passes for all valid statuses', () => {
    ['Active', 'Discontinued', 'Hold', 'Completed'].forEach(status => {
      expect(validateMedication(generateMedication({ status })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateMedication(generateMedication({ status: 'Expired' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"status"'))).toBe(true);
  });
});

// ─── string fields ────────────────────────────────────────────────────────────

describe('validateMedication — string fields', () => {
  test('fails when rxcui is empty string', () => {
    const med = generateMedication();
    med.rxcui = '';
    expect(validateMedication(med).valid).toBe(false);
  });

  test('fails when name is empty string', () => {
    const med = generateMedication();
    med.name = '';
    expect(validateMedication(med).valid).toBe(false);
  });

  test('fails when frequency is empty string', () => {
    const med = generateMedication();
    med.frequency = '';
    expect(validateMedication(med).valid).toBe(false);
  });
});
