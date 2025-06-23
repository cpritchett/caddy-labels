// Commitlint configuration
// See: https://commitlint.js.org/#/reference-configuration

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the allowed types
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // Subject case should be lowercase
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    // Subject should not end with period
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    // Header max length
    'header-max-length': [2, 'always', 72],
    // Body max line length
    'body-max-line-length': [2, 'always', 100],
    // Footer max line length
    'footer-max-line-length': [2, 'always', 100],
  },
};
