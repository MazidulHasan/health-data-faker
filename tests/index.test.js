/**
 * Public export surface tests.
 * Imports exclusively from the package entry point (src/index.js),
 * exactly as an end-user would: import { ... } from 'health-data-faker'
 */

import {
  generatePatient,
  generateMember,
  generateEmployee,
  validatePatient,
  validateMember,
  validateEmployee,
} from '../src/index.js';

// ─── Named exports exist ──────────────────────────────────────────────────────

describe('package exports — named functions exist', () => {
  const exports = {
    generatePatient,
    generateMember,
    generateEmployee,
    validatePatient,
    validateMember,
    validateEmployee,
  };

  Object.entries(exports).forEach(([name, fn]) => {
    test(`${name} is exported as a function`, () => {
      expect(typeof fn).toBe('function');
    });
  });
});

// ─── Internal utilities are NOT exported ──────────────────────────────────────

describe('package exports — internal utilities are not on the public surface', () => {
  test('randomItem is not exported from the package entry point', async () => {
    const mod = await import('../src/index.js');
    expect(mod.randomItem).toBeUndefined();
  });

  test('randomNumber is not exported from the package entry point', async () => {
    const mod = await import('../src/index.js');
    expect(mod.randomNumber).toBeUndefined();
  });

  test('createPatientId is not exported from the package entry point', async () => {
    const mod = await import('../src/index.js');
    expect(mod.createPatientId).toBeUndefined();
  });

  test('runRules is not exported from the package entry point', async () => {
    const mod = await import('../src/index.js');
    expect(mod.runRules).toBeUndefined();
  });
});

// ─── Generators produce valid output ─────────────────────────────────────────

describe('generatePatient — via public export', () => {
  test('returns an object with all 10 patient fields', () => {
    const p = generatePatient();
    const fields = ['patientId', 'firstName', 'lastName', 'fullName',
      'gender', 'dateOfBirth', 'age', 'bloodGroup', 'phone', 'email'];
    fields.forEach(f => expect(p).toHaveProperty(f));
  });

  test('accepts and applies overrides', () => {
    const p = generatePatient({ gender: 'Female', age: 35 });
    expect(p.gender).toBe('Female');
    expect(p.age).toBe(35);
  });
});

describe('generateMember — via public export', () => {
  test('returns an object with all 6 member fields', () => {
    const m = generateMember();
    ['memberId', 'plan', 'policyNumber', 'effectiveDate', 'status', 'eligibility']
      .forEach(f => expect(m).toHaveProperty(f));
  });

  test('accepts and applies overrides', () => {
    const m = generateMember({ status: 'Active' });
    expect(m.status).toBe('Active');
    expect(m.eligibility.isEligible).toBe(true);
  });
});

describe('generateEmployee — via public export', () => {
  test('returns an object with all 8 employee fields', () => {
    const e = generateEmployee();
    ['employeeId', 'firstName', 'lastName', 'department',
      'designation', 'joiningDate', 'status', 'workEmail']
      .forEach(f => expect(e).toHaveProperty(f));
  });

  test('accepts and applies overrides', () => {
    const e = generateEmployee({ status: 'Probation' });
    expect(e.status).toBe('Probation');
  });
});

// ─── Validators return correct shape ─────────────────────────────────────────

describe('validators — via public export', () => {
  test('validatePatient returns { valid, errors } for a generated patient', () => {
    const result = validatePatient(generatePatient());
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
  });

  test('validateMember returns { valid, errors } for a generated member', () => {
    const result = validateMember(generateMember());
    expect(result).toHaveProperty('valid', true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateEmployee returns { valid, errors } for a generated employee', () => {
    const result = validateEmployee(generateEmployee());
    expect(result).toHaveProperty('valid', true);
    expect(result.errors).toHaveLength(0);
  });

  test('validatePatient catches invalid records', () => {
    const result = validatePatient({ patientId: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('validateMember catches invalid records', () => {
    const result = validateMember({ memberId: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('validateEmployee catches invalid records', () => {
    const result = validateEmployee({ employeeId: 'bad' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

// ─── Generate → validate round-trip ──────────────────────────────────────────

describe('generate → validate round-trip via public export', () => {
  test('100 random patients all pass validation', () => {
    for (let i = 0; i < 100; i++) {
      expect(validatePatient(generatePatient()).valid).toBe(true);
    }
  });

  test('100 random members all pass validation', () => {
    for (let i = 0; i < 100; i++) {
      expect(validateMember(generateMember()).valid).toBe(true);
    }
  });

  test('100 random employees all pass validation', () => {
    for (let i = 0; i < 100; i++) {
      expect(validateEmployee(generateEmployee()).valid).toBe(true);
    }
  });
});
