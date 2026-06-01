/**
 * Public API usage — exactly as an end user would write it.
 * Simulates: import { ... } from 'health-data-faker'
 *
 * Run: node examples/public-api-demo.js
 */

import {
  generatePatient,
  generateMember,
  generateEmployee,
  validatePatient,
  validateMember,
  validateEmployee,
} from '../src/index.js';

// ─── Generate ─────────────────────────────────────────────────────────────────

console.log('=== generatePatient() ===');
console.log(JSON.stringify(generatePatient({ gender: 'Female', age: 34 }), null, 2));

console.log('\n=== generateMember() ===');
console.log(JSON.stringify(generateMember({ status: 'Active' }), null, 2));

console.log('\n=== generateEmployee() ===');
console.log(JSON.stringify(generateEmployee({ status: 'Active' }), null, 2));

// ─── Validate valid records ───────────────────────────────────────────────────

console.log('\n=== validatePatient (valid) ===');
console.log(validatePatient(generatePatient()));

console.log('\n=== validateMember (valid) ===');
console.log(validateMember(generateMember()));

console.log('\n=== validateEmployee (valid) ===');
console.log(validateEmployee(generateEmployee()));

// ─── Validate invalid records ─────────────────────────────────────────────────

console.log('\n=== validatePatient (invalid) ===');
console.log(validatePatient({
  patientId:   'pat-001',
  firstName:   '',
  lastName:    'Doe',
  fullName:    'Doe',
  gender:      'Male',
  dateOfBirth: '2099-12-31',
  age:         -5,
  bloodGroup:  'X+',
  phone:       '123',
  email:       'bademail',
}));

// ─── Round-trip ───────────────────────────────────────────────────────────────

console.log('\n=== Generate → Validate round-trip ===');
const patient  = generatePatient();
const member   = generateMember();
const employee = generateEmployee();

console.log('Patient  valid:', validatePatient(patient).valid,   `(${patient.fullName})`);
console.log('Member   valid:', validateMember(member).valid,     `(${member.memberId})`);
console.log('Employee valid:', validateEmployee(employee).valid, `(${employee.workEmail})`);
