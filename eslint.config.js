const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: ['.expo/**', 'coverage/**', 'dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          caughtErrors: 'all',
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { args: 'all', caughtErrors: 'all' }],
    },
  },
]);
