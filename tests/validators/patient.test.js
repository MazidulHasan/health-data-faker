import { validatePatient } from '../../src/validators/patient.js';
import { generatePatient }  from '../../src/generators/patient.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validatePatient — generated records', () => {
  test('passes for 50 randomly generated patients', () => {
    for (let i = 0; i < 50; i++) {
      const result = validatePatient(generatePatient());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('validatePatient — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validatePatient(generatePatient());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid result for non-object input', () => {
    expect(validatePatient(null).valid).toBe(false);
    expect(validatePatient('string').valid).toBe(false);
    expect(validatePatient(42).valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validatePatient — required fields', () => {
  const REQUIRED = [
    'patientId', 'firstName', 'lastName', 'fullName',
    'gender', 'dateOfBirth', 'age', 'bloodGroup', 'phone', 'email',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const p = generatePatient();
      delete p[field];
      const r = validatePatient(p);
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── patientId format ─────────────────────────────────────────────────────────

describe('validatePatient — patientId format', () => {
  test('passes with valid ID formats', () => {
    ['PAT-10001', 'MRN-000001', 'X-1'].forEach(id => {
      const r = validatePatient(generatePatient({ patientId: id }));
      expect(r.valid).toBe(true);
    });
  });

  test('fails when patientId has no prefix', () => {
    const r = validatePatient(generatePatient({ patientId: '12345' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('patientId'))).toBe(true);
  });

  test('fails when patientId has lowercase prefix', () => {
    const r = validatePatient(generatePatient({ patientId: 'pat-10001' }));
    expect(r.valid).toBe(false);
  });

  test('fails when patientId has no digits after dash', () => {
    const r = validatePatient(generatePatient({ patientId: 'PAT-' }));
    expect(r.valid).toBe(false);
  });
});

// ─── dateOfBirth ──────────────────────────────────────────────────────────────

describe('validatePatient — dateOfBirth', () => {
  test('fails for a future date', () => {
    const r = validatePatient(generatePatient({ dateOfBirth: '2099-01-01', age: 0 }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('dateOfBirth'))).toBe(true);
  });

  test('fails for invalid date string', () => {
    const r = validatePatient(generatePatient({ dateOfBirth: 'not-a-date', age: 30 }));
    expect(r.valid).toBe(false);
  });

  test('fails for wrong format (MM/DD/YYYY)', () => {
    const r = validatePatient(generatePatient({ dateOfBirth: '01/15/1990', age: 35 }));
    expect(r.valid).toBe(false);
  });
});

// ─── age ──────────────────────────────────────────────────────────────────────

describe('validatePatient — age', () => {
  test('fails when age is negative', () => {
    const r = validatePatient(generatePatient({ age: -5 }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('age'))).toBe(true);
  });

  test('fails when age is not an integer', () => {
    const r = validatePatient(generatePatient({ age: 30.5 }));
    expect(r.valid).toBe(false);
  });

  test('fails when age is wildly inconsistent with dateOfBirth', () => {
    const r = validatePatient(generatePatient({ dateOfBirth: '1990-01-01', age: 99 }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('age'))).toBe(true);
  });
});

// ─── bloodGroup ───────────────────────────────────────────────────────────────

describe('validatePatient — bloodGroup', () => {
  test('passes for all valid blood groups', () => {
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].forEach(bg => {
      expect(validatePatient(generatePatient({ bloodGroup: bg })).valid).toBe(true);
    });
  });

  test('fails for invalid blood group', () => {
    const r = validatePatient(generatePatient({ bloodGroup: 'C+' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('bloodGroup'))).toBe(true);
  });
});

// ─── phone ────────────────────────────────────────────────────────────────────

describe('validatePatient — phone', () => {
  test('passes for valid US phone format', () => {
    expect(validatePatient(generatePatient({ phone: '(800) 555-1234' })).valid).toBe(true);
  });

  test('fails for missing parentheses', () => {
    const r = validatePatient(generatePatient({ phone: '800-555-1234' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('phone'))).toBe(true);
  });

  test('fails for wrong digit count', () => {
    const r = validatePatient(generatePatient({ phone: '(80) 555-1234' }));
    expect(r.valid).toBe(false);
  });

  test('fails for non-digit characters in number', () => {
    const r = validatePatient(generatePatient({ phone: '(8OO) 555-1234' }));
    expect(r.valid).toBe(false);
  });
});

// ─── email ────────────────────────────────────────────────────────────────────

describe('validatePatient — email', () => {
  test('passes for valid email addresses', () => {
    ['user@example.com', 'a.b+c@x.org', 'test123@mail.co.uk'].forEach(email => {
      expect(validatePatient(generatePatient({ email })).valid).toBe(true);
    });
  });

  test('fails when @ is missing', () => {
    const r = validatePatient(generatePatient({ email: 'notanemail.com' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('email'))).toBe(true);
  });

  test('fails when domain is missing', () => {
    const r = validatePatient(generatePatient({ email: 'user@' }));
    expect(r.valid).toBe(false);
  });
});

// ─── fullName consistency ─────────────────────────────────────────────────────

describe('validatePatient — fullName consistency', () => {
  test('fails when fullName does not match firstName + lastName', () => {
    const p = generatePatient({ firstName: 'John', lastName: 'Doe' });
    p.fullName = 'Jane Smith'; // mutate after generation to create mismatch
    const r = validatePatient(p);
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('fullName'))).toBe(true);
  });
});

// ─── multiple errors ──────────────────────────────────────────────────────────

describe('validatePatient — multiple errors', () => {
  test('collects all errors at once', () => {
    const r = validatePatient({
      patientId:   'bad-id',
      firstName:   'Jane',
      lastName:    'Doe',
      fullName:    'Jane Doe',
      gender:      'Female',
      dateOfBirth: '2099-01-01',
      age:         -1,
      bloodGroup:  'Z+',
      phone:       '1234567890',
      email:       'not-an-email',
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(1);
  });
});
