/**
 * Example validation results for patient, member, and employee records.
 * Run: node examples/validation-demo.js
 */

import { generatePatient }  from '../src/generators/patient.js';
import { generateMember }   from '../src/generators/member.js';
import { generateEmployee } from '../src/generators/employee.js';
import { validatePatient }  from '../src/validators/patient.js';
import { validateMember }   from '../src/validators/member.js';
import { validateEmployee } from '../src/validators/employee.js';

function printResult(label, result) {
  const icon = result.valid ? '✓' : '✗';
  console.log(`${icon} ${label}: valid=${result.valid}`);
  if (result.errors.length > 0) {
    result.errors.forEach(e => console.log(`    ERROR: ${e}`));
  }
}

// ─── Valid records ─────────────────────────────────────────────────────────────

console.log('=== Valid generated records ===');
printResult('Patient',  validatePatient(generatePatient()));
printResult('Member',   validateMember(generateMember()));
printResult('Employee', validateEmployee(generateEmployee()));

// ─── Invalid patient ──────────────────────────────────────────────────────────

console.log('\n=== Invalid patient (bad ID, future DOB, wrong phone) ===');
printResult('Patient', validatePatient({
  patientId:   'pat-123',
  firstName:   'John',
  lastName:    'Doe',
  fullName:    'John Doe',
  gender:      'Male',
  dateOfBirth: '2099-01-01',
  age:         0,
  bloodGroup:  'A+',
  phone:       '8005551234',
  email:       'john.doe@example.com',
}));

// ─── Invalid member ───────────────────────────────────────────────────────────

console.log('\n=== Invalid member (bad plan, unknown status) ===');
printResult('Member', validateMember({
  memberId:      'MBR-12345678',
  plan:          { name: 'Plan X', type: 'INVALID', tier: 'Diamond', provider: 'Acme' },
  policyNumber:  'POL-11111',
  effectiveDate: '2022-01-01',
  status:        'Unknown',
  eligibility:   { isEligible: 'yes', reason: '' },
}));

// ─── Invalid employee ─────────────────────────────────────────────────────────

console.log('\n=== Invalid employee (future joining date, bad category, bad email) ===');
printResult('Employee', validateEmployee({
  employeeId:  'EMP-5000',
  firstName:   'Ada',
  lastName:    'Lovelace',
  department:  { name: 'Engineering', code: 'eng' },
  designation: { title: 'Engineer', category: 'Robotics' },
  joiningDate: '2099-06-01',
  status:      'Active',
  workEmail:   'not-an-email',
}));

// ─── Override then validate ────────────────────────────────────────────────────

console.log('\n=== Override + validate round-trip ===');
const patient = generatePatient({ gender: 'Female', age: 45 });
printResult(`Patient (${patient.fullName}, age ${patient.age})`, validatePatient(patient));

const member = generateMember({ status: 'Active' });
printResult(`Member  (${member.memberId}, ${member.status})`, validateMember(member));

const employee = generateEmployee({ status: 'On Leave' });
printResult(`Employee (${employee.employeeId}, ${employee.status})`, validateEmployee(employee));
