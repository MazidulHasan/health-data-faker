/**
 * health-data-faker — public API
 *
 * Everything exported here is stable and intentional.
 * Internal utilities (src/utils/, src/validators/rules.js) are
 * importable by path for contributors but are not part of the public API.
 *
 * Usage:
 *   import { generatePatient, validatePatient } from 'health-data-faker';
 */

// ── Generators ────────────────────────────────────────────────────────────────
export { generatePatient }  from './generators/patient.js';
export { generateMember }   from './generators/member.js';
export { generateEmployee } from './generators/employee.js';

// ── Validators ────────────────────────────────────────────────────────────────
export { validatePatient }  from './validators/patient.js';
export { validateMember }   from './validators/member.js';
export { validateEmployee } from './validators/employee.js';
