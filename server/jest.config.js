/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [".d.ts", ".js"],
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    '**/*.test.ts'
  ],
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
};