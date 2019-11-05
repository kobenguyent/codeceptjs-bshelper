module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-underscore-dangle": [2, { "allow": ["_updateBuild", "_exposeBuildLink", "_shortenUrl", "_passed", "_failed", "_getSessionId"] }],
    'class-methods-use-this': ["error", { "exceptMethods": ["_shortenUrl"] }],
    'no-console': [0]
  },
};
