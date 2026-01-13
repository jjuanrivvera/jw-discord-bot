/**
 * E2E Test Setup
 * This file runs before E2E tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DISCORD_TOKEN = process.env.TEST_DISCORD_TOKEN || 'test-token';
process.env.DISCORD_BOT_ID = process.env.TEST_DISCORD_BOT_ID || 'test-bot-id';
process.env.MONGO_DSN = process.env.TEST_MONGO_DSN || 'mongodb://localhost:27017/jw-discord-bot-e2e-test';
process.env.PREFIX = 'jw!';
process.env.DEFAULT_LANG = 'es';
process.env.SCHEDULER_TIMEZONE = 'America/Bogota';

// E2E tests may need longer timeouts
jest.setTimeout(30000);

// Global E2E test utilities
global.e2eUtils = {
    /**
     * Wait for database connection
     * @param {Object} mongoose - Mongoose instance
     * @param {number} timeout - Max wait time in ms
     * @returns {Promise}
     */
    waitForDatabase: async (mongoose, timeout = 10000) => {
        const start = Date.now();
        while (mongoose.connection.readyState !== 1) {
            if (Date.now() - start > timeout) {
                throw new Error('Database connection timeout');
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    },

    /**
     * Clean up test database collections
     * @param {Object} mongoose - Mongoose instance
     */
    cleanupDatabase: async (mongoose) => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
};
