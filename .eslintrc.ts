module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'react-hooks', '@typescript-eslint'],
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      'babel-module': {}, // alias 사용 시 필요
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'warn',
  },
};
