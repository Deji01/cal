export default {
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'], // no '.js'
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [],
  collectCoverageFrom: ['**/*.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
