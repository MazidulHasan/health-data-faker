import { generateVitals } from '../../src/generators/vitals.js';

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateVitals — shape', () => {
  let v;
  beforeEach(() => { v = generateVitals(); });

  test('returns a non-null object', () => {
    expect(typeof v).toBe('object');
    expect(v).not.toBeNull();
  });

  test('has all 10 required top-level fields', () => {
    ['vitalId', 'recordedDate', 'height', 'weight', 'bloodPressure',
     'heartRate', 'temperature', 'oxygenSaturation', 'respiratoryRate', 'bmi']
      .forEach(f => expect(v).toHaveProperty(f));
  });

  test('each vital sub-object has value, unit, loincCode, loincDisplay', () => {
    const vitals = ['height', 'weight', 'heartRate', 'temperature', 'oxygenSaturation', 'respiratoryRate', 'bmi'];
    vitals.forEach(key => {
      expect(typeof v[key].value).toBe('number');
      expect(typeof v[key].unit).toBe('string');
      expect(typeof v[key].loincCode).toBe('string');
      expect(typeof v[key].loincDisplay).toBe('string');
    });
  });

  test('bloodPressure has systolic and diastolic sub-objects', () => {
    expect(v.bloodPressure).toHaveProperty('systolic');
    expect(v.bloodPressure).toHaveProperty('diastolic');
    expect(typeof v.bloodPressure.systolic.value).toBe('number');
    expect(typeof v.bloodPressure.diastolic.value).toBe('number');
  });
});

// ─── vitalId ──────────────────────────────────────────────────────────────────

describe('generateVitals — vitalId', () => {
  test('matches VIT-###### format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateVitals().vitalId).toMatch(/^VIT-\d{6}$/);
    }
  });

  test('override is respected', () => {
    expect(generateVitals({ vitalId: 'VIT-000001' }).vitalId).toBe('VIT-000001');
  });
});

// ─── recordedDate ─────────────────────────────────────────────────────────────

describe('generateVitals — recordedDate', () => {
  test('is a valid ISO date string', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateVitals().recordedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('is not a future date', () => {
    for (let i = 0; i < 20; i++) {
      expect(new Date(generateVitals().recordedDate).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateVitals({ recordedDate: '2023-05-10' }).recordedDate).toBe('2023-05-10');
  });
});

// ─── LOINC codes ──────────────────────────────────────────────────────────────

describe('generateVitals — embedded LOINC codes', () => {
  test('height uses LOINC code 8302-2', () => {
    expect(generateVitals().height.loincCode).toBe('8302-2');
  });
  test('weight uses LOINC code 29463-7', () => {
    expect(generateVitals().weight.loincCode).toBe('29463-7');
  });
  test('systolic BP uses LOINC code 8480-6', () => {
    expect(generateVitals().bloodPressure.systolic.loincCode).toBe('8480-6');
  });
  test('diastolic BP uses LOINC code 8462-4', () => {
    expect(generateVitals().bloodPressure.diastolic.loincCode).toBe('8462-4');
  });
  test('heart rate uses LOINC code 8867-4', () => {
    expect(generateVitals().heartRate.loincCode).toBe('8867-4');
  });
  test('oxygen saturation uses LOINC code 59408-5', () => {
    expect(generateVitals().oxygenSaturation.loincCode).toBe('59408-5');
  });
  test('BMI uses LOINC code 39156-5', () => {
    expect(generateVitals().bmi.loincCode).toBe('39156-5');
  });
});

// ─── value ranges ─────────────────────────────────────────────────────────────

describe('generateVitals — physiological value ranges', () => {
  test('height is between 150 and 195 cm', () => {
    for (let i = 0; i < 20; i++) {
      const h = generateVitals().height.value;
      expect(h).toBeGreaterThanOrEqual(150);
      expect(h).toBeLessThanOrEqual(195);
    }
  });

  test('weight is between 50 and 120 kg', () => {
    for (let i = 0; i < 20; i++) {
      const w = generateVitals().weight.value;
      expect(w).toBeGreaterThanOrEqual(50);
      expect(w).toBeLessThanOrEqual(120);
    }
  });

  test('oxygen saturation is between 0 and 100', () => {
    for (let i = 0; i < 20; i++) {
      const o = generateVitals().oxygenSaturation.value;
      expect(o).toBeGreaterThanOrEqual(0);
      expect(o).toBeLessThanOrEqual(100);
    }
  });

  test('bmi is a positive number', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateVitals().bmi.value).toBeGreaterThan(0);
    }
  });
});

// ─── BMI calculation ──────────────────────────────────────────────────────────

describe('generateVitals — BMI auto-calculation', () => {
  test('bmi is correctly derived from height and weight', () => {
    const v = generateVitals({ height: { value: 175 }, weight: { value: 70 } });
    const expected = parseFloat((70 / Math.pow(175 / 100, 2)).toFixed(1));
    expect(v.bmi.value).toBe(expected);
  });

  test('bmi override takes precedence over calculation', () => {
    const v = generateVitals({ bmi: { value: 30.0 } });
    expect(v.bmi.value).toBe(30.0);
  });
});

// ─── overrides ────────────────────────────────────────────────────────────────

describe('generateVitals — overrides', () => {
  test('height value override is respected', () => {
    expect(generateVitals({ height: { value: 180 } }).height.value).toBe(180);
  });

  test('blood pressure overrides are respected', () => {
    const v = generateVitals({ bloodPressure: { systolic: { value: 130 }, diastolic: { value: 85 } } });
    expect(v.bloodPressure.systolic.value).toBe(130);
    expect(v.bloodPressure.diastolic.value).toBe(85);
  });

  test('temperature override is respected', () => {
    expect(generateVitals({ temperature: { value: 101.2 } }).temperature.value).toBe(101.2);
  });
});
