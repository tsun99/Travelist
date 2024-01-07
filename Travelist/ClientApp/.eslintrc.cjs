module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ['react-refresh', 'react', 'react-hooks', 'import'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
    'plugin:tailwindcss/recommended',
  ],
  settings: {
    react: {
      reactVersion: 'detect',
    },
    'import/resolver': {
      node: true,
      typescript: true,
    },
  },
  ignorePatterns: ['dist', 'jest.config.ts', 'vite.config.ts', 'config.ts', 'env.d.ts', 'test/__mocks__/fileMock.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/boolean-prop-naming': ['error', {
      'propTypeNames': ['bool', 'mutuallyExclusiveTrueProps'],
      'rule': '^(is|has|are|have)[A-Z]([A-Za-z0-9]?)+'
    }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/no-array-index-key': 'off',
    'no-console': 'warn',
    'no-use-before-define': ['error', { 'functions': false, 'classes': false }],
    'tailwindcss/no-custom-classname': 'off',
    'object-curly-spacing': ['error', 'always'],
    'rest-spread-spacing': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    'no-whitespace-before-property': 'error',
    'no-confusing-arrow': ['error', { allowParens: true }],
    'prefer-const': 'error',
    'no-var': 'error',
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    'prefer-arrow-callback': 'error',
    indent: ['error', 2],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      },
    ],
    semi: ['error', 'always'],
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state'] },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'external',
          'builtin',
          'internal',
          'sibling',
          'parent',
          'index',
        ],
        pathGroups: [
          {
            pattern: 'components',
            group: 'internal',
          },
          {
            pattern: 'common',
            group: 'internal',
          },
          {
            pattern: 'routes/**',
            group: 'internal',
          },
          {
            pattern: 'assets/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
      plugins: ['@typescript-eslint'],
      rules: {
        'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // Allow JSX in .tsx files
      },
    },
    {
      files: [
        // Next pages files
        'src/pages/**/*.tsx',
        // Typescript declaration file
        'vite-env.d.ts',
      ],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/*.test.tsx', '**/*.test.ts'],
      extends: ['plugin:testing-library/react', 'plugin:jest-dom/recommended'],
      env: {
        jest: true,
      },
      rules: {
        'testing-library/prefer-explicit-assert': 'error',
        'testing-library/prefer-presence-queries': 'error',
        'testing-library/prefer-screen-queries': 'error',
      },
    },
  ],
};
