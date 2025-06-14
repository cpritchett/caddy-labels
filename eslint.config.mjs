// ESLint configuration for YAML files
// See: https://ota-meshi.github.io/eslint-plugin-yml/

import yml from 'eslint-plugin-yml';

export default [
  // YAML files configuration
  ...yml.configs['flat/recommended'],
  {
    files: ['**/*.yml', '**/*.yaml'],
    rules: {
      // YAML-specific rules - relaxed for GitHub Actions
      'yml/quotes': ['error', { prefer: 'single', avoidEscape: false }],
      'yml/indent': ['error', 2],
      'yml/block-mapping-question-indicator-newline': 'error',
      'yml/block-sequence-hyphen-indicator-newline': 'error',
      'yml/file-extension': 'off', // Allow both .yml and .yaml
      'yml/key-name-casing': 'off', // GitHub Actions uses snake_case and kebab-case
      'yml/no-empty-key': 'error',
      'yml/no-empty-sequence-entry': 'error',
      'yml/no-irregular-whitespace': 'error',
      'yml/plain-scalar': 'off', // Allow quoted strings in GitHub Actions
      'yml/vue-custom-block/no-parsing-error': 'off',
      'yml/no-empty-mapping-value': 'off' // GitHub Actions often has empty mappings
    }
  }
];
