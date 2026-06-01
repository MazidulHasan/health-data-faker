/**
 * Reusable payload builders for Playwright API tests.
 * Import these in any spec file to generate consistent request bodies.
 *
 * All functions accept an optional overrides object so individual tests
 * can pin specific fields without losing the random defaults.
 */

import {
  generatePatient,
  generateMember,
  generateEmployee,
} from '../../../src/index.js';

/**
 * Builds a POST /api/patients request body.
 * @param {object} overrides
 * @returns {object}
 */
export function patientPayload(overrides = {}) {
  return generatePatient(overrides);
}

/**
 * Builds a POST /api/members request body.
 * @param {object} overrides
 * @returns {object}
 */
export function memberPayload(overrides = {}) {
  return generateMember(overrides);
}

/**
 * Builds a POST /api/employees request body.
 * @param {object} overrides
 * @returns {object}
 */
export function employeePayload(overrides = {}) {
  return generateEmployee(overrides);
}
