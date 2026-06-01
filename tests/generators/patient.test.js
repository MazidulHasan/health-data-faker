import { generatePatient } from '../../src/generators/patient.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const firstNamesData  = require('../../src/data/firstNames.json');
const lastNamesData   = require('../../src/data/lastNames.json');
const gendersData     = require('../../src/data/genders.json');
const bloodGroupsData = require('../../src/data/bloodGroups.json');

const ALL_FIRST_NAMES = [
  ...firstNamesData.male,
  ...firstNamesData.female,
  ...firstNamesData.neutral,
];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generatePatient — shape', () => {
  let patient;
  beforeEach(() => { patient = generatePatient(); });

  test('returns an object', () => {
    expect(typeof patient).toBe('object');
    expect(patient).not.toBeNull();
  });

  test('has all required fields', () => {
    const fields = [
      'patientId', 'firstName', 'lastName', 'fullName',
      'gender', 'dateOfBirth', 'age', 'bloodGroup', 'phone', 'email',
    ];
    fields.forEach(f => expect(patient).toHaveProperty(f));
  });

  test('has no extra unexpected fields', () => {
    const keys = Object.keys(patient);
    expect(keys).toHaveLength(10);
  });
});

// ─── patientId ────────────────────────────────────────────────────────────────

describe('generatePatient — patientId', () => {
  test('matches PAT-##### format', () => {
    expect(generatePatient().patientId).toMatch(/^PAT-\d{5}$/);
  });

  test('override is respected', () => {
    expect(generatePatient({ patientId: 'PAT-00001' }).patientId).toBe('PAT-00001');
  });
});

// ─── name fields ──────────────────────────────────────────────────────────────

describe('generatePatient — name fields', () => {
  test('firstName comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(ALL_FIRST_NAMES).toContain(generatePatient().firstName);
    }
  });

  test('lastName comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(lastNamesData.lastNames).toContain(generatePatient().lastName);
    }
  });

  test('fullName is firstName + space + lastName', () => {
    const p = generatePatient();
    expect(p.fullName).toBe(`${p.firstName} ${p.lastName}`);
  });

  test('firstName override is respected', () => {
    expect(generatePatient({ firstName: 'Alice' }).firstName).toBe('Alice');
  });

  test('lastName override is respected', () => {
    expect(generatePatient({ lastName: 'Nguyen' }).lastName).toBe('Nguyen');
  });

  test('fullName reflects overridden first and last names', () => {
    const p = generatePatient({ firstName: 'Alice', lastName: 'Nguyen' });
    expect(p.fullName).toBe('Alice Nguyen');
  });
});

// ─── gender ───────────────────────────────────────────────────────────────────

describe('generatePatient — gender', () => {
  test('gender comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(gendersData.genders).toContain(generatePatient().gender);
    }
  });

  test('gender override is respected', () => {
    expect(generatePatient({ gender: 'Female' }).gender).toBe('Female');
    expect(generatePatient({ gender: 'Male' }).gender).toBe('Male');
    expect(generatePatient({ gender: 'Non-binary' }).gender).toBe('Non-binary');
  });

  test('Female gender produces a female or neutral first name', () => {
    const pool = [...firstNamesData.female, ...firstNamesData.neutral];
    for (let i = 0; i < 30; i++) {
      const p = generatePatient({ gender: 'Female' });
      expect(pool).toContain(p.firstName);
    }
  });

  test('Male gender produces a male or neutral first name', () => {
    const pool = [...firstNamesData.male, ...firstNamesData.neutral];
    for (let i = 0; i < 30; i++) {
      const p = generatePatient({ gender: 'Male' });
      expect(pool).toContain(p.firstName);
    }
  });
});

// ─── dateOfBirth & age ────────────────────────────────────────────────────────

