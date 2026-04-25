import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/*.unit.test.ts'],
      moduleNameMapper: {
        '^../../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
        '^../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/*.integration.test.ts'],
      moduleNameMapper: {
        '^../../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
        '^../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
      },
    },
    {
      displayName: 'acceptance',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/**/*.acceptance.test.ts'],
      moduleNameMapper: {
        '^../../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
        '^../config/prisma$': '<rootDir>/src/__mocks__/prisma.ts',
        '^@clerk/express$': '<rootDir>/src/__mocks__/clerk.ts',
      },
    },
  ],
};

export default config;
