import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const firstNames    = require('../../src/data/firstNames.json');
const lastNames     = require('../../src/data/lastNames.json');
const genders       = require('../../src/data/genders.json');
const bloodGroups   = require('../../src/data/bloodGroups.json');
const insurancePlans = require('../../src/data/insurancePlans.json');
const departments   = require('../../src/data/departments.json');
const employmentRoles = require('../../src/data/employmentRoles.json');

// ─── firstNames ────────────────────────────────────────────────────────────────

describe('firstNames fixture', () => {
  test('has male, female, and neutral groups', () => {
    expect(firstNames).toHaveProperty('male');
    expect(firstNames).toHaveProperty('female');
    expect(firstNames).toHaveProperty('neutral');
  });

  test('each group is a non-empty array of strings', () => {
    for (const group of ['male', 'female', 'neutral']) {
      expect(Array.isArray(firstNames[group])).toBe(true);
      expect(firstNames[group].length).toBeGreaterThan(0);
      firstNames[group].forEach(name => expect(typeof name).toBe('string'));
    }
  });

  test('no duplicate names within any group', () => {
    for (const group of ['male', 'female', 'neutral']) {
      const unique = new Set(firstNames[group]);
      expect(unique.size).toBe(firstNames[group].length);
    }
  });

  test('each name is non-empty and trimmed', () => {
    const all = [...firstNames.male, ...firstNames.female, ...firstNames.neutral];
    all.forEach(name => {
      expect(name.trim().length).toBeGreaterThan(0);
      expect(name).toBe(name.trim());
    });
  });
});

// ─── lastNames ─────────────────────────────────────────────────────────────────

describe('lastNames fixture', () => {
  test('has a lastNames array', () => {
    expect(Array.isArray(lastNames.lastNames)).toBe(true);
  });

  test('contains at least 50 entries', () => {
    expect(lastNames.lastNames.length).toBeGreaterThanOrEqual(50);
  });

  test('all entries are non-empty trimmed strings', () => {
    lastNames.lastNames.forEach(name => {
      expect(typeof name).toBe('string');
      expect(name.trim().length).toBeGreaterThan(0);
      expect(name).toBe(name.trim());
    });
  });

  test('no duplicates', () => {
    const unique = new Set(lastNames.lastNames);
    expect(unique.size).toBe(lastNames.lastNames.length);
  });
});

// ─── genders ───────────────────────────────────────────────────────────────────

describe('genders fixture', () => {
  test('has a genders array', () => {
    expect(Array.isArray(genders.genders)).toBe(true);
  });

  test('contains at least 3 entries', () => {
    expect(genders.genders.length).toBeGreaterThanOrEqual(3);
  });

  test('includes Male and Female', () => {
    expect(genders.genders).toContain('Male');
    expect(genders.genders).toContain('Female');
  });

  test('all entries are non-empty strings', () => {
    genders.genders.forEach(g => {
      expect(typeof g).toBe('string');
      expect(g.trim().length).toBeGreaterThan(0);
    });
  });
});

// ─── bloodGroups ───────────────────────────────────────────────────────────────

describe('bloodGroups fixture', () => {
  const expected = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  test('has a bloodGroups array', () => {
    expect(Array.isArray(bloodGroups.bloodGroups)).toBe(true);
  });

  test('contains exactly the 8 standard blood groups', () => {
    expect(bloodGroups.bloodGroups).toHaveLength(8);
    expected.forEach(bg => expect(bloodGroups.bloodGroups).toContain(bg));
  });

  test('no duplicates', () => {
    const unique = new Set(bloodGroups.bloodGroups);
    expect(unique.size).toBe(bloodGroups.bloodGroups.length);
  });
});

// ─── insurancePlans ────────────────────────────────────────────────────────────

describe('insurancePlans fixture', () => {
  test('has an insurancePlans array', () => {
    expect(Array.isArray(insurancePlans.insurancePlans)).toBe(true);
  });

  test('contains at least 10 plans', () => {
    expect(insurancePlans.insurancePlans.length).toBeGreaterThanOrEqual(10);
  });

  test('each plan has required fields with valid values', () => {
    const validTypes = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP'];
    const validTiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];

    insurancePlans.insurancePlans.forEach(plan => {
      expect(typeof plan.name).toBe('string');
      expect(plan.name.trim().length).toBeGreaterThan(0);
      expect(validTypes).toContain(plan.type);
      expect(validTiers).toContain(plan.tier);
      expect(typeof plan.provider).toBe('string');
      expect(plan.provider.trim().length).toBeGreaterThan(0);
    });
  });

  test('no duplicate plan names', () => {
    const names = insurancePlans.insurancePlans.map(p => p.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});

// ─── departments ───────────────────────────────────────────────────────────────

describe('departments fixture', () => {
  test('has a departments array', () => {
    expect(Array.isArray(departments.departments)).toBe(true);
  });

  test('contains at least 10 departments', () => {
    expect(departments.departments.length).toBeGreaterThanOrEqual(10);
  });

  test('each department has name and code fields', () => {
    departments.departments.forEach(dept => {
      expect(typeof dept.name).toBe('string');
      expect(dept.name.trim().length).toBeGreaterThan(0);
      expect(typeof dept.code).toBe('string');
      expect(dept.code.trim().length).toBeGreaterThan(0);
    });
  });

  test('all department codes are unique', () => {
    const codes = departments.departments.map(d => d.code);
    const unique = new Set(codes);
    expect(unique.size).toBe(codes.length);
  });

  test('all department codes are uppercase', () => {
    departments.departments.forEach(dept => {
      expect(dept.code).toBe(dept.code.toUpperCase());
    });
  });
});

// ─── employmentRoles ───────────────────────────────────────────────────────────

describe('employmentRoles fixture', () => {
  test('has an employmentRoles array', () => {
    expect(Array.isArray(employmentRoles.employmentRoles)).toBe(true);
  });

  test('contains at least 15 roles', () => {
    expect(employmentRoles.employmentRoles.length).toBeGreaterThanOrEqual(15);
  });

  test('each role has title and category fields', () => {
    employmentRoles.employmentRoles.forEach(role => {
      expect(typeof role.title).toBe('string');
      expect(role.title.trim().length).toBeGreaterThan(0);
      expect(typeof role.category).toBe('string');
      expect(role.category.trim().length).toBeGreaterThan(0);
    });
  });

  test('all titles are unique', () => {
    const titles = employmentRoles.employmentRoles.map(r => r.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  test('categories are from the expected set', () => {
    const validCategories = ['Clinical', 'Administrative', 'Technology', 'Finance', 'Operations'];
    employmentRoles.employmentRoles.forEach(role => {
      expect(validCategories).toContain(role.category);
    });
  });
});
