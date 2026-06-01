import {
  randomItem,
  randomNumber,
  randomBoolean,
  randomString,
  randomDigits,
  randomDate,
} from '../../src/utils/random.js';

// ─── randomItem ────────────────────────────────────────────────────────────────

describe('randomItem', () => {
  const arr = ['a', 'b', 'c', 'd', 'e'];

  test('returns an element that exists in the array', () => {
    for (let i = 0; i < 50; i++) {
      expect(arr).toContain(randomItem(arr));
    }
  });

  test('works with a single-element array', () => {
    expect(randomItem([42])).toBe(42);
  });

  test('throws on empty array', () => {
    expect(() => randomItem([])).toThrow();
  });

  test('throws on non-array', () => {
    expect(() => randomItem('not-an-array')).toThrow();
  });
});

// ─── randomNumber ──────────────────────────────────────────────────────────────

describe('randomNumber', () => {
  test('returns an integer within [min, max]', () => {
    for (let i = 0; i < 100; i++) {
      const n = randomNumber(1, 10);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  test('works when min === max', () => {
    expect(randomNumber(7, 7)).toBe(7);
  });

  test('throws when min > max', () => {
    expect(() => randomNumber(10, 5)).toThrow();
  });

  test('throws on non-numeric input', () => {
    expect(() => randomNumber('1', 10)).toThrow();
  });
});

// ─── randomBoolean ─────────────────────────────────────────────────────────────

describe('randomBoolean', () => {
  test('returns a boolean', () => {
    for (let i = 0; i < 20; i++) {
      expect(typeof randomBoolean()).toBe('boolean');
    }
  });

  test('produces both true and false over many calls', () => {
    const results = new Set(Array.from({ length: 200 }, () => randomBoolean()));
    expect(results.has(true)).toBe(true);
    expect(results.has(false)).toBe(true);
  });
});

// ─── randomString ──────────────────────────────────────────────────────────────

describe('randomString', () => {
  test('returns a string of exact length', () => {
    expect(randomString(8)).toHaveLength(8);
    expect(randomString(16)).toHaveLength(16);
  });

  test('contains only alphanumeric characters', () => {
    const result = randomString(100);
    expect(result).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('throws on length < 1', () => {
    expect(() => randomString(0)).toThrow();
  });

  test('throws on non-numeric length', () => {
    expect(() => randomString('ten')).toThrow();
  });
});

// ─── randomDigits ──────────────────────────────────────────────────────────────

describe('randomDigits', () => {
  test('returns a string of exact length', () => {
    expect(randomDigits(6)).toHaveLength(6);
    expect(randomDigits(10)).toHaveLength(10);
  });

  test('contains only digit characters', () => {
    const result = randomDigits(100);
    expect(result).toMatch(/^[0-9]+$/);
  });

  test('can start with 0 (preserved as string)', () => {
    // Run many times; at least once it will start with 0
    const results = Array.from({ length: 200 }, () => randomDigits(4));
    const hasLeadingZero = results.some(r => r.startsWith('0'));
    expect(hasLeadingZero).toBe(true);
  });

  test('throws on length < 1', () => {
    expect(() => randomDigits(0)).toThrow();
  });
});

// ─── randomDate ────────────────────────────────────────────────────────────────

describe('randomDate', () => {
  const start = new Date('2000-01-01');
  const end = new Date('2025-12-31');

  test('returns a Date instance', () => {
    expect(randomDate(start, end)).toBeInstanceOf(Date);
  });

  test('returned date is within [start, end]', () => {
    for (let i = 0; i < 50; i++) {
      const d = randomDate(start, end);
      expect(d.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(d.getTime()).toBeLessThanOrEqual(end.getTime());
    }
  });

  test('works when start === end', () => {
    const same = new Date('2020-06-15');
    const d = randomDate(same, same);
    expect(d.getTime()).toBe(same.getTime());
  });

  test('throws when start > end', () => {
    expect(() => randomDate(end, start)).toThrow();
  });

  test('throws on non-Date inputs', () => {
    expect(() => randomDate('2020-01-01', end)).toThrow();
  });
});
