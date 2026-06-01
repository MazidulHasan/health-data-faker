import {
  createPatientId,
  createMemberId,
  createEmployeeId,
  createPolicyNumber,
  createMRN,
} from '../../src/generators/identifiers.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Split "PREFIX-BODY" and return both parts. */
function splitId(id) {
  const dash = id.indexOf('-');
  return { prefix: id.slice(0, dash), body: id.slice(dash + 1) };
}

// ─── createPatientId ──────────────────────────────────────────────────────────

describe('createPatientId', () => {
  test('returns a string', () => {
    expect(typeof createPatientId()).toBe('string');
  });

  test('matches default format PAT-#####', () => {
    expect(createPatientId()).toMatch(/^PAT-\d{5}$/);
  });

  test('number is within default range [10000, 99999]', () => {
    for (let i = 0; i < 50; i++) {
      const { body } = splitId(createPatientId());
      const n = Number(body);
      expect(n).toBeGreaterThanOrEqual(10000);
      expect(n).toBeLessThanOrEqual(99999);
    }
  });

  test('custom prefix is applied', () => {
    expect(createPatientId({ prefix: 'PATIENT' })).toMatch(/^PATIENT-\d+$/);
  });

  test('custom min/max range is respected', () => {
    for (let i = 0; i < 50; i++) {
      const { body } = splitId(createPatientId({ min: 1, max: 100 }));
      const n = Number(body);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(100);
    }
  });

  test('padWidth zero-pads the number', () => {
    const id = createPatientId({ min: 1, max: 9, padWidth: 5 });
    const { body } = splitId(id);
    expect(body).toHaveLength(5);
    expect(body).toMatch(/^0+[1-9]$/);
  });
});

// ─── createMemberId ───────────────────────────────────────────────────────────

describe('createMemberId', () => {
  test('returns a string', () => {
    expect(typeof createMemberId()).toBe('string');
  });

  test('matches default format MBR-########', () => {
    expect(createMemberId()).toMatch(/^MBR-\d{8}$/);
  });

  test('body contains only digits', () => {
    for (let i = 0; i < 20; i++) {
      const { body } = splitId(createMemberId());
      expect(body).toMatch(/^\d+$/);
    }
  });

  test('custom prefix is applied', () => {
    expect(createMemberId({ prefix: 'MEMBER' })).toMatch(/^MEMBER-\d{8}$/);
  });

  test('custom digits length is respected', () => {
    expect(createMemberId({ digits: 10 })).toMatch(/^MBR-\d{10}$/);
  });

  test('throws on invalid digits value', () => {
    expect(() => createMemberId({ digits: 0 })).toThrow();
    expect(() => createMemberId({ digits: 'eight' })).toThrow();
  });
});

// ─── createEmployeeId ─────────────────────────────────────────────────────────

describe('createEmployeeId', () => {
  test('returns a string', () => {
    expect(typeof createEmployeeId()).toBe('string');
  });

  test('matches default format EMP-####', () => {
    expect(createEmployeeId()).toMatch(/^EMP-\d{4}$/);
  });

  test('number is within default range [1000, 9999]', () => {
    for (let i = 0; i < 50; i++) {
      const { body } = splitId(createEmployeeId());
      const n = Number(body);
      expect(n).toBeGreaterThanOrEqual(1000);
      expect(n).toBeLessThanOrEqual(9999);
    }
  });

  test('custom prefix is applied', () => {
    expect(createEmployeeId({ prefix: 'STAFF' })).toMatch(/^STAFF-\d+$/);
  });

  test('custom min/max range is respected', () => {
    for (let i = 0; i < 50; i++) {
      const { body } = splitId(createEmployeeId({ min: 100, max: 199 }));
      const n = Number(body);
      expect(n).toBeGreaterThanOrEqual(100);
      expect(n).toBeLessThanOrEqual(199);
    }
  });

  test('padWidth zero-pads the number', () => {
    const id = createEmployeeId({ min: 1, max: 9, padWidth: 6 });
    const { body } = splitId(id);
    expect(body).toHaveLength(6);
  });
});

// ─── createPolicyNumber ───────────────────────────────────────────────────────

describe('createPolicyNumber', () => {
  test('returns a string', () => {
    expect(typeof createPolicyNumber()).toBe('string');
  });

  test('matches default format POL-#####', () => {
    expect(createPolicyNumber()).toMatch(/^POL-\d{5}$/);
  });

  test('number is within default range [10000, 99999]', () => {
    for (let i = 0; i < 50; i++) {
      const { body } = splitId(createPolicyNumber());
      const n = Number(body);
      expect(n).toBeGreaterThanOrEqual(10000);
      expect(n).toBeLessThanOrEqual(99999);
    }
  });

  test('custom prefix is applied', () => {
    expect(createPolicyNumber({ prefix: 'POLICY' })).toMatch(/^POLICY-\d+$/);
  });

  test('padWidth zero-pads the number', () => {
    const id = createPolicyNumber({ min: 1, max: 9, padWidth: 8 });
    const { body } = splitId(id);
    expect(body).toHaveLength(8);
  });
});

// ─── createMRN ────────────────────────────────────────────────────────────────

describe('createMRN', () => {
  test('returns a string', () => {
    expect(typeof createMRN()).toBe('string');
  });

  test('matches default format MRN-######', () => {
    expect(createMRN()).toMatch(/^MRN-\d{6}$/);
  });

  test('body contains only digits', () => {
    for (let i = 0; i < 20; i++) {
      const { body } = splitId(createMRN());
      expect(body).toMatch(/^\d+$/);
    }
  });

  test('custom prefix is applied', () => {
    expect(createMRN({ prefix: 'RECORD' })).toMatch(/^RECORD-\d{6}$/);
  });

  test('custom digits length is respected', () => {
    expect(createMRN({ digits: 9 })).toMatch(/^MRN-\d{9}$/);
  });

  test('MRN can have leading zeros (preserved as string)', () => {
    // With digits=6 and pure random digits, leading zeros are possible.
    // Run many times to observe at least one.
    const results = Array.from({ length: 500 }, () => splitId(createMRN()).body);
    const hasLeadingZero = results.some(b => b.startsWith('0'));
    expect(hasLeadingZero).toBe(true);
  });

  test('throws on invalid digits value', () => {
    expect(() => createMRN({ digits: 0 })).toThrow();
    expect(() => createMRN({ digits: 'six' })).toThrow();
  });
});
