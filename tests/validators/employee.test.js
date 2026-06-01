import { validateEmployee } from '../../src/validators/employee.js';
import { generateEmployee }  from '../../src/generators/employee.js';

// ─── Valid generated records ───────────────────────────────────────────────────

describe('validateEmployee — generated records', () => {
  test('passes for 50 randomly generated employees', () => {
    for (let i = 0; i < 50; i++) {
      const result = validateEmployee(generateEmployee());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    }
  });
});

// ─── Shape ────────────────────────────────────────────────────────────────────

describe('validateEmployee — return shape', () => {
  test('returns { valid, errors } object', () => {
    const r = validateEmployee(generateEmployee());
    expect(r).toHaveProperty('valid');
    expect(r).toHaveProperty('errors');
    expect(Array.isArray(r.errors)).toBe(true);
  });

  test('returns invalid for non-object input', () => {
    expect(validateEmployee(null).valid).toBe(false);
    expect(validateEmployee(undefined).valid).toBe(false);
  });
});

// ─── Required fields ──────────────────────────────────────────────────────────

describe('validateEmployee — required fields', () => {
  const REQUIRED = [
    'employeeId', 'firstName', 'lastName', 'department',
    'designation', 'joiningDate', 'status', 'workEmail',
  ];

  REQUIRED.forEach(field => {
    test(`fails when "${field}" is missing`, () => {
      const e = generateEmployee();
      delete e[field];
      const r = validateEmployee(e);
      expect(r.valid).toBe(false);
      expect(r.errors.some(err => err.includes(`"${field}"`))).toBe(true);
    });
  });
});

// ─── employeeId format ────────────────────────────────────────────────────────

describe('validateEmployee — employeeId format', () => {
  test('passes with valid ID formats', () => {
    ['EMP-1234', 'STAFF-9999', 'E-1'].forEach(id => {
      expect(validateEmployee(generateEmployee({ employeeId: id })).valid).toBe(true);
    });
  });

  test('fails for ID with no prefix', () => {
    const r = validateEmployee(generateEmployee({ employeeId: '1234' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('employeeId'))).toBe(true);
  });

  test('fails for ID with lowercase prefix', () => {
    const r = validateEmployee(generateEmployee({ employeeId: 'emp-1234' }));
    expect(r.valid).toBe(false);
  });

  test('fails for ID with no digits', () => {
    const r = validateEmployee(generateEmployee({ employeeId: 'EMP-' }));
    expect(r.valid).toBe(false);
  });
});

// ─── joiningDate ──────────────────────────────────────────────────────────────

describe('validateEmployee — joiningDate', () => {
  test('passes for a valid past date', () => {
    expect(validateEmployee(generateEmployee({ joiningDate: '2015-04-20' })).valid).toBe(true);
  });

  test('fails for a future joiningDate', () => {
    const r = validateEmployee(generateEmployee({ joiningDate: '2099-01-01' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('joiningDate'))).toBe(true);
  });

  test('fails for invalid date format', () => {
    const r = validateEmployee(generateEmployee({ joiningDate: '20-01-2022' }));
    expect(r.valid).toBe(false);
  });

  test('fails for a non-existent date', () => {
    const r = validateEmployee(generateEmployee({ joiningDate: '2022-13-40' }));
    expect(r.valid).toBe(false);
  });
});

// ─── status ───────────────────────────────────────────────────────────────────

describe('validateEmployee — status', () => {
  const VALID = ['Active', 'On Leave', 'Terminated', 'Probation', 'Resigned'];

  test('passes for all valid statuses', () => {
    VALID.forEach(s => {
      expect(validateEmployee(generateEmployee({ status: s })).valid).toBe(true);
    });
  });

  test('fails for invalid status', () => {
    const r = validateEmployee(generateEmployee({ status: 'Suspended' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('status'))).toBe(true);
  });
});

// ─── workEmail ────────────────────────────────────────────────────────────────

describe('validateEmployee — workEmail', () => {
  test('passes for valid email formats', () => {
    ['john.doe@healthcorp.org', 'a@b.com'].forEach(email => {
      expect(validateEmployee(generateEmployee({ workEmail: email })).valid).toBe(true);
    });
  });

  test('fails when @ is missing', () => {
    const r = validateEmployee(generateEmployee({ workEmail: 'nodomain.com' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('workEmail'))).toBe(true);
  });

  test('fails for empty string', () => {
    const r = validateEmployee(generateEmployee({ workEmail: '' }));
    expect(r.valid).toBe(false);
  });
});

// ─── department ───────────────────────────────────────────────────────────────

describe('validateEmployee — department', () => {
  test('passes for valid department object', () => {
    const dept = { name: 'Cardiology', code: 'CD' };
    expect(validateEmployee(generateEmployee({ department: dept })).valid).toBe(true);
  });

  test('fails when department is not an object', () => {
    const r = validateEmployee(generateEmployee({ department: 'Cardiology' }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('department'))).toBe(true);
  });

  test('fails when department.code is lowercase', () => {
    const r = validateEmployee(generateEmployee({ department: { name: 'Cardiology', code: 'cd' } }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('department.code'))).toBe(true);
  });

  test('fails when department.name is missing', () => {
    const r = validateEmployee(generateEmployee({ department: { code: 'CD' } }));
    expect(r.valid).toBe(false);
  });
});

// ─── designation ──────────────────────────────────────────────────────────────

describe('validateEmployee — designation', () => {
  test('passes for valid designation object', () => {
    const desig = { title: 'Physician', category: 'Clinical' };
    expect(validateEmployee(generateEmployee({ designation: desig })).valid).toBe(true);
  });

  test('fails for invalid category', () => {
    const desig = { title: 'Physician', category: 'Unknown' };
    const r = validateEmployee(generateEmployee({ designation: desig }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.includes('designation.category'))).toBe(true);
  });

  test('fails when designation is not an object', () => {
    const r = validateEmployee(generateEmployee({ designation: 'Physician' }));
    expect(r.valid).toBe(false);
  });

  test('fails when designation.title is missing', () => {
    const r = validateEmployee(generateEmployee({ designation: { category: 'Clinical' } }));
    expect(r.valid).toBe(false);
  });
});

// ─── multiple errors ──────────────────────────────────────────────────────────

describe('validateEmployee — multiple errors', () => {
  test('collects all errors at once', () => {
    const r = validateEmployee({
      employeeId:  'bad',
      firstName:   'Ada',
      lastName:    'Lovelace',
      department:  { name: 'IT', code: 'lowercase' },
      designation: { title: 'Dev', category: 'InvalidCat' },
      joiningDate: '2099-12-31',
      status:      'Moonlighting',
      workEmail:   'not-an-email',
    });
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThan(1);
  });
});
