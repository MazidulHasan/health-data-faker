import { generateEmployee } from '../../src/generators/employee.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const firstNamesData      = require('../../src/data/firstNames.json');
const lastNamesData       = require('../../src/data/lastNames.json');
const departmentsData     = require('../../src/data/departments.json');
const employmentRolesData = require('../../src/data/employmentRoles.json');

const ALL_FIRST_NAMES = [
  ...firstNamesData.male,
  ...firstNamesData.female,
  ...firstNamesData.neutral,
];

const VALID_STATUSES = ['Active', 'On Leave', 'Terminated', 'Probation', 'Resigned'];

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('generateEmployee — shape', () => {
  let employee;
  beforeEach(() => { employee = generateEmployee(); });

  test('returns a non-null object', () => {
    expect(typeof employee).toBe('object');
    expect(employee).not.toBeNull();
  });

  test('has all required fields', () => {
    ['employeeId', 'firstName', 'lastName', 'department',
      'designation', 'joiningDate', 'status', 'workEmail']
      .forEach(f => expect(employee).toHaveProperty(f));
  });

  test('has exactly 8 fields', () => {
    expect(Object.keys(employee)).toHaveLength(8);
  });
});

// ─── employeeId ───────────────────────────────────────────────────────────────

describe('generateEmployee — employeeId', () => {
  test('matches EMP-#### format', () => {
    expect(generateEmployee().employeeId).toMatch(/^EMP-\d{4}$/);
  });

  test('number is within default range [1000, 9999]', () => {
    for (let i = 0; i < 30; i++) {
      const n = Number(generateEmployee().employeeId.split('-')[1]);
      expect(n).toBeGreaterThanOrEqual(1000);
      expect(n).toBeLessThanOrEqual(9999);
    }
  });

  test('override is respected', () => {
    expect(generateEmployee({ employeeId: 'EMP-0001' }).employeeId).toBe('EMP-0001');
  });
});

// ─── firstName / lastName ─────────────────────────────────────────────────────

describe('generateEmployee — name fields', () => {
  test('firstName comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(ALL_FIRST_NAMES).toContain(generateEmployee().firstName);
    }
  });

  test('lastName comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(lastNamesData.lastNames).toContain(generateEmployee().lastName);
    }
  });

  test('firstName override is respected', () => {
    expect(generateEmployee({ firstName: 'Ada' }).firstName).toBe('Ada');
  });

  test('lastName override is respected', () => {
    expect(generateEmployee({ lastName: 'Lovelace' }).lastName).toBe('Lovelace');
  });
});

// ─── department ───────────────────────────────────────────────────────────────

describe('generateEmployee — department', () => {
  test('department comes from fixture data', () => {
    const validCodes = new Set(departmentsData.departments.map(d => d.code));
    for (let i = 0; i < 30; i++) {
      expect(validCodes.has(generateEmployee().department.code)).toBe(true);
    }
  });

  test('department has name and code fields', () => {
    const { department } = generateEmployee();
    expect(typeof department.name).toBe('string');
    expect(typeof department.code).toBe('string');
    expect(department.code).toBe(department.code.toUpperCase());
  });

  test('all departments are reachable over many calls', () => {
    const seen = new Set(Array.from({ length: 500 }, () => generateEmployee().department.code));
    expect(seen.size).toBeGreaterThan(1);
  });

  test('override is respected', () => {
    const custom = { name: 'Research & Development', code: 'RD' };
    expect(generateEmployee({ department: custom }).department).toEqual(custom);
  });
});

// ─── designation ──────────────────────────────────────────────────────────────

describe('generateEmployee — designation', () => {
  const validTitles = new Set(employmentRolesData.employmentRoles.map(r => r.title));
  const validCategories = ['Clinical', 'Administrative', 'Technology', 'Finance', 'Operations'];

  test('designation comes from fixture data', () => {
    for (let i = 0; i < 30; i++) {
      expect(validTitles.has(generateEmployee().designation.title)).toBe(true);
    }
  });

  test('designation has title and category fields', () => {
    const { designation } = generateEmployee();
    expect(typeof designation.title).toBe('string');
    expect(validCategories).toContain(designation.category);
  });

  test('override is respected', () => {
    const custom = { title: 'Chief Medical Officer', category: 'Clinical' };
    expect(generateEmployee({ designation: custom }).designation).toEqual(custom);
  });
});

