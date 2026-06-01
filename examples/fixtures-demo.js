/**
 * Dataset preview — shows sample values from each fixture.
 * Run: node examples/fixtures-demo.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const firstNames      = require('../src/data/firstNames.json');
const lastNames       = require('../src/data/lastNames.json');
const genders         = require('../src/data/genders.json');
const bloodGroups     = require('../src/data/bloodGroups.json');
const insurancePlans  = require('../src/data/insurancePlans.json');
const departments     = require('../src/data/departments.json');
const employmentRoles = require('../src/data/employmentRoles.json');

console.log('=== firstNames (sample) ===');
console.log('Male:   ', firstNames.male.slice(0, 5));
console.log('Female: ', firstNames.female.slice(0, 5));
console.log('Neutral:', firstNames.neutral.slice(0, 5));

console.log('\n=== lastNames (sample) ===');
console.log(lastNames.lastNames.slice(0, 8));

console.log('\n=== genders ===');
console.log(genders.genders);

console.log('\n=== bloodGroups ===');
console.log(bloodGroups.bloodGroups);

console.log('\n=== insurancePlans (sample) ===');
insurancePlans.insurancePlans.slice(0, 3).forEach(p =>
  console.log(`  ${p.name} | ${p.type} | ${p.tier} | ${p.provider}`)
);

console.log('\n=== departments (sample) ===');
departments.departments.slice(0, 5).forEach(d =>
  console.log(`  [${d.code}] ${d.name}`)
);

console.log('\n=== employmentRoles (sample) ===');
employmentRoles.employmentRoles.slice(0, 5).forEach(r =>
  console.log(`  ${r.title} (${r.category})`)
);

console.log('\n=== Dataset counts ===');
console.log('Male first names:  ', firstNames.male.length);
console.log('Female first names:', firstNames.female.length);
console.log('Neutral first names:', firstNames.neutral.length);
console.log('Last names:        ', lastNames.lastNames.length);
console.log('Genders:           ', genders.genders.length);
console.log('Blood groups:      ', bloodGroups.bloodGroups.length);
console.log('Insurance plans:   ', insurancePlans.insurancePlans.length);
console.log('Departments:       ', departments.departments.length);
console.log('Employment roles:  ', employmentRoles.employmentRoles.length);
