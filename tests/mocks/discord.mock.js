/**
 * Mock Discord.js objects for testing
 */

const createMockMessage = (overrides = {}) => ({
    guild: {
        id: 'test-guild-id',
        name: 'Test Guild',
        channels: {
            cache: new Map([
                ['channel-1', { id: 'channel-1', name: 'general', type: 'text', send: jest.fn() }],
                ['channel-2', { id: 'channel-2', name: 'news', type: 'text', send: jest.fn() }]
            ])
        },
        members: {
            cache: new Map()
        }
    },
    channel: {
        id: 'test-channel-id',
        name: 'test-channel',
        send: jest.fn().mockResolvedValue({ id: 'sent-message-id' }),
        type: 'text'
    },
    author: {
        id: 'test-author-id',
        username: 'TestUser',
        bot: false,
        displayAvatarURL: jest.fn().mockReturnValue('https://example.com/avatar.png')
    },
    member: {
        hasPermission: jest.fn().mockReturnValue(true),
        permissions: {
            has: jest.fn().mockReturnValue(true)
        }
    },
    content: '',
    reply: jest.fn().mockResolvedValue({ id: 'reply-message-id' }),
    react: jest.fn().mockResolvedValue({}),
    mentions: {
        channels: {
            first: jest.fn()
        },
        users: {
            first: jest.fn()
        }
    },
    ...overrides
});

const createMockClient = (overrides = {}) => ({
    user: {
        id: 'bot-id',
        username: 'TestBot',
        setActivity: jest.fn()
    },
    guilds: {
        cache: new Map()
    },
    channels: {
        cache: new Map()
    },
    on: jest.fn(),
    once: jest.fn(),
    login: jest.fn().mockResolvedValue('token'),
    ...overrides
});

const createMockEmbed = () => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setColor: jest.fn().mockReturnThis(),
    addField: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
    setFooter: jest.fn().mockReturnThis(),
    setThumbnail: jest.fn().mockReturnThis(),
    setImage: jest.fn().mockReturnThis(),
    setTimestamp: jest.fn().mockReturnThis(),
    setAuthor: jest.fn().mockReturnThis(),
    setURL: jest.fn().mockReturnThis()
});

module.exports = {
    createMockMessage,
    createMockClient,
    createMockEmbed
};
