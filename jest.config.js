"use strict";

module.exports = {
  testEnvironment: "node",
  forceExit: true,
  collectCoverage: false,
  coverageDirectory: "coverage/jest",
  coverageReporters: ["json"],
  roots: ["<rootDir>"],
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testPathIgnorePatterns: ["mocks"],
  globals: {
    "ts-jest": {
      isolatedModules: true, // Disable type-checking from tests (already done in lint stage)
    },
  },
  testMatch: ["**/*.+(spec|test).+(ts|tsx|js)"],
};
