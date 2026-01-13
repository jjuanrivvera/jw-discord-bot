/**
 * Jest Test Setup
 * This file runs before each test file
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DISCORD_TOKEN = 'test-token';
process.env.DISCORD_BOT_ID = 'test-bot-id';
process.env.MONGO_DSN = 'mongodb://localhost:27017/jw-discord-bot-test';
process.env.PREFIX = 'jw!';
process.env.DEFAULT_LANG = 'es';
process.env.SCHEDULER_TIMEZONE = 'America/Bogota';

// Global test utilities
global.testUtils = {
    /**
     * Create a mock Discord message
     * @param {Object} overrides - Properties to override
     * @returns {Object} Mock message object
     */
    createMockMessage: (overrides = {}) => ({
        guild: {
            id: 'test-guild-id',
            name: 'Test Guild',
            channels: {
                cache: new Map()
            }
        },
        channel: {
            id: 'test-channel-id',
            name: 'test-channel',
            send: jest.fn().mockResolvedValue({ id: 'sent-message-id' })
        },
        author: {
            id: 'test-author-id',
            username: 'TestUser',
            bot: false
        },
        content: '',
        reply: jest.fn().mockResolvedValue({ id: 'reply-message-id' }),
        react: jest.fn().mockResolvedValue({}),
        ...overrides
    }),

    /**
     * Create a mock Discord guild
     * @param {Object} overrides - Properties to override
     * @returns {Object} Mock guild object
     */
    createMockGuild: (overrides = {}) => ({
        id: 'test-guild-id',
        name: 'Test Guild',
        channels: {
            cache: new Map([
                ['channel-1', { id: 'channel-1', name: 'general', type: 'text' }],
                ['channel-2', { id: 'channel-2', name: 'news', type: 'text' }]
            ])
        },
        members: {
            cache: new Map()
        },
        ...overrides
    }),

    /**
     * Wait for a specified time (useful for async tests)
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise}
     */
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

// Suppress console output during tests unless DEBUG is set
if (!process.env.DEBUG) {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    };
}
