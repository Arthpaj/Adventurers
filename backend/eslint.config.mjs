import babelParser from '@babel/eslint-parser';
import eslintNestJs from '@darraghor/eslint-plugin-nestjs-typed';
import eslint from '@eslint/js';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';
// ... and all your other imports
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-misused-spread': 'off',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: babelParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintNestJs.configs.flatRecommended, // This is the recommended ruleset for this plugin
);
