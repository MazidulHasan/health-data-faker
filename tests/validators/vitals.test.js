import { validateVitals } from '../../src/validators/vitals.js';
import { generateVitals } from '../../src/generators/vitals.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateVitals — generated records', () => {
  test('passes for 50 randomly generated vitals', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateVitals(generateVitals());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Return shape ─────────────────────────────────────────────────────────────

describe('validateVitals — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateVitals(generateVitals());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateVitals(null).valid).toBe(false);
    expect(validateVitals('string').valid).toBe(false);
  });
});

// ─── Required top-level fields ────────────────────────────────────────────────

describe('validateVitals — required fields', () => {
  const REQUIRED = [
    'vitalId', 'recordedDate', 'height', 'weight', 'bloodPressure',
    'heartRate', 'temperature', 'oxygenSaturation', 'respiratoryRate', 'bmi',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const v = generateVitals();
      delete v[field];
      const r = validateVitals(v);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── vitalId format ───────────────────────────────────────────────────────────

describe('validateVitals — vitalId format', () => {
  test('passes with valid ID', () => {
    expect(validateVitals(generateVitals({ vitalId: 'VIT-000001' })).valid).toBe(true);
  });

  test('fails with no prefix', () => {
    const r = validateVitals(generateVitals({ vitalId: '123456' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('vitalId'))).toBe(true);
  });
});

// ─── recordedDate ─────────────────────────────────────────────────────────────

describe('validateVitals — recordedDate', () => {
  test('fails for future date', () => {
    const r = validateVitals(generateVitals({ recordedDate: '2099-01-01' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('recordedDate'))).toBe(true);
  });

  test('fails for invalid date format', () => {
    const r = validateVitals(generateVitals({ recordedDate: '01/15/2023' }));
    expect(r.valid).toBe(false);
  });
});

// ─── vital sub-objects ────────────────────────────────────────────────────────

describe('validateVitals — vital sub-objects', () => {
  test('fails when height is not an object', () => {
    const v = generateVitals();
    v.height = 170;
    expect(validateVitals(v).valid).toBe(false);
  });

  test('fails when height.value is not a number', () => {
    const v = generateVitals();
    v.height = { value: 'tall', unit: 'cm', loincCode: '8302-2', loincDisplay: 'Body height' };
    expect(validateVitals(v).valid).toBe(false);
  });

  test('fails when height.loincCode is empty', () => {
    const v = generateVitals();
    v.height = { value: 170, unit: 'cm', loincCode: '', loincDisplay: 'Body height' };
    expect(validateVitals(v).valid).toBe(false);
  });
});

// ─── bloodPressure ────────────────────────────────────────────────────────────

describe('validateVitals — bloodPressure', () => {
  test('fails when bloodPressure is not an object', () => {
    const v = generateVitals();
    v.bloodPressure = '120/80';
    expect(validateVitals(v).valid).toBe(false);
  });

  test('fails when bloodPressure.systolic is missing', () => {
    const v = generateVitals();
    delete v.bloodPressure.systolic;
    expect(validateVitals(v).valid).toBe(false);
  });

  test('fails when bloodPressure.diastolic.value is not a number', () => {
    const v = generateVitals();
    v.bloodPressure.diastolic.value = 'low';
    expect(validateVitals(v).valid).toBe(false);
  });
});

// ─── oxygenSaturation range ───────────────────────────────────────────────────

describe('validateVitals — oxygenSaturation range', () => {
  test('fails when oxygenSaturation.value is above 100', () => {
    const v = generateVitals({ oxygenSaturation: { value: 105 } });
    expect(validateVitals(v).valid).toBe(false);
    expect(validateVitals(v).errors.some(e => e.includes('oxygenSaturation'))).toBe(true);
  });

  test('passes for value of exactly 100', () => {
    const v = generateVitals({ oxygenSaturation: { value: 100 } });
    expect(validateVitals(v).valid).toBe(true);
  });
});
