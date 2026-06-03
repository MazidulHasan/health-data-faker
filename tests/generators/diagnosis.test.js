import { generateDiagnosis } from '../../src/generators/diagnosis.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const icd10Data = require('../../src/data/icd10Codes.json');

const DIAGNOSIS_TYPES    = ['Primary', 'Secondary', 'Comorbidity'];
const DIAGNOSIS_STATUSES = ['Active', 'Resolved', 'Chronic', 'Ruled Out'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateDiagnosis — shape', () => {
  let dx;
  beforeEach(() => { dx = generateDiagnosis(); });

  test('returns a non-null object', () => {
    expect(typeof dx).toBe('object');
    expect(dx).not.toBeNull();
  });

  test('has all 7 required fields', () => {
    ['diagnosisId', 'code', 'description', 'category', 'type', 'onsetDate', 'status']
      .forEach(f => expect(dx).toHaveProperty(f));
  });

  test('has no extra unexpected fields', () => {
    expect(Object.keys(dx)).toHaveLength(7);
  });
});

// ─── diagnosisId ──────────────────────────────────────────────────────────────

describe('generateDiagnosis — diagnosisId', () => {
  test('matches DX-###### format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateDiagnosis().diagnosisId).toMatch(/^DX-\d{6}$/);
    }
  });

  test('override is respected', () => {
    expect(generateDiagnosis({ diagnosisId: 'DX-000001' }).diagnosisId).toBe('DX-000001');
  });
});

// ─── code / description / category ───────────────────────────────────────────

describe('generateDiagnosis — ICD-10 fields', () => {
  test('code comes from ICD-10 fixture', () => {
    const allCodes = icd10Data.icd10Codes.map(d => d.code);
    for (let i = 0; i < 30; i++) {
      expect(allCodes).toContain(generateDiagnosis().code);
    }
  });

  test('description matches the selected code', () => {
    for (let i = 0; i < 20; i++) {
      const dx = generateDiagnosis();
      const fixture = icd10Data.icd10Codes.find(d => d.code === dx.code);
      expect(dx.description).toBe(fixture.description);
    }
  });

  test('category matches the selected code', () => {
    for (let i = 0; i < 20; i++) {
      const dx = generateDiagnosis();
      const fixture = icd10Data.icd10Codes.find(d => d.code === dx.code);
      expect(dx.category).toBe(fixture.category);
    }
  });

  test('overriding code uses matching fixture data', () => {
    const dx = generateDiagnosis({ code: 'I10' });
    expect(dx.code).toBe('I10');
    expect(dx.description).toBe('Essential (primary) hypertension');
    expect(dx.category).toBe('Cardiovascular');
  });

  test('description and category overrides are respected', () => {
    const dx = generateDiagnosis({ description: 'Custom diagnosis', category: 'Custom' });
    expect(dx.description).toBe('Custom diagnosis');
    expect(dx.category).toBe('Custom');
  });
});

// ─── type ─────────────────────────────────────────────────────────────────────

describe('generateDiagnosis — type', () => {
  test('type is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(DIAGNOSIS_TYPES).toContain(generateDiagnosis().type);
    }
  });

  test('type override is respected', () => {
    expect(generateDiagnosis({ type: 'Primary' }).type).toBe('Primary');
    expect(generateDiagnosis({ type: 'Comorbidity' }).type).toBe('Comorbidity');
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateDiagnosis — status', () => {
  test('status is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(DIAGNOSIS_STATUSES).toContain(generateDiagnosis().status);
    }
  });

  test('status override is respected', () => {
    expect(generateDiagnosis({ status: 'Chronic' }).status).toBe('Chronic');
    expect(generateDiagnosis({ status: 'Resolved' }).status).toBe('Resolved');
  });
});

// ─── onsetDate ────────────────────────────────────────────────────────────────

describe('generateDiagnosis — onsetDate', () => {
  test('is a valid ISO date string', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateDiagnosis().onsetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('is not a future date', () => {
    for (let i = 0; i < 20; i++) {
      expect(new Date(generateDiagnosis().onsetDate).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateDiagnosis({ onsetDate: '2015-06-01' }).onsetDate).toBe('2015-06-01');
  });
});

// ─── combined overrides ───────────────────────────────────────────────────────

describe('generateDiagnosis — combined overrides', () => {
  test('all fields can be overridden together', () => {
    const dx = generateDiagnosis({
      diagnosisId: 'DX-999999',
      code:        'E11.9',
      type:        'Primary',
      status:      'Chronic',
      onsetDate:   '2018-01-01',
    });
    expect(dx.diagnosisId).toBe('DX-999999');
    expect(dx.code).toBe('E11.9');
    expect(dx.type).toBe('Primary');
    expect(dx.status).toBe('Chronic');
    expect(dx.onsetDate).toBe('2018-01-01');
  });
});
