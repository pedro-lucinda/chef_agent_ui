// @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'
import cypress from 'eslint-plugin-cypress'
import globals from 'globals'

export default [
  ...tanstackConfig,

  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',

      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },

  {
    files: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'test/**/*.{ts,tsx}',
      'jest.config.ts',
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest, ...globals.node },
    },
  },

  {
    ...cypress.configs.recommended,
    files: ['cypress/**/*.{ts,tsx}', 'cypress.config.ts'],
  },

  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      'coverage',
      'cypress/downloads',
      'cypress/screenshots',
      'cypress/videos',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },
]
