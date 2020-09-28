module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  // https://github.com/airbnb/javascript
  extends: 'airbnb-base',
  // add your custom rules here
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'warn',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'no-useless-computed-key': 'off',
    'no-async-promise-executor': 'off',
    'max-len': ['error', { 'code': 200 }],
    'no-await-in-loop': 'off',
  },
  globals: {
  },
};

