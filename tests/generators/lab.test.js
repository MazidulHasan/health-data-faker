import { generateLabResult } from '../../src/generators/lab.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const loincData = require('../../src/data/loincLabs.json');

const LAB_STATUSES        = ['final', 'preliminary', 'corrected', 'cancelled'];
const LAB_INTERPRETATIONS = ['Normal', 'High', 'Low', 'Critical High', 'Critical Low'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateLabResult — shape', () => {
  let lab;
  beforeEach(() => { lab = generateLabResult(); });

  test('returns a non-null object', () => {
    expect(typeof lab).toBe('object');
    expect(lab).not.toBeNull();
  });

  test('has all 11 required fields', () => {
    ['labId', 'loincCode', 'loincDisplay', 'shortName', 'value', 'unit',
     'referenceRange', 'interpretation', 'status', 'collectedDate', 'category']
      .forEach(f => expect(lab).toHaveProperty(f));
  });

  test('has no extra unexpected fields', () => {
    expect(Object.keys(lab)).toHaveLength(11);
  });
});

// ─── labId ────────────────────────────────────────────────────────────────────

describe('generateLabResult — labId', () => {
  test('matches LAB-###### format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateLabResult().labId).toMatch(/^LAB-\d{6}$/);
    }
  });

  test('override is respected', () => {
    expect(generateLabResult({ labId: 'LAB-000001' }).labId).toBe('LAB-000001');
  });
});

// ─── LOINC fields ─────────────────────────────────────────────────────────────

describe('generateLabResult — LOINC fields', () => {
  test('loincCode comes from the fixture', () => {
    const allCodes = loincData.loincLabs.map(l => l.loincCode);
    for (let i = 0; i < 30; i++) {
      expect(allCodes).toContain(generateLabResult().loincCode);
    }
  });

  test('loincDisplay matches the selected loincCode', () => {
    for (let i = 0; i < 20; i++) {
      const lab = generateLabResult();
      const fixture = loincData.loincLabs.find(l => l.loincCode === lab.loincCode);
      expect(lab.loincDisplay).toBe(fixture.display);
    }
  });

  test('overriding loincCode selects matching fixture entry', () => {
    const lab = generateLabResult({ loincCode: '2345-7' });
    expect(lab.loincCode).toBe('2345-7');
    expect(lab.shortName).toBe('Glucose');
    expect(lab.unit).toBe('mg/dL');
  });
});

// ─── value and interpretation ─────────────────────────────────────────────────

describe('generateLabResult — value and interpretation', () => {
  test('value is a non-negative finite number', () => {
    for (let i = 0; i < 30; i++) {
      const { value } = generateLabResult();
      expect(typeof value).toBe('number');
      expect(isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  test('interpretation is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(LAB_INTERPRETATIONS).toContain(generateLabResult().interpretation);
    }
  });

  test('overriding value auto-derives interpretation', () => {
    // Glucose normal range: 70-99. Value 145 → High. Value 50 → Low.
    const high = generateLabResult({ loincCode: '2345-7', value: 145 });
    expect(high.value).toBe(145);
    expect(high.interpretation).toBe('High');

    const low = generateLabResult({ loincCode: '2345-7', value: 50 });
    expect(low.value).toBe(50);
    expect(low.interpretation).toBe('Low');

    const normal = generateLabResult({ loincCode: '2345-7', value: 85 });
    expect(normal.value).toBe(85);
    expect(normal.interpretation).toBe('Normal');
  });

  test('interpretation override takes precedence over derived value', () => {
    const lab = generateLabResult({ loincCode: '2345-7', value: 85, interpretation: 'Critical High' });
    expect(lab.interpretation).toBe('Critical High');
  });
});

// ─── referenceRange ───────────────────────────────────────────────────────────

describe('generateLabResult — referenceRange', () => {
  test('referenceRange has numeric low and high', () => {
    for (let i = 0; i < 20; i++) {
      const { referenceRange } = generateLabResult();
      expect(typeof referenceRange.low).toBe('number');
      expect(typeof referenceRange.high).toBe('number');
    }
  });

  test('override referenceRange is respected', () => {
    const lab = generateLabResult({ referenceRange: { low: 0, high: 50 } });
    expect(lab.referenceRange.low).toBe(0);
    expect(lab.referenceRange.high).toBe(50);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateLabResult — status', () => {
  test('default status is "final"', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateLabResult().status).toBe('final');
    }
  });

  test('status override is respected', () => {
    expect(generateLabResult({ status: 'preliminary' }).status).toBe('preliminary');
  });
});

// ─── collectedDate ────────────────────────────────────────────────────────────

describe('generateLabResult — collectedDate', () => {
  test('is a valid ISO date string', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateLabResult().collectedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('is not a future date', () => {
    for (let i = 0; i < 20; i++) {
      expect(new Date(generateLabResult().collectedDate).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateLabResult({ collectedDate: '2023-01-15' }).collectedDate).toBe('2023-01-15');
  });
});
