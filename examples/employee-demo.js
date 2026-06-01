/**
 * Example usage of generateEmployee().
 * Run: node examples/employee-demo.js
 */

import { generateEmployee } from '../src/generators/employee.js';

console.log('=== Default employee ===');
console.log(JSON.stringify(generateEmployee(), null, 2));

console.log('\n=== status: "Active" ===');
console.log(JSON.stringify(generateEmployee({ status: 'Active' }), null, 2));

console.log('\n=== status: "On Leave" ===');
console.log(JSON.stringify(generateEmployee({ status: 'On Leave' }), null, 2));

console.log('\n=== Custom department + designation ===');
console.log(JSON.stringify(generateEmployee({
  department:  { name: 'Cardiology', code: 'CD' },
  designation: { title: 'Physician', category: 'Clinical' },
  status:      'Active',
}), null, 2));

console.log('\n=== Batch of 5 employees (summary) ===');
for (let i = 0; i < 5; i++) {
  const e = generateEmployee();
  console.log(
    `  ${e.employeeId} | ${e.firstName} ${e.lastName} | ` +
    `[${e.department.code}] ${e.designation.title} | ${e.status} | ${e.workEmail}`
  );
}
