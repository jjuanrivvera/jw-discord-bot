/**
 * Mock models for testing
 */

const mockGuild = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
};

const mockSchedule = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
    find: jest.fn()
};

const mockText = {
    findOne: jest.fn(),
    find: jest.fn()
};

const mockNew = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    find: jest.fn()
};

const mockTopic = {
    findOne: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn()
};

module.exports = {
    Guild: mockGuild,
    Schedule: mockSchedule,
    Text: mockText,
    New: mockNew,
    Topic: mockTopic,
    resetAllMocks: () => {
        Object.values(mockGuild).forEach(fn => fn.mockReset());
        Object.values(mockSchedule).forEach(fn => fn.mockReset());
        Object.values(mockText).forEach(fn => fn.mockReset());
        Object.values(mockNew).forEach(fn => fn.mockReset());
        Object.values(mockTopic).forEach(fn => fn.mockReset());
    }
};
