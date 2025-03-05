export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  rootDir: './',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>', '<rootDir>/src'],
  moduleNameMapper: {
    '^src$': '<rootDir>/src',
    '^src/(.+)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '@src/': '<rootDir>/$1',
    '@src/(.*)': '<rootDir>/src/$1',
    'src/': '<rootDir>/src/$1',
    'src/(.*)': '<rootDir>/src/$1',
    'test/(.*)': '<rootDir>/test/$1',
  },
  moduleDirectories: ['<rootDir>/../', '<rootDir>', 'node_modules', 'src'],
  modulePathIgnorePatterns: ['src/typings'],
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(coverage|dist|lib|tmp)./',
  ],
};