// ─── joiningDate ──────────────────────────────────────────────────────────────

describe('generateEmployee — joiningDate', () => {
  test('is a valid ISO date string', () => {
    const { joiningDate } = generateEmployee();
    expect(joiningDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(isNaN(new Date(joiningDate).getTime())).toBe(false);
  });

  test('falls within expected generation range (2010-01-01 to today)', () => {
    for (let i = 0; i < 20; i++) {
      const d = new Date(generateEmployee().joiningDate);
      expect(d.getTime()).toBeGreaterThanOrEqual(new Date('2010-01-01').getTime());
      expect(d.getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  test('override is respected', () => {
    expect(generateEmployee({ joiningDate: '2021-03-15' }).joiningDate).toBe('2021-03-15');
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('generateEmployee — status', () => {
  test('is one of the valid values', () => {
    for (let i = 0; i < 30; i++) {
      expect(VALID_STATUSES).toContain(generateEmployee().status);
    }
  });

  test('all status values are reachable over many calls', () => {
    const seen = new Set(Array.from({ length: 300 }, () => generateEmployee().status));
    VALID_STATUSES.forEach(s => expect(seen.has(s)).toBe(true));
  });

  test('override is respected', () => {
    VALID_STATUSES.forEach(s => {
      expect(generateEmployee({ status: s }).status).toBe(s);
    });
  });
});

// ─── workEmail ────────────────────────────────────────────────────────────────

describe('generateEmployee — workEmail', () => {
  test('is a valid-looking email address', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateEmployee().workEmail).toMatch(/^[a-z]+\.[a-z]+\d+@[a-z.]+$/);
    }
  });

  test('uses one of the work domains', () => {
    const WORK_DOMAINS = [
      'healthcorp.org', 'medstaff.com', 'caresystem.net',
      'hospitalgroup.org', 'clinicworks.com',
    ];
    for (let i = 0; i < 30; i++) {
      const domain = generateEmployee().workEmail.split('@')[1];
      expect(WORK_DOMAINS).toContain(domain);
    }
  });

  test('email reflects overridden firstName and lastName', () => {
    const e = generateEmployee({ firstName: 'Ada', lastName: 'Lovelace' });
    expect(e.workEmail).toMatch(/^ada\.lovelace\d+@/);
  });

  test('override is respected', () => {
    const email = 'ada.lovelace@hospital.org';
    expect(generateEmployee({ workEmail: email }).workEmail).toBe(email);
  });

  test('all work domains are reachable over many calls', () => {
    const WORK_DOMAINS = [
      'healthcorp.org', 'medstaff.com', 'caresystem.net',
      'hospitalgroup.org', 'clinicworks.com',
    ];
    const seen = new Set(
      Array.from({ length: 300 }, () => generateEmployee().workEmail.split('@')[1])
    );
    WORK_DOMAINS.forEach(d => expect(seen.has(d)).toBe(true));
  });
});

// ─── combined overrides ───────────────────────────────────────────────────────

describe('generateEmployee — combined overrides', () => {
  test('full override produces exact values', () => {
    const dept  = { name: 'Cardiology', code: 'CD' };
    const desig = { title: 'Physician', category: 'Clinical' };
    const e = generateEmployee({
      employeeId:  'EMP-5000',
      firstName:   'Ada',
      lastName:    'Lovelace',
      department:  dept,
      designation: desig,
      joiningDate: '2020-09-01',
      status:      'Active',
      workEmail:   'ada.lovelace@healthcorp.org',
    });
    expect(e.employeeId).toBe('EMP-5000');
    expect(e.firstName).toBe('Ada');
    expect(e.lastName).toBe('Lovelace');
    expect(e.department).toEqual(dept);
    expect(e.designation).toEqual(desig);
    expect(e.joiningDate).toBe('2020-09-01');
    expect(e.status).toBe('Active');
    expect(e.workEmail).toBe('ada.lovelace@healthcorp.org');
  });
});
