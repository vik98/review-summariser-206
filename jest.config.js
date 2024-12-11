/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  //setupFilesAfterEnv: ["<rootDir>/src/utils/setupAfterTests.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
