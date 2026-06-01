/**
 * generatePatient() — produces a realistic fake healthcare patient record.
 * All fields are derived from internal utilities and JSON fixtures only.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { randomItem, randomNumber, randomDate, randomDigits } from '../utils/random.js';
import { createPatientId } from './identifiers.js';

const firstNamesData  = require('../data/firstNames.json');
const lastNamesData   = require('../data/lastNames.json');
const gendersData     = require('../data/genders.json');
const bloodGroupsData = require('../data/bloodGroups.json');

const EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'icloud.com', 'protonmail.com', 'aol.com', 'live.com',
];

/**
 * Picks the first-name pool that best matches a gender label.
 * Unmapped values fall back to the neutral pool.
 */
function firstNamePool(gender) {
  if (gender === 'Male')   return firstNamesData.male;
  if (gender === 'Female') return firstNamesData.female;
  return firstNamesData.neutral;
}

/**
 * Returns a random Date of birth whose age equals `age` as of today.
 */
function dobForAge(age) {
  const today = new Date();
  // Latest possible DOB for this age: exactly `age` years ago today
  const end   = new Date(today.getFullYear() - age,     today.getMonth(), today.getDate());
  // Earliest possible DOB: one day after `age+1` years ago today
  const start = new Date(today.getFullYear() - age - 1, today.getMonth(), today.getDate() + 1);
  return randomDate(start, end);
}

/**
 * Computes whole-year age from a Date of birth.
 */
function ageFromDob(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * Formats a Date as "YYYY-MM-DD".
 */
function toISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Builds a US-style phone number string: (XXX) XXX-XXXX
 * Area code is 200–999 (avoids invalid 0xx / 1xx prefixes).
 */
function generatePhone() {
  const area   = randomNumber(200, 999);
  const prefix = randomDigits(3);
  const line   = randomDigits(4);
  return `(${area}) ${prefix}-${line}`;
}

/**
 * Builds an email from a first/last name + random disambiguation digits.
 * Lowercased, spaces stripped, non-alpha chars removed.
 */
function generateEmail(firstName, lastName) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  const tag   = randomNumber(1, 999);
  const domain = randomItem(EMAIL_DOMAINS);
  return `${clean(firstName)}.${clean(lastName)}${tag}@${domain}`;
}

/**
 * Generates a fake patient record.
 *
 * @param {object} overrides — any field can be overridden
 * @param {string}  [overrides.gender]      — drives first-name pool selection
 * @param {number}  [overrides.age]         — drives date-of-birth generation
 * @param {string}  [overrides.patientId]
 * @param {string}  [overrides.firstName]
 * @param {string}  [overrides.lastName]
 * @param {string}  [overrides.dateOfBirth] — ISO string "YYYY-MM-DD"
 * @param {string}  [overrides.bloodGroup]
 * @param {string}  [overrides.phone]
 * @param {string}  [overrides.email]
 * @returns {object}
 */
export function generatePatient(overrides = {}) {
  // ── Gender — resolved first; drives firstName pool ─────────────────────────
  const gender = overrides.gender ?? randomItem(gendersData.genders);

  // ── Name ───────────────────────────────────────────────────────────────────
  const firstName = overrides.firstName ?? randomItem(firstNamePool(gender));
  const lastName  = overrides.lastName  ?? randomItem(lastNamesData.lastNames);
  const fullName  = `${firstName} ${lastName}`;

  // ── Age / Date of birth ────────────────────────────────────────────────────
  let dateOfBirth, age;
  if (overrides.dateOfBirth) {
    dateOfBirth = overrides.dateOfBirth;
    age         = overrides.age ?? ageFromDob(new Date(dateOfBirth));
  } else if (overrides.age !== undefined) {
    const dob   = dobForAge(overrides.age);
    dateOfBirth = toISODate(dob);
    age         = overrides.age;
  } else {
    const dob   = randomDate(new Date('1935-01-01'), new Date('2006-12-31'));
    dateOfBirth = toISODate(dob);
    age         = ageFromDob(new Date(dateOfBirth));
  }

  return {
    patientId:   overrides.patientId   ?? createPatientId(),
    firstName,
    lastName,
    fullName,
    gender,
    dateOfBirth,
    age,
    bloodGroup:  overrides.bloodGroup  ?? randomItem(bloodGroupsData.bloodGroups),
    phone:       overrides.phone       ?? generatePhone(),
    email:       overrides.email       ?? generateEmail(firstName, lastName),
  };
}
