/**
 * Example usage of health-data-faker random utilities.
 * Run: node examples/random-utils-demo.js
 */

import {
  randomItem,
  randomNumber,
  randomBoolean,
  randomString,
  randomDigits,
  randomDate,
} from '../src/utils/random.js';

console.log('=== randomItem ===');
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
console.log(randomItem(bloodTypes));
console.log(randomItem(bloodTypes));

console.log('\n=== randomNumber ===');
console.log('Age (18–90):', randomNumber(18, 90));
console.log('Room (100–999):', randomNumber(100, 999));

console.log('\n=== randomBoolean ===');
console.log('Is active?', randomBoolean());
console.log('Has insurance?', randomBoolean());

console.log('\n=== randomString ===');
console.log('Token (12):', randomString(12));
console.log('Session ID (24):', randomString(24));

console.log('\n=== randomDigits ===');
console.log('Member ID (8):', randomDigits(8));
console.log('ZIP code (5):', randomDigits(5));

console.log('\n=== randomDate ===');
const dob = randomDate(new Date('1940-01-01'), new Date('2005-12-31'));
console.log('Date of birth:', dob.toISOString().split('T')[0]);
const appt = randomDate(new Date('2024-01-01'), new Date('2026-12-31'));
console.log('Appointment date:', appt.toISOString().split('T')[0]);
