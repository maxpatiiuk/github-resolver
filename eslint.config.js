import eslintConfig from '@maxxxxxdlp/eslint-config';
import globals from 'globals';

export default [
  ...eslintConfig,
  {
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // This rule crashes
      'unicorn/expiring-todo-comments': 'off',
      // This rule is only useful in OOP codebases
      '@typescript-eslint/unbound-method': 'off',
    }
  },
];
