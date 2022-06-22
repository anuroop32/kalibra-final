module.exports = {
  extends: ['eslint:recommended'],
  env: { browser: true, es6: true, node: true },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'airbnb-typescript'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
      },
      settings: {
        react: {
          version: 'detect'
        },
        'import/ignore': ['react-native']
      },
      rules: {
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn'],
        indent: 'off',
        '@typescript-eslint/indent': ['off'],
        'import/no-named-as-default': 0
      }
    }
  ]
};
