import { generateMember } from '../../src/generators/member.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const insurancePlansData = require('../../src/data/insurancePlans.json');

const VALID_STATUSES    = ['Active', 'Inactive', 'Terminated', 'Pending', 'Suspended'];
const VALID_PLAN_TYPES  = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP'];
const VALID_TIERS       = ['Bronze', 'Silver', 'Gold', 'Platinum'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateMember — shape', () => {
  let member;
  beforeEach(() => { member = generateMember(); });

  test('returns an object', () => {
    expect(typeof member).toBe('object');
    expect(member).not.toBeNull();
  });

  test('has all required top-level fields', () => {
    ['memberId', 'plan', 'policyNumber', 'effectiveDate', 'status', 'eligibility']
      .forEach(f => expect(member).toHaveProperty(f));
  });

  test('has exactly 6 top-level fields', () => {
    expect(Object.keys(member)).toHaveLength(6);
  });
});

// ─── memberId ─────────────────────────────────────────────────────────────────

describe('generateMember — memberId', () => {
  test('matches MBR-######## format', () => {
    expect(generateMember().memberId).toMatch(/^MBR-\d{8}$/);
  });

  test('override is respected', () => {
    expect(generateMember({ memberId: 'MBR-00000001' }).memberId).toBe('MBR-00000001');
  });
});

// ─── plan ─────────────────────────────────────────────────────────────────────

describe('generateMember — plan', () => {
  test('plan comes from fixture data', () => {
    for (let i = 0; i < 20; i++) {
      const { plan } = generateMember();
      const match = insurancePlansData.insurancePlans.find(p => p.name === plan.name);
      expect(match).toBeDefined();
    }
  });

  test('plan has name, type, tier, provider fields', () => {
    const { plan } = generateMember();
    expect(typeof plan.name).toBe('string');
    expect(VALID_PLAN_TYPES).toContain(plan.type);
    expect(VALID_TIERS).toContain(plan.tier);
    expect(typeof plan.provider).toBe('string');
  });

  test('plan override is respected', () => {
    const customPlan = { name: 'Test Plan', type: 'PPO', tier: 'Gold', provider: 'TestCo' };
    expect(generateMember({ plan: customPlan }).plan).toEqual(customPlan);
  });
});

// ─── policyNumber ─────────────────────────────────────────────────────────────

describe('generateMember — policyNumber', () => {
  test('matches POL-##### format', () => {
    expect(generateMember().policyNumber).toMatch(/^POL-\d{5}$/);
  });

  test('override is respected', () => {
    expect(generateMember({ policyNumber: 'POL-00001' }).policyNumber).toBe('POL-00001');
  });
});

// ─── effectiveDate ────────────────────────────────────────────────────────────

describe('generateMember — effectiveDate', () => {
  test('is a valid ISO date string', () => {
    const { effectiveDate } = generateMember();
    expect(effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(isNaN(new Date(effectiveDate).getTime())).toBe(false);
  });

  test('is within the expected generation range (2018-01-01 to today)', () => {
    for (let i = 0; i < 20; i++) {
      const d = new Date(generateMember().effectiveDate);
      expect(d.getTime()).toBeGreaterThanOrEqual(new Date('2018-01-01').getTime());
      expect(d.getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateMember({ effectiveDate: '2022-06-15' }).effectiveDate).toBe('2022-06-15');
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateMember — status', () => {
  test('status is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(VALID_STATUSES).toContain(generateMember().status);
    }
  });

  test('all status values are reachable over many calls', () => {
    const seen = new Set(Array.from({ length: 300 }, () => generateMember().status));
    VALID_STATUSES.forEach(s => expect(seen.has(s)).toBe(true));
  });

  test('override is respected', () => {
    VALID_STATUSES.forEach(s => {
      expect(generateMember({ status: s }).status).toBe(s);
    });
  });
});

// ─── eligibility ──────────────────────────────────────────────────────────────

describe('generateMember — eligibility', () => {
  test('eligibility has isEligible (boolean) and reason (string)', () => {
    const { eligibility } = generateMember();
    expect(typeof eligibility.isEligible).toBe('boolean');
    expect(typeof eligibility.reason).toBe('string');
    expect(eligibility.reason.trim().length).toBeGreaterThan(0);
  });

  test('Active status → isEligible true', () => {
    expect(generateMember({ status: 'Active' }).eligibility.isEligible).toBe(true);
  });

  test('Inactive status → isEligible false', () => {
    expect(generateMember({ status: 'Inactive' }).eligibility.isEligible).toBe(false);
  });

  test('Terminated status → isEligible false', () => {
    expect(generateMember({ status: 'Terminated' }).eligibility.isEligible).toBe(false);
  });

  test('Pending status → isEligible false', () => {
    expect(generateMember({ status: 'Pending' }).eligibility.isEligible).toBe(false);
  });

  test('Suspended status → isEligible false', () => {
    expect(generateMember({ status: 'Suspended' }).eligibility.isEligible).toBe(false);
  });

  test('eligibility override is respected regardless of status', () => {
    const customEligibility = { isEligible: true, reason: 'Manual override' };
    const m = generateMember({ status: 'Terminated', eligibility: customEligibility });
    expect(m.eligibility).toEqual(customEligibility);
    expect(m.status).toBe('Terminated');
  });
});

// ─── combined overrides ───────────────────────────────────────────────────────

describe('generateMember — combined overrides', () => {
  test('full override produces exact values', () => {
    const customPlan = { name: 'Gold Plan', type: 'PPO', tier: 'Gold', provider: 'Aetna' };
    const m = generateMember({
      memberId:      'MBR-12345678',
      plan:          customPlan,
      policyNumber:  'POL-99999',
      effectiveDate: '2023-01-01',
      status:        'Active',
      eligibility:   { isEligible: true, reason: 'Active coverage' },
    });
    expect(m.memberId).toBe('MBR-12345678');
    expect(m.plan).toEqual(customPlan);
    expect(m.policyNumber).toBe('POL-99999');
    expect(m.effectiveDate).toBe('2023-01-01');
    expect(m.status).toBe('Active');
    expect(m.eligibility).toEqual({ isEligible: true, reason: 'Active coverage' });
  });
});
