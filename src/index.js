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

// ── Generators — Demographics ─────────────────────────────────────────────────
export { generatePatient }   from './generators/patient.js';
export { generateMember }    from './generators/member.js';
export { generateEmployee }  from './generators/employee.js';

// ── Generators — Clinical ─────────────────────────────────────────────────────
export { generateDiagnosis } from './generators/diagnosis.js';
export { generateLabResult } from './generators/lab.js';
export { generateMedication }from './generators/medication.js';
export { generateVitals }    from './generators/vitals.js';
export { generateEncounter } from './generators/encounter.js';

// ── Validators — Demographics ─────────────────────────────────────────────────
export { validatePatient }   from './validators/patient.js';
export { validateMember }    from './validators/member.js';
export { validateEmployee }  from './validators/employee.js';

// ── Validators — Clinical ─────────────────────────────────────────────────────
export { validateDiagnosis } from './validators/diagnosis.js';
export { validateLabResult } from './validators/lab.js';
export { validateMedication }from './validators/medication.js';
export { validateVitals }    from './validators/vitals.js';
export { validateEncounter } from './validators/encounter.js';
