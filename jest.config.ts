import type { Config } from 'jest'

/**
 * Jest configuration.
 *
 * - Uses `@swc/jest` for fast TypeScript + JSX transforms (no Babel needed).
 * - Runs against jsdom to simulate the browser for React Testing Library.
 * - Mirrors the path aliases declared in `tsconfig.json` (`#/*` and `@/*`).
 * - Stubs CSS and static asset imports so they don't break unit tests.
 */
const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test|spec).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '^#/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/test/mocks/style-mock.ts',
    '\\.(png|jpe?g|gif|svg|webp|avif|ico)$':
      '<rootDir>/test/mocks/file-mock.ts',
  },

  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2022',
        },
      },
    ],
  },

  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/routeTree.gen.ts',
    '!src/routes/**',
  ],
  coverageDirectory: 'coverage',
}

export default config
