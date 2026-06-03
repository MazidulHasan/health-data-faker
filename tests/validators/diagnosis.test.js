import { validateDiagnosis } from '../../src/validators/diagnosis.js';
import { generateDiagnosis } from '../../src/generators/diagnosis.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateDiagnosis — generated records', () => {
  test('passes for 50 randomly generated diagnoses', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateDiagnosis(generateDiagnosis());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Return shape ─────────────────────────────────────────────────────────────

describe('validateDiagnosis — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateDiagnosis(generateDiagnosis());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateDiagnosis(null).valid).toBe(false);
    expect(validateDiagnosis('string').valid).toBe(false);
    expect(validateDiagnosis(42).valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateDiagnosis — required fields', () => {
  const REQUIRED = ['diagnosisId', 'code', 'description', 'category', 'type', 'onsetDate', 'status'];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const dx = generateDiagnosis();
      delete dx[field];
      const r = validateDiagnosis(dx);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── diagnosisId format ───────────────────────────────────────────────────────

describe('validateDiagnosis — diagnosisId format', () => {
  test('passes with valid ID format', () => {
    expect(validateDiagnosis(generateDiagnosis({ diagnosisId: 'DX-000001' })).valid).toBe(true);
  });

  test('fails when diagnosisId has no prefix', () => {
    const r = validateDiagnosis(generateDiagnosis({ diagnosisId: '123456' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('diagnosisId'))).toBe(true);
  });

  test('fails when diagnosisId has lowercase prefix', () => {
    expect(validateDiagnosis(generateDiagnosis({ diagnosisId: 'dx-000001' })).valid).toBe(false);
  });
});

// ─── type ─────────────────────────────────────────────────────────────────────

describe('validateDiagnosis — type', () => {
  test('passes for all valid types', () => {
    ['Primary', 'Secondary', 'Comorbidity'].forEach(type => {
      expect(validateDiagnosis(generateDiagnosis({ type })).valid).toBe(true);
    });
  });

  test('fails for invalid type', () => {
    const r = validateDiagnosis(generateDiagnosis({ type: 'Tertiary' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"type"'))).toBe(true);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateDiagnosis — status', () => {
  test('passes for all valid statuses', () => {
    ['Active', 'Resolved', 'Chronic', 'Ruled Out'].forEach(status => {
      expect(validateDiagnosis(generateDiagnosis({ status })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateDiagnosis(generateDiagnosis({ status: 'Unknown' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"status"'))).toBe(true);
  });
});

// ─── onsetDate ────────────────────────────────────────────────────────────────

describe('validateDiagnosis — onsetDate', () => {
  test('fails for a future date', () => {
    const r = validateDiagnosis(generateDiagnosis({ onsetDate: '2099-01-01' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('onsetDate'))).toBe(true);
  });

  test('fails for invalid format', () => {
    const r = validateDiagnosis(generateDiagnosis({ onsetDate: 'January 1 2020' }));
    expect(r.valid).toBe(false);
  });
});

// ─── Multiple errors ──────────────────────────────────────────────────────────

describe('validateDiagnosis — multiple errors', () => {
  test('collects all errors at once', () => {
    const r = validateDiagnosis({
      diagnosisId: 'bad-id',
      code:        'E11.9',
      description: 'Test',
      category:    'Endocrine',
      type:        'InvalidType',
      onsetDate:   '2099-01-01',
      status:      'BadStatus',
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(1);
  });
});
