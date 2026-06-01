/**
 * generateMember() — produces a realistic fake healthcare member record.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomDate } from '../utils/random.js';
import { createMemberId, createPolicyNumber } from './identifiers.js';

const insurancePlansData = require('../data/insurancePlans.json');

const STATUSES = ['Active', 'Inactive', 'Terminated', 'Pending', 'Suspended'];

/**
 * Eligibility rules keyed by status.
 * isEligible reflects whether the member can currently use their coverage.
 */
const ELIGIBILITY_MAP = {
  Active:     { isEligible: true,  reason: 'Active coverage' },
  Inactive:   { isEligible: false, reason: 'Coverage inactive' },
  Terminated: { isEligible: false, reason: 'Coverage terminated' },
  Pending:    { isEligible: false, reason: 'Pending enrollment' },
  Suspended:  { isEligible: false, reason: 'Coverage suspended' },
};

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Generates a fake member record.
 *
 * @param {object} overrides
 * @param {string}  [overrides.memberId]
 * @param {object}  [overrides.plan]          — full plan object { name, type, tier, provider }
 * @param {string}  [overrides.policyNumber]
 * @param {string}  [overrides.effectiveDate] — ISO string "YYYY-MM-DD"
 * @param {string}  [overrides.status]        — drives eligibility when not also overridden
 * @param {object}  [overrides.eligibility]   — { isEligible: boolean, reason: string }
 * @returns {object}
 */
export function generateMember(overrides = {}) {
  const plan   = overrides.plan   ?? randomItem(insurancePlansData.insurancePlans);
  const status = overrides.status ?? randomItem(STATUSES);

  // effectiveDate: random date between Jan 2018 and today
  const effectiveDate = overrides.effectiveDate
    ?? toISODate(randomDate(new Date('2018-01-01'), new Date()));

  // eligibility derives from status unless explicitly overridden
  const eligibility = overrides.eligibility ?? { ...ELIGIBILITY_MAP[status] };

  return {
    memberId:      overrides.memberId      ?? createMemberId(),
    plan,
    policyNumber:  overrides.policyNumber  ?? createPolicyNumber(),
    effectiveDate,
    status,
    eligibility,
  };
}
