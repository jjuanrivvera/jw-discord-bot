module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
        'no-console': 'off',
        'eqeqeq': ['error', 'always'],
        'curly': ['error', 'all'],
        'brace-style': ['error', '1tbs'],
        'comma-dangle': ['error', 'never'],
        'no-trailing-spaces': 'error',
        'eol-last': ['error', 'always'],
        'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1 }],
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'keyword-spacing': ['error', { 'before': true, 'after': true }],
        'space-infix-ops': 'error',
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'no-var': 'error',
        'prefer-const': 'warn'
    }
};
