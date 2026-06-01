/**
 * validateEmployee(employee) — validates an employee record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isNotFutureDate,
  isValidEmail, isOneOf, runRules, EMPLOYEE_STATUSES, DEPT_CATEGORIES,
} from './rules.js';

/**
 * Validates the nested department object.
 */
function validateDepartment(department) {
  if (typeof department !== 'object' || department === null) {
    return { ok: false, message: '"department" must be a non-null object' };
  }
  if (!department.name || typeof department.name !== 'string') {
    return { ok: false, message: '"department.name" must be a non-empty string' };
  }
  if (!department.code || typeof department.code !== 'string') {
    return { ok: false, message: '"department.code" must be a non-empty string' };
  }
  if (department.code !== department.code.toUpperCase()) {
    return { ok: false, message: '"department.code" must be uppercase' };
  }
  return { ok: true };
}

/**
 * Validates the nested designation object.
 */
function validateDesignation(designation) {
  if (typeof designation !== 'object' || designation === null) {
    return { ok: false, message: '"designation" must be a non-null object' };
  }
  if (!designation.title || typeof designation.title !== 'string') {
    return { ok: false, message: '"designation.title" must be a non-empty string' };
  }
  if (!DEPT_CATEGORIES.includes(designation.category)) {
    return {
      ok: false,
      message: `"designation.category" must be one of [${DEPT_CATEGORIES.join(', ')}]`,
    };
  }
  return { ok: true };
}

/**
 * @param {object} employee
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateEmployee(employee) {
  if (typeof employee !== 'object' || employee === null) {
    return { valid: false, errors: ['"employee" must be a non-null object'] };
  }

  const e = employee;
  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(e.employeeId,  'employeeId'),
    () => isPresent(e.firstName,   'firstName'),
    () => isPresent(e.lastName,    'lastName'),
    () => isPresent(e.department,  'department'),
    () => isPresent(e.designation, 'designation'),
    () => isPresent(e.joiningDate, 'joiningDate'),
    () => isPresent(e.status,      'status'),
    () => isPresent(e.workEmail,   'workEmail'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isString(e.firstName, 'firstName'),
    () => isString(e.lastName,  'lastName'),
    () => isValidId(e.employeeId, 'employeeId'),
    () => isNotFutureDate(e.joiningDate, 'joiningDate'),
    () => isOneOf(e.status, EMPLOYEE_STATUSES, 'status'),
    () => isValidEmail(e.workEmail, 'workEmail'),
    // ── Nested objects ───────────────────────────────────────────────────────
    () => validateDepartment(e.department),
    () => validateDesignation(e.designation),
  ]);
}
