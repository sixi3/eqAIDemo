module.exports = {
  root: true,
  env: { 
    node: true, 
    es2020: true 
  },
  extends: [
    'eslint:recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'test/', 'coverage/', '**/*.ts', '**/*.tsx'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off', // Allow console statements in CLI tools
    'no-unused-vars': 'warn'
  },
} 