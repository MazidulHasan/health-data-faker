/**
 * Shared primitive validation rules.
 * Each rule function returns { ok: boolean, message: string }.
 * Used internally by all validators — not part of the public API.
 */

export const BLOOD_GROUPS         = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const DIAGNOSIS_TYPES      = ['Primary', 'Secondary', 'Comorbidity'];
export const DIAGNOSIS_STATUSES   = ['Active', 'Resolved', 'Chronic', 'Ruled Out'];
export const LAB_STATUSES         = ['final', 'preliminary', 'corrected', 'cancelled'];
export const LAB_INTERPRETATIONS  = ['Normal', 'High', 'Low', 'Critical High', 'Critical Low'];
export const MEDICATION_STATUSES  = ['Active', 'Discontinued', 'Hold', 'Completed'];
export const ENCOUNTER_STATUSES   = ['Finished', 'In Progress', 'Planned', 'Cancelled'];
export const ENCOUNTER_CLASSES    = ['Ambulatory', 'Emergency', 'Inpatient', 'Observation', 'Telehealth'];
export const MEMBER_STATUSES  = ['Active', 'Inactive', 'Terminated', 'Pending', 'Suspended'];
export const EMPLOYEE_STATUSES = ['Active', 'On Leave', 'Terminated', 'Probation', 'Resigned'];
export const PLAN_TYPES       = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP'];
export const PLAN_TIERS       = ['Bronze', 'Silver', 'Gold', 'Platinum'];
export const DEPT_CATEGORIES  = ['Clinical', 'Administrative', 'Technology', 'Finance', 'Operations'];

/** Field exists and is not null/undefined/empty-string. */
export function isPresent(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    return { ok: false, message: `"${fieldName}" is required` };
  }
  return { ok: true };
}

/** Value is a non-empty string. */
export function isString(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    return { ok: false, message: `"${fieldName}" must be a non-empty string` };
  }
  return { ok: true };
}

/** Value matches a given regex. */
export function matchesPattern(value, pattern, fieldName, hint) {
  if (!pattern.test(value)) {
    return { ok: false, message: `"${fieldName}" has invalid format${hint ? ` (expected ${hint})` : ''}` };
  }
  return { ok: true };
}

/** Value is one of the allowed set. */
export function isOneOf(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    return { ok: false, message: `"${fieldName}" must be one of [${allowed.join(', ')}], got "${value}"` };
  }
  return { ok: true };
}

/** Value is a valid ISO date string (YYYY-MM-DD) that parses to a real date. */
export function isValidISODate(value, fieldName) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, message: `"${fieldName}" must be a date in YYYY-MM-DD format` };
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    return { ok: false, message: `"${fieldName}" is not a real calendar date` };
  }
  return { ok: true };
}

/** Value is a valid ISO date that is not in the future. */
export function isNotFutureDate(value, fieldName) {
  const check = isValidISODate(value, fieldName);
  if (!check.ok) return check;
  if (new Date(value).getTime() > Date.now()) {
    return { ok: false, message: `"${fieldName}" must not be a future date` };
  }
  return { ok: true };
}

/** Value is a positive integer. */
export function isPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    return { ok: false, message: `"${fieldName}" must be a non-negative integer` };
  }
  return { ok: true };
}

/** Basic email format check. */
export function isValidEmail(value, fieldName) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { ok: false, message: `"${fieldName}" is not a valid email address` };
  }
  return { ok: true };
}

/** US phone format: (XXX) XXX-XXXX */
export function isValidPhone(value, fieldName) {
  if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
    return {
      ok: false,
      message: `"${fieldName}" must match US format (XXX) XXX-XXXX`,
    };
  }
  return { ok: true };
}

/** Identifier format: one or more uppercase letters, a dash, one or more digits. */
export function isValidId(value, fieldName) {
  if (!/^[A-Z]+-\d+$/.test(value)) {
    return { ok: false, message: `"${fieldName}" must match format PREFIX-DIGITS (e.g. PAT-10001)` };
  }
  return { ok: true };
}

/**
 * Runs an array of rule functions and collects all error messages.
 * @param {Array<() => { ok: boolean, message?: string }>} rules
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function runRules(rules) {
  const errors = [];
  for (const rule of rules) {
    const result = rule();
    if (!result.ok) errors.push(result.message);
  }
  return { valid: errors.length === 0, errors };
}
