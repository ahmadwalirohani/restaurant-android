module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
  },

  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'plugin:vue/vue3-recommended',

    // Base ESLint recommended rules
    //'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    //'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    //'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    //'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',

  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // indentation (Already present in TypeScript)
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { afterColon: true }],

    'vue/first-attribute-linebreak': ['error', {
      singleline: 'beside',
      multiline: 'below',
    }],
    // indentation (Already present in TypeScript)
    'indent': ['error', 2],

    // Enforce trailing comma (Already present in TypeScript)

    // Enforce consistent spacing inside braces of object (Already present in TypeScript)
    'object-curly-spacing': ['error', 'always'],

    // Disable max-len
    'max-len': 'off',

    // we don't want it

    // add parens ony when required in arrow function
    'arrow-parens': ['error', 'as-needed'],

    // add new line above comment
    'newline-before-return': 'error',
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],

    'vue/multi-word-component-names': 'error',

    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'expression', next: 'const' },
      { blankLine: 'always', prev: 'const', next: 'expression' },
      { blankLine: 'always', prev: 'multiline-const', next: '*' },
      { blankLine: 'always', prev: '*', next: 'multiline-const' },
    ],
  },
  // // add your custom rules here
  // rules: {

  //   // allow async-await
  //   'generator-star-spacing': 'off',
  //   // allow paren-less arrow functions
  //   'arrow-parens': 'off',
  //   'one-var': 'off',
  //   'no-void': 'off',
  //   'multiline-ternary': 'off',

  //   'import/first': 'off',
  //   'import/named': 'error',
  //   'import/namespace': 'error',
  //   'import/default': 'error',
  //   'import/export': 'error',
  //   'import/extensions': 'off',
  //   'import/no-unresolved': 'off',
  //   'import/no-extraneous-dependencies': 'off',

  //   'prefer-promise-reject-errors': 'off',

  //   // allow debugger during development only
  //   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

  //   'array-element-newline': ['error', 'consistent'],
  //   'array-bracket-newline': ['error', 'consistent'],

  //   'vue/multi-word-component-names': 'off',

  //   'padding-line-between-statements': [
  //     'error',
  //     { blankLine: 'always', prev: 'expression', next: 'const' },
  //     { blankLine: 'always', prev: 'const', next: 'expression' },
  //     { blankLine: 'always', prev: 'multiline-const', next: '*' },
  //     { blankLine: 'always', prev: '*', next: 'multiline-const' }
  //   ],
  //   // Disable max-len
  //   'max-len': 'off',

  //   // we don't want it
  //   semi: ['error', 'never'],

  //   // add parens ony when required in arrow function

  //   // add new line above comment
  //   'newline-before-return': 'error',
  //   'vue/first-attribute-linebreak': ['error', {
  //     singleline: 'beside',
  //     multiline: 'below'
  //   }]
  // }
}
