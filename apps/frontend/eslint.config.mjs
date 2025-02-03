import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/.eslintrc.js', 'eslint.config.mjs'],
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      // next/typescript already has @typescript-eslint/eslint-plugin bundled, but it probably has
      // a different version than the one we're using, so we're including it manually in the plugins
      // 'next/typescript'
    ],
  }),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.base.json',
        tsconfigRootDir: __dirname,
      },
    },

    // settings: {
    //   react: {
    //     version: 'detect',
    //   },
    // },

    rules: {
      'no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/hook-use-state': 'error',
      'react/jsx-boolean-value': 'error',
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-access-state-in-setstate': 'error',
      'react/no-array-index-key': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-object-type-as-default-prop': 'error',
      'react/no-this-in-sfc': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/prefer-stateless-function': 'error',
      'react/self-closing-comp': 'error',
      'react/style-prop-object': 'error',
      'react/prop-types': 'off',
      'react/void-dom-elements-no-children': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
