import { validateEncounter } from '../../src/validators/encounter.js';
import { generateEncounter } from '../../src/generators/encounter.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateEncounter — generated records', () => {
  test('passes for 50 randomly generated encounters', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateEncounter(generateEncounter());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Return shape ─────────────────────────────────────────────────────────────

describe('validateEncounter — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateEncounter(generateEncounter());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateEncounter(null).valid).toBe(false);
    expect(validateEncounter(42).valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateEncounter — required fields', () => {
  const REQUIRED = [
    'encounterId', 'status', 'class', 'type', 'startDate',
    'reasonCode', 'reasonDescription', 'location',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const enc = generateEncounter();
      delete enc[field];
      const r = validateEncounter(enc);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── encounterId format ───────────────────────────────────────────────────────

describe('validateEncounter — encounterId format', () => {
  test('passes with valid ID', () => {
    expect(validateEncounter(generateEncounter({ encounterId: 'ENC-000001' })).valid).toBe(true);
  });

  test('fails with no prefix', () => {
    const r = validateEncounter(generateEncounter({ encounterId: '123456' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('encounterId'))).toBe(true);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateEncounter — status', () => {
  test('passes for all valid statuses', () => {
    ['Finished', 'In Progress', 'Planned', 'Cancelled'].forEach(status => {
      expect(validateEncounter(generateEncounter({ status })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateEncounter(generateEncounter({ status: 'Unknown' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"status"'))).toBe(true);
  });
});

// ─── class ────────────────────────────────────────────────────────────────────

describe('validateEncounter — class', () => {
  test('passes for all valid classes', () => {
    ['Ambulatory', 'Emergency', 'Inpatient', 'Observation', 'Telehealth'].forEach(cls => {
      expect(validateEncounter(generateEncounter({ class: cls })).valid).toBe(true);
    });
  });

  test('fails for invalid class', () => {
    const r = validateEncounter(generateEncounter({ class: 'Home' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('"class"'))).toBe(true);
  });
});

// ─── startDate ────────────────────────────────────────────────────────────────

describe('validateEncounter — startDate', () => {
  test('fails for a future date', () => {
    const r = validateEncounter(generateEncounter({ startDate: '2099-01-01' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('startDate'))).toBe(true);
  });

  test('fails for invalid format', () => {
    const r = validateEncounter(generateEncounter({ startDate: 'Jan 1 2023' }));
    expect(r.valid).toBe(false);
  });
});

// ─── endDate ─────────────────────────────────────────────────────────────────

describe('validateEncounter — endDate', () => {
  test('passes when endDate is null', () => {
    const enc = generateEncounter({ status: 'Planned' });
    expect(validateEncounter(enc).valid).toBe(true);
  });

  test('fails when endDate is before startDate', () => {
    const r = validateEncounter(generateEncounter({
      status:    'Finished',
      startDate: '2023-06-15',
      endDate:   '2023-06-10',
      duration:  30,
    }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('endDate'))).toBe(true);
  });

  test('fails when endDate is a future date', () => {
    const r = validateEncounter(generateEncounter({
      status:  'Finished',
      endDate: '2099-01-01',
      duration: 30,
    }));
    expect(r.valid).toBe(false);
  });
});

// ─── duration ────────────────────────────────────────────────────────────────

describe('validateEncounter — duration', () => {
  test('passes when duration is null', () => {
    const enc = generateEncounter({ status: 'Planned' });
    expect(validateEncounter(enc).valid).toBe(true);
  });

  test('fails when duration is negative', () => {
    const enc = generateEncounter({ status: 'Finished' });
    enc.duration = -10;
    const r = validateEncounter(enc);
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('duration'))).toBe(true);
  });

  test('fails when duration is a float', () => {
    const enc = generateEncounter({ status: 'Finished' });
    enc.duration = 30.5;
    expect(validateEncounter(enc).valid).toBe(false);
  });
});

// ─── Multiple errors ──────────────────────────────────────────────────────────

describe('validateEncounter — multiple errors', () => {
  test('collects all errors at once', () => {
    const r = validateEncounter({
      encounterId:       'bad-id',
      status:            'InvalidStatus',
      class:             'InvalidClass',
      type:              'Office Visit',
      startDate:         '2099-01-01',
      endDate:           null,
      duration:          null,
      reasonCode:        'I10',
      reasonDescription: 'Hypertension',
      location:          'Clinic',
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(1);
  });
});
