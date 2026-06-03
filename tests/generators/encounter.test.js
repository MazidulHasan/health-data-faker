import { generateEncounter } from '../../src/generators/encounter.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const encounterData = require('../../src/data/encounterTypes.json');
const icd10Data     = require('../../src/data/icd10Codes.json');

const ENCOUNTER_STATUSES = ['Finished', 'In Progress', 'Planned', 'Cancelled'];
const ENCOUNTER_CLASSES  = ['Ambulatory', 'Emergency', 'Inpatient', 'Observation', 'Telehealth'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateEncounter — shape', () => {
  let enc;
  beforeEach(() => { enc = generateEncounter(); });

  test('returns a non-null object', () => {
    expect(typeof enc).toBe('object');
    expect(enc).not.toBeNull();
  });

  test('has all 10 required fields', () => {
    ['encounterId', 'status', 'class', 'type', 'startDate',
     'endDate', 'duration', 'reasonCode', 'reasonDescription', 'location']
      .forEach(f => expect(enc).toHaveProperty(f));
  });

  test('has no extra unexpected fields', () => {
    expect(Object.keys(enc)).toHaveLength(10);
  });
});

// ─── encounterId ──────────────────────────────────────────────────────────────

describe('generateEncounter — encounterId', () => {
  test('matches ENC-###### format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateEncounter().encounterId).toMatch(/^ENC-\d{6}$/);
    }
  });

  test('override is respected', () => {
    expect(generateEncounter({ encounterId: 'ENC-000001' }).encounterId).toBe('ENC-000001');
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateEncounter — status', () => {
  test('status is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(ENCOUNTER_STATUSES).toContain(generateEncounter().status);
    }
  });

  test('status override is respected', () => {
    expect(generateEncounter({ status: 'Planned' }).status).toBe('Planned');
    expect(generateEncounter({ status: 'Cancelled' }).status).toBe('Cancelled');
  });
});

// ─── class ────────────────────────────────────────────────────────────────────

describe('generateEncounter — class', () => {
  test('class is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(ENCOUNTER_CLASSES).toContain(generateEncounter().class);
    }
  });

  test('class override is respected', () => {
    expect(generateEncounter({ class: 'Emergency' }).class).toBe('Emergency');
    expect(generateEncounter({ class: 'Inpatient' }).class).toBe('Inpatient');
  });
});

// ─── type and location ────────────────────────────────────────────────────────

describe('generateEncounter — type and location', () => {
  test('type comes from the fixture', () => {
    for (let i = 0; i < 20; i++) {
      expect(encounterData.encounterTypes).toContain(generateEncounter().type);
    }
  });

  test('location comes from the fixture', () => {
    for (let i = 0; i < 20; i++) {
      expect(encounterData.encounterLocations).toContain(generateEncounter().location);
    }
  });

  test('type override is respected', () => {
    expect(generateEncounter({ type: 'Emergency Visit' }).type).toBe('Emergency Visit');
  });

  test('location override is respected', () => {
    expect(generateEncounter({ location: 'Hospital' }).location).toBe('Hospital');
  });
});

// ─── reasonCode ───────────────────────────────────────────────────────────────

describe('generateEncounter — reasonCode', () => {
  test('reasonCode comes from ICD-10 fixture', () => {
    const allCodes = icd10Data.icd10Codes.map(d => d.code);
    for (let i = 0; i < 20; i++) {
      expect(allCodes).toContain(generateEncounter().reasonCode);
    }
  });

  test('reasonCode override selects matching description', () => {
    const enc = generateEncounter({ reasonCode: 'I10' });
    expect(enc.reasonCode).toBe('I10');
    expect(enc.reasonDescription).toBe('Essential (primary) hypertension');
  });

  test('reasonDescription override is respected', () => {
    const enc = generateEncounter({ reasonCode: 'I10', reasonDescription: 'Custom reason' });
    expect(enc.reasonDescription).toBe('Custom reason');
  });
});

// ─── Finished encounter — endDate and duration ────────────────────────────────

describe('generateEncounter — Finished status', () => {
  test('Finished encounter has a non-null endDate', () => {
    for (let i = 0; i < 10; i++) {
      const enc = generateEncounter({ status: 'Finished' });
      expect(enc.endDate).not.toBeNull();
      expect(enc.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('Finished encounter has a non-null positive duration', () => {
    for (let i = 0; i < 10; i++) {
      const enc = generateEncounter({ status: 'Finished' });
      expect(enc.duration).not.toBeNull();
      expect(enc.duration).toBeGreaterThan(0);
    }
  });

  test('endDate is >= startDate for Finished encounters', () => {
    for (let i = 0; i < 10; i++) {
      const enc = generateEncounter({ status: 'Finished' });
      expect(new Date(enc.endDate).getTime()).toBeGreaterThanOrEqual(new Date(enc.startDate).getTime());
    }
  });

  test('Planned encounter has null endDate and null duration', () => {
    const enc = generateEncounter({ status: 'Planned' });
    expect(enc.endDate).toBeNull();
    expect(enc.duration).toBeNull();
  });

  test('endDate and duration overrides are respected even for Finished', () => {
    const enc = generateEncounter({ status: 'Finished', endDate: '2024-01-20', duration: 45 });
    expect(enc.endDate).toBe('2024-01-20');
    expect(enc.duration).toBe(45);
  });
});

// ─── startDate ────────────────────────────────────────────────────────────────

describe('generateEncounter — startDate', () => {
  test('is a valid ISO date string', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateEncounter().startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('is not a future date', () => {
    for (let i = 0; i < 20; i++) {
      expect(new Date(generateEncounter().startDate).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateEncounter({ startDate: '2023-03-01' }).startDate).toBe('2023-03-01');
  });
});
