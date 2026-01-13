module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: [
        '**/*.test.js',
        '**/*.spec.js'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/index.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    moduleFileExtensions: ['js', 'json'],
    verbose: true,
    testTimeout: 10000,
    clearMocks: true,
    restoreMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
