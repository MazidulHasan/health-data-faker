"use strict";

const { execFileSync } = require("node:child_process");

exports.preCommit = () => {
  execFileSync("npm", ["install", "--package-lock-only", "--ignore-scripts"], {
    stdio: "inherit",
  });
};
