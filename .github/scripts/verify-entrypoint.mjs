import {
  generateEmployee,
  generateMember,
  generatePatient,
  validateEmployee,
  validateMember,
  validatePatient,
} from "../../src/index.js";

const results = [
  validatePatient(generatePatient()),
  validateMember(generateMember()),
  validateEmployee(generateEmployee()),
];

const allValid = results.every((result) => result.valid);

if (!allValid) {
  results.forEach((result) => {
    result.errors.forEach((error) => console.error(error));
  });
  process.exit(1);
}

console.log("Entry point OK - all generators and validators operational");
