/**
 * הגדרות Jest לבדיקות
 * כולל הגדרות מיוחדות לבדיקות E2E ובדיקות יחידה
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // הגדרת כיסוי קוד
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
  ],
  // סף מינימלי לכיסוי קוד
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // הגדרות נתיבים
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}; 