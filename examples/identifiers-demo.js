/**
 * Example usage of identifier generators.
 * Run: node examples/identifiers-demo.js
 */

import {
  createPatientId,
  createMemberId,
  createEmployeeId,
  createPolicyNumber,
  createMRN,
} from '../src/generators/identifiers.js';

console.log('=== Default formats ===');
console.log('Patient ID:     ', createPatientId());
console.log('Member ID:      ', createMemberId());
console.log('Employee ID:    ', createEmployeeId());
console.log('Policy Number:  ', createPolicyNumber());
console.log('MRN:            ', createMRN());

console.log('\n=== Custom prefixes ===');
console.log('Patient ID:     ', createPatientId({ prefix: 'PATIENT' }));
console.log('Member ID:      ', createMemberId({ prefix: 'MEMBER' }));
console.log('Employee ID:    ', createEmployeeId({ prefix: 'STAFF' }));
console.log('Policy Number:  ', createPolicyNumber({ prefix: 'POLICY' }));
console.log('MRN:            ', createMRN({ prefix: 'RECORD' }));

console.log('\n=== Custom ranges and padding ===');
console.log('PAT (padded 8): ', createPatientId({ min: 1, max: 9999, padWidth: 8 }));
console.log('MBR (12 digits):', createMemberId({ digits: 12 }));
console.log('EMP (100–199):  ', createEmployeeId({ min: 100, max: 199 }));
console.log('POL (padded 8): ', createPolicyNumber({ min: 1, max: 99, padWidth: 8 }));
console.log('MRN (9 digits): ', createMRN({ digits: 9 }));

console.log('\n=== Batch of 5 Patient IDs ===');
for (let i = 0; i < 5; i++) console.log(' ', createPatientId());
