/**
 * Example usage of generatePatient().
 * Run: node examples/patient-demo.js
 */

import { generatePatient } from '../src/generators/patient.js';

console.log('=== Default patient ===');
console.log(JSON.stringify(generatePatient(), null, 2));

console.log('\n=== gender: "Female", age: 45 ===');
console.log(JSON.stringify(generatePatient({ gender: 'Female', age: 45 }), null, 2));

console.log('\n=== gender: "Male", age: 30 ===');
console.log(JSON.stringify(generatePatient({ gender: 'Male', age: 30 }), null, 2));

console.log('\n=== Full manual override ===');
console.log(JSON.stringify(generatePatient({
  patientId:  'PAT-00001',
  firstName:  'Jane',
  lastName:   'Doe',
  gender:     'Female',
  age:        28,
  bloodGroup: 'O+',
  phone:      '(800) 555-1234',
  email:      'jane.doe@example.com',
}), null, 2));

console.log('\n=== Batch of 3 random patients ===');
for (let i = 0; i < 3; i++) {
  const p = generatePatient();
  console.log(`  ${p.patientId} | ${p.fullName} | ${p.gender} | Age ${p.age} | ${p.bloodGroup} | ${p.email}`);
}
