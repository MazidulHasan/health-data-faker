import { validateMember } from '../../src/validators/member.js';
import { generateMember }  from '../../src/generators/member.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateMember — generated records', () => {
  test('passes for 50 randomly generated members', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateMember(generateMember());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('validateMember — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateMember(generateMember());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateMember(null).valid).toBe(false);
    expect(validateMember(undefined).valid).toBe(false);
    expect(validateMember('string').valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateMember — required fields', () => {
  const REQUIRED = ['memberId', 'plan', 'policyNumber', 'effectiveDate', 'status', 'eligibility'];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const m = generateMember();
      delete m[field];
      const r = validateMember(m);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── memberId / policyNumber format ───────────────────────────────────────────

describe('validateMember — ID formats', () => {
  test('passes with valid memberId formats', () => {
    ['MBR-12345678', 'MEMBER-001'].forEach(id => {
      expect(validateMember(generateMember({ memberId: id })).valid).toBe(true);
    });
  });

  test('fails when memberId has no uppercase prefix', () => {
    const r = validateMember(generateMember({ memberId: '12345678' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('memberId'))).toBe(true);
  });

  test('fails when policyNumber has lowercase prefix', () => {
    const r = validateMember(generateMember({ policyNumber: 'pol-12345' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('policyNumber'))).toBe(true);
  });
});

// ─── effectiveDate ────────────────────────────────────────────────────────────

describe('validateMember — effectiveDate', () => {
  test('passes for a valid past date', () => {
    expect(validateMember(generateMember({ effectiveDate: '2021-06-01' })).valid).toBe(true);
  });

  test('passes for today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(validateMember(generateMember({ effectiveDate: today })).valid).toBe(true);
  });

  test('passes for a future effectiveDate (members can have future start dates)', () => {
    expect(validateMember(generateMember({ effectiveDate: '2030-01-01' })).valid).toBe(true);
  });

  test('fails for invalid date string', () => {
    const r = validateMember(generateMember({ effectiveDate: 'not-a-date' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('effectiveDate'))).toBe(true);
  });

  test('fails for wrong format (MM/DD/YYYY)', () => {
    const r = validateMember(generateMember({ effectiveDate: '01/01/2022' }));
    expect(r.valid).toBe(false);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateMember — status', () => {
  const VALID = ['Active', 'Inactive', 'Terminated', 'Pending', 'Suspended'];

  test('passes for all valid statuses', () => {
    VALID.forEach(s => {
      expect(validateMember(generateMember({ status: s })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateMember(generateMember({ status: 'Unknown' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('status'))).toBe(true);
  });
});

// ─── plan ─────────────────────────────────────────────────────────────────────

describe('validateMember — plan', () => {
  test('passes for a valid plan object', () => {
    const plan = { name: 'Test Plan', type: 'PPO', tier: 'Gold', provider: 'Acme' };
    expect(validateMember(generateMember({ plan })).valid).toBe(true);
  });

  test('fails when plan is not an object', () => {
    const r = validateMember(generateMember({ plan: 'PPO' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('plan'))).toBe(true);
  });

  test('fails when plan.type is invalid', () => {
    const plan = { name: 'X', type: 'INVALID', tier: 'Gold', provider: 'Acme' };
    const r = validateMember(generateMember({ plan }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('plan.type'))).toBe(true);
  });

  test('fails when plan.tier is invalid', () => {
    const plan = { name: 'X', type: 'HMO', tier: 'Diamond', provider: 'Acme' };
    const r = validateMember(generateMember({ plan }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('plan.tier'))).toBe(true);
  });

  test('fails when plan.name is missing', () => {
    const plan = { type: 'HMO', tier: 'Gold', provider: 'Acme' };
    const r = validateMember(generateMember({ plan }));
    expect(r.valid).toBe(false);
  });
});

// ─── eligibility ──────────────────────────────────────────────────────────────

describe('validateMember — eligibility', () => {
  test('passes for valid eligibility objects', () => {
    const cases = [
      { isEligible: true,  reason: 'Active coverage' },
      { isEligible: false, reason: 'Coverage terminated' },
    ];
    cases.forEach(eligibility => {
      expect(validateMember(generateMember({ eligibility })).valid).toBe(true);
    });
  });

  test('fails when eligibility is not an object', () => {
    const r = validateMember(generateMember({ eligibility: 'yes' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('eligibility'))).toBe(true);
  });

  test('fails when isEligible is not a boolean', () => {
    const r = validateMember(generateMember({ eligibility: { isEligible: 'true', reason: 'ok' } }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('eligibility.isEligible'))).toBe(true);
  });

  test('fails when reason is missing', () => {
    const r = validateMember(generateMember({ eligibility: { isEligible: true } }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('eligibility.reason'))).toBe(true);
  });
});

// ─── multiple errors ──────────────────────────────────────────────────────────

describe('validateMember — multiple errors', () => {
  test('collects all errors at once', () => {
    const r = validateMember({
      memberId:      'bad',
      plan:          'not-a-plan',
      policyNumber:  '!!!',
      effectiveDate: 'not-a-date',
      status:        'Unknown',
      eligibility:   null,
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(1);
  });
});