describe('generatePatient — dateOfBirth and age', () => {
  test('dateOfBirth is a valid ISO date string', () => {
    const { dateOfBirth } = generatePatient();
    expect(dateOfBirth).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(isNaN(new Date(dateOfBirth).getTime())).toBe(false);
  });

  test('age is a positive integer', () => {
    const { age } = generatePatient();
    expect(Number.isInteger(age)).toBe(true);
    expect(age).toBeGreaterThan(0);
  });

  test('age is consistent with dateOfBirth', () => {
    const p = generatePatient();
    const dob = new Date(p.dateOfBirth);
    const today = new Date();
    let expected = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) expected--;
    expect(p.age).toBe(expected);
  });

  test('age override produces correct dateOfBirth', () => {
    const p = generatePatient({ age: 30 });
    expect(p.age).toBe(30);
    // DOB must be within the 30-year-old window
    const today = new Date();
    const dob = new Date(p.dateOfBirth);
    const earliest = new Date(today.getFullYear() - 31, today.getMonth(), today.getDate() + 1);
    const latest   = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
    expect(dob.getTime()).toBeGreaterThanOrEqual(earliest.getTime());
    expect(dob.getTime()).toBeLessThanOrEqual(latest.getTime());
  });

  test('age override 45 sets age to exactly 45', () => {
    expect(generatePatient({ age: 45 }).age).toBe(45);
  });

  test('dateOfBirth override is respected and age derives from it', () => {
    const p = generatePatient({ dateOfBirth: '1990-01-01' });
    expect(p.dateOfBirth).toBe('1990-01-01');
    // age should be a reasonable positive number derived from 1990-01-01
    expect(p.age).toBeGreaterThan(0);
  });
});

// ─── bloodGroup ───────────────────────────────────────────────────────────────

describe('generatePatient — bloodGroup', () => {
  test('bloodGroup comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(bloodGroupsData.bloodGroups).toContain(generatePatient().bloodGroup);
    }
  });

  test('bloodGroup override is respected', () => {
    expect(generatePatient({ bloodGroup: 'O-' }).bloodGroup).toBe('O-');
  });
});

// ─── phone ────────────────────────────────────────────────────────────────────

describe('generatePatient — phone', () => {
  test('phone matches (XXX) XXX-XXXX format', () => {
    for (let i = 0; i < 20; i++) {
      expect(generatePatient().phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    }
  });

  test('area code is between 200 and 999', () => {
    for (let i = 0; i < 30; i++) {
      const area = Number(generatePatient().phone.slice(1, 4));
      expect(area).toBeGreaterThanOrEqual(200);
      expect(area).toBeLessThanOrEqual(999);
    }
  });

  test('phone override is respected', () => {
    expect(generatePatient({ phone: '(800) 555-1234' }).phone).toBe('(800) 555-1234');
  });
});

// ─── email ────────────────────────────────────────────────────────────────────

describe('generatePatient — email', () => {
  test('email is a valid-looking address', () => {
    for (let i = 0; i < 20; i++) {
      expect(generatePatient().email).toMatch(/^[a-z]+\.[a-z]+\d+@[a-z.]+$/);
    }
  });

  test('email contains firstName and lastName fragments', () => {
    const p = generatePatient({ firstName: 'James', lastName: 'Smith' });
    expect(p.email).toMatch(/^james\.smith\d+@/);
  });

  test('email override is respected', () => {
    expect(generatePatient({ email: 'test@example.com' }).email).toBe('test@example.com');
  });
});

// ─── combined overrides ───────────────────────────────────────────────────────

describe('generatePatient — combined overrides', () => {
  test('gender + age override both apply correctly', () => {
    const p = generatePatient({ gender: 'Female', age: 45 });
    expect(p.gender).toBe('Female');
    expect(p.age).toBe(45);
    expect([...firstNamesData.female, ...firstNamesData.neutral]).toContain(p.firstName);
  });

  test('full manual override produces exact values', () => {
    const overrides = {
      patientId: 'PAT-00001',
      firstName: 'Jane',
      lastName:  'Doe',
      gender:    'Female',
      age:       30,
      bloodGroup: 'A+',
      phone:     '(555) 000-1234',
      email:     'jane.doe@test.com',
    };
    const p = generatePatient(overrides);
    expect(p.patientId).toBe('PAT-00001');
    expect(p.firstName).toBe('Jane');
    expect(p.lastName).toBe('Doe');
    expect(p.fullName).toBe('Jane Doe');
    expect(p.gender).toBe('Female');
    expect(p.age).toBe(30);
    expect(p.bloodGroup).toBe('A+');
    expect(p.phone).toBe('(555) 000-1234');
    expect(p.email).toBe('jane.doe@test.com');
  });
});
