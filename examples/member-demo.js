/**
 * Example usage of generateMember().
 * Run: node examples/member-demo.js
 */

import { generateMember } from '../src/generators/member.js';

console.log('=== Default member ===');
console.log(JSON.stringify(generateMember(), null, 2));

console.log('\n=== status: "Active" ===');
console.log(JSON.stringify(generateMember({ status: 'Active' }), null, 2));

console.log('\n=== status: "Terminated" ===');
console.log(JSON.stringify(generateMember({ status: 'Terminated' }), null, 2));

console.log('\n=== Custom plan override ===');
console.log(JSON.stringify(generateMember({
  plan: { name: 'Corp Gold', type: 'PPO', tier: 'Gold', provider: 'Aetna' },
  status: 'Active',
  effectiveDate: '2024-01-01',
}), null, 2));

console.log('\n=== Batch of 5 members (summary) ===');
for (let i = 0; i < 5; i++) {
  const m = generateMember();
  console.log(
    `  ${m.memberId} | ${m.plan.name} (${m.plan.type}) | ` +
    `${m.status} | Eligible: ${m.eligibility.isEligible}`
  );
}
