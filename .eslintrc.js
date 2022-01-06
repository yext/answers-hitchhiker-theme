module.exports = {
  env: {
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 12
  },
  ignorePatterns: ['tests/**/fixtures/**/*.js'],
  rules: {
    'arrow-spacing': 'error',
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', {
      named: 'never',
      anonymous: 'never'
    }],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', {
      code: 100
    }],
    'newline-before-return': 'warn',
    semi: 'warn',
    indent: ['warn', 2, { SwitchCase: 1 }]
  }
};