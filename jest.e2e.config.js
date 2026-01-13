module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests/e2e'],
    testMatch: [
        '**/*.e2e.test.js',
        '**/*.e2e.spec.js'
    ],
    moduleFileExtensions: ['js', 'json'],
    verbose: true,
    testTimeout: 30000,
    clearMocks: true,
    restoreMocks: true,
    setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js'],
    // E2E tests run sequentially
    maxWorkers: 1
};
