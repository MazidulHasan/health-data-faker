/**
 * validateMember(member) — validates a member record object.
 * Returns { valid: boolean, errors: string[] }.
 */

import {
  isPresent, isString, isValidId, isValidISODate,
  isOneOf, runRules, MEMBER_STATUSES, PLAN_TYPES, PLAN_TIERS,
} from './rules.js';

/**
 * Validates the nested plan object.
 */
function validatePlan(plan) {
  if (typeof plan !== 'object' || plan === null) {
    return { ok: false, message: '"plan" must be a non-null object' };
  }
  const errors = [];
  if (!plan.name  || typeof plan.name     !== 'string') errors.push('"plan.name" must be a non-empty string');
  if (!PLAN_TYPES.includes(plan.type))                  errors.push(`"plan.type" must be one of [${PLAN_TYPES.join(', ')}]`);
  if (!PLAN_TIERS.includes(plan.tier))                  errors.push(`"plan.tier" must be one of [${PLAN_TIERS.join(', ')}]`);
  if (!plan.provider || typeof plan.provider !== 'string') errors.push('"plan.provider" must be a non-empty string');
  if (errors.length > 0) return { ok: false, message: errors[0] };
  return { ok: true };
}

/**
 * Validates the nested eligibility object.
 */
function validateEligibility(eligibility) {
  if (typeof eligibility !== 'object' || eligibility === null) {
    return { ok: false, message: '"eligibility" must be a non-null object' };
  }
  if (typeof eligibility.isEligible !== 'boolean') {
    return { ok: false, message: '"eligibility.isEligible" must be a boolean' };
  }
  if (typeof eligibility.reason !== 'string' || eligibility.reason.trim() === '') {
    return { ok: false, message: '"eligibility.reason" must be a non-empty string' };
  }
  return { ok: true };
}

/**
 * @param {object} member
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateMember(member) {
  if (typeof member !== 'object' || member === null) {
    return { valid: false, errors: ['"member" must be a non-null object'] };
  }

  const m = member;
  return runRules([
    // ── Required fields present ──────────────────────────────────────────────
    () => isPresent(m.memberId,      'memberId'),
    () => isPresent(m.plan,          'plan'),
    () => isPresent(m.policyNumber,  'policyNumber'),
    () => isPresent(m.effectiveDate, 'effectiveDate'),
    () => isPresent(m.status,        'status'),
    () => isPresent(m.eligibility,   'eligibility'),
    // ── Field formats ────────────────────────────────────────────────────────
    () => isValidId(m.memberId,     'memberId'),
    () => isValidId(m.policyNumber, 'policyNumber'),
    () => isValidISODate(m.effectiveDate, 'effectiveDate'),
    () => isOneOf(m.status, MEMBER_STATUSES, 'status'),
    // ── Nested objects ───────────────────────────────────────────────────────
    () => validatePlan(m.plan),
    () => validateEligibility(m.eligibility),
  ]);
}
