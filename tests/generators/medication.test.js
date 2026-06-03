import { generateMedication } from '../../src/generators/medication.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const medicationsData = require('../../src/data/medications.json');

const MEDICATION_STATUSES = ['Active', 'Discontinued', 'Hold', 'Completed'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateMedication — shape', () => {
  let med;
  beforeEach(() => { med = generateMedication(); });

  test('returns a non-null object', () => {
    expect(typeof med).toBe('object');
    expect(med).not.toBeNull();
  });

  test('has all 10 required fields', () => {
    ['medicationId', 'rxcui', 'name', 'genericName', 'brandName',
     'strength', 'form', 'route', 'frequency', 'status']
      .forEach(f => expect(med).toHaveProperty(f));
  });

  test('has no extra unexpected fields', () => {
    expect(Object.keys(med)).toHaveLength(10);
  });
});

// ─── medicationId ─────────────────────────────────────────────────────────────

describe('generateMedication — medicationId', () => {
  test('matches MED-###### format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateMedication().medicationId).toMatch(/^MED-\d{6}$/);
    }
  });

  test('override is respected', () => {
    expect(generateMedication({ medicationId: 'MED-000001' }).medicationId).toBe('MED-000001');
  });
});

// ─── rxcui and medication fields ──────────────────────────────────────────────

describe('generateMedication — rxcui and fixture fields', () => {
  test('rxcui comes from the fixture', () => {
    const allRxcui = medicationsData.medications.map(m => m.rxcui);
    for (let i = 0; i < 30; i++) {
      expect(allRxcui).toContain(generateMedication().rxcui);
    }
  });

  test('name matches the selected rxcui', () => {
    for (let i = 0; i < 20; i++) {
      const med = generateMedication();
      const fixture = medicationsData.medications.find(m => m.rxcui === med.rxcui);
      expect(med.name).toBe(fixture.name);
    }
  });

  test('overriding rxcui selects matching fixture entry', () => {
    const med = generateMedication({ rxcui: '860975' });
    expect(med.rxcui).toBe('860975');
    expect(med.genericName).toBe('Metformin');
    expect(med.brandName).toBe('Glucophage');
  });

  test('name, genericName, brandName overrides are respected', () => {
    const med = generateMedication({ name: 'Custom Drug', genericName: 'generic', brandName: 'Brand' });
    expect(med.name).toBe('Custom Drug');
    expect(med.genericName).toBe('generic');
    expect(med.brandName).toBe('Brand');
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateMedication — status', () => {
  test('status is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(MEDICATION_STATUSES).toContain(generateMedication().status);
    }
  });

  test('status override is respected', () => {
    expect(generateMedication({ status: 'Active' }).status).toBe('Active');
    expect(generateMedication({ status: 'Discontinued' }).status).toBe('Discontinued');
  });
});

// ─── frequency ────────────────────────────────────────────────────────────────

describe('generateMedication — frequency', () => {
  test('frequency is a non-empty string', () => {
    for (let i = 0; i < 20; i++) {
      const { frequency } = generateMedication();
      expect(typeof frequency).toBe('string');
      expect(frequency.length).toBeGreaterThan(0);
    }
  });

  test('frequency override is respected', () => {
    expect(generateMedication({ frequency: 'Once weekly' }).frequency).toBe('Once weekly');
  });
});

// ─── form and route ───────────────────────────────────────────────────────────

describe('generateMedication — form and route', () => {
  test('form and route are non-empty strings', () => {
    for (let i = 0; i < 20; i++) {
      const med = generateMedication();
      expect(typeof med.form).toBe('string');
      expect(med.form.length).toBeGreaterThan(0);
      expect(typeof med.route).toBe('string');
      expect(med.route.length).toBeGreaterThan(0);
    }
  });

  test('form and route overrides are respected', () => {
    const med = generateMedication({ form: 'Liquid', route: 'Intravenous' });
    expect(med.form).toBe('Liquid');
    expect(med.route).toBe('Intravenous');
  });
});
