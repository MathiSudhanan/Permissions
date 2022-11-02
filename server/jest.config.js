/** @type {import('ts-jest').JestConfigWithTsJest} */
const jest = require("jest");
// import { jest } from "jest";
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testSequencer: "./lib/custom-sequencer.js",
};
jest.testTimeout = 30000;
