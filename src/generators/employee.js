/**
 * generateEmployee() — produces a realistic fake employee record.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomDate, randomNumber } from '../utils/random.js';
import { createEmployeeId } from './identifiers.js';

const firstNamesData      = require('../data/firstNames.json');
const lastNamesData       = require('../data/lastNames.json');
const departmentsData     = require('../data/departments.json');
const employmentRolesData = require('../data/employmentRoles.json');

const ALL_FIRST_NAMES = [
  ...firstNamesData.male,
  ...firstNamesData.female,
  ...firstNamesData.neutral,
];

const STATUSES = ['Active', 'On Leave', 'Terminated', 'Probation', 'Resigned'];

const WORK_DOMAINS = [
  'healthcorp.org',
  'medstaff.com',
  'caresystem.net',
  'hospitalgroup.org',
  'clinicworks.com',
];

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Builds a work email from first/last name + optional disambiguation digit.
 * Lowercased, non-alpha characters stripped.
 */
function generateWorkEmail(firstName, lastName) {
  const clean  = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  const domain = randomItem(WORK_DOMAINS);
  const tag    = randomNumber(1, 99);
  return `${clean(firstName)}.${clean(lastName)}${tag}@${domain}`;
}

/**
 * Generates a fake employee record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.employeeId]
 * @param {string}  [overrides.firstName]
 * @param {string}  [overrides.lastName]
 * @param {object}  [overrides.department]   — { name, code }
 * @param {object}  [overrides.designation]  — { title, category }
 * @param {string}  [overrides.joiningDate]  — ISO string "YYYY-MM-DD"
 * @param {string}  [overrides.status]
 * @param {string}  [overrides.workEmail]
 * @returns {object}
 */
export function generateEmployee(overrides = {}) {
  const firstName = overrides.firstName ?? randomItem(ALL_FIRST_NAMES);
  const lastName  = overrides.lastName  ?? randomItem(lastNamesData.lastNames);

  const joiningDate = overrides.joiningDate
    ?? toISODate(randomDate(new Date('2010-01-01'), new Date()));

  return {
    employeeId:  overrides.employeeId  ?? createEmployeeId(),
    firstName,
    lastName,
    department:  overrides.department  ?? randomItem(departmentsData.departments),
    designation: overrides.designation ?? randomItem(employmentRolesData.employmentRoles),
    joiningDate,
    status:      overrides.status      ?? randomItem(STATUSES),
    workEmail:   overrides.workEmail   ?? generateWorkEmail(firstName, lastName),
  };
}
