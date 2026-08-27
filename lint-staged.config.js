const prettierCommand =
  'prettier --config prettier.config.js --no-editorconfig --log-level warn --write';

/** @type {import('lint-staged').Configuration} */
export default {
  '*.ts': [
    'eslint --config eslint.config.js --fix',
    prettierCommand,
    'vitest related --run --passWithNoTests',
  ],
  '*.{md,json}': ['eslint --config eslint.config.js --fix', prettierCommand],
  '*.{css,scss,js,jsx,mjs,cjs,mdx,yml,yaml,html,vue}': prettierCommand,
};
