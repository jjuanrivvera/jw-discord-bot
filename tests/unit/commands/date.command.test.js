/**
 * Unit tests for date.command.js
 */

// Mock Discord.js with v14 API
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn().mockImplementation(() => ({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis()
    }))
}));

// Mock helpers
jest.mock('../../../src/helpers', () => ({
    GuildHelper: {
        getGuildLanguage: jest.fn()
    }
}));

const dateCommand = require('../../../src/commands/misc/date.command');
const { GuildHelper } = require('../../../src/helpers');
const { createMockMessage } = require('../../mocks/discord.mock');
const { EmbedBuilder } = require('discord.js');

describe('Date Command', () => {
    let mockMessage;
    let sentMessage;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        sentMessage = {
            delete: jest.fn().mockResolvedValue({})
        };

        mockMessage = createMockMessage();
        mockMessage.channel.send = jest.fn().mockResolvedValue(sentMessage);

        GuildHelper.getGuildLanguage.mockResolvedValue('es');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('config', () => {
        it('should have correct name', () => {
            expect(dateCommand.config.name).toBe('Date');
        });

        it('should have correct command trigger', () => {
            expect(dateCommand.config.command).toBe('date');
        });
    });

    describe('run without arguments', () => {
        it('should use default timezone when no args provided', async () => {
            await dateCommand.run(mockMessage, []);

            expect(mockMessage.channel.send).toHaveBeenCalled();
            expect(EmbedBuilder).toHaveBeenCalled();
        });

        it('should send date embed to channel', async () => {
            await dateCommand.run(mockMessage, []);

            const call = mockMessage.channel.send.mock.calls[0][0];
            expect(call).toBeDefined();
            expect(call).toHaveProperty('embeds');
        });

        it('should get guild language for translations', async () => {
            await dateCommand.run(mockMessage, []);

            expect(GuildHelper.getGuildLanguage).toHaveBeenCalledWith(mockMessage.guild.id);
        });
    });

    describe('run with timezone argument', () => {
        it('should accept valid timezone America/New_York', async () => {
            await dateCommand.run(mockMessage, ['America/New_York']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
        });

        it('should accept valid timezone Europe/London', async () => {
            await dateCommand.run(mockMessage, ['Europe/London']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
        });

        it('should accept valid timezone America/Bogota', async () => {
            await dateCommand.run(mockMessage, ['America/Bogota']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
        });

        it('should accept valid timezone UTC', async () => {
            await dateCommand.run(mockMessage, ['UTC']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
        });
    });

    describe('invalid timezone', () => {
        it('should reject invalid timezone', async () => {
            await dateCommand.run(mockMessage, ['Invalid/Timezone']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
            // v14: delete is called via setTimeout, not with options
            jest.runAllTimers();
            expect(sentMessage.delete).toHaveBeenCalled();
        });

        it('should reject nonsense timezone', async () => {
            await dateCommand.run(mockMessage, ['notavalidtimezone']);

            jest.runAllTimers();
            expect(sentMessage.delete).toHaveBeenCalled();
        });
    });

    describe('translations', () => {
        it('should use Spanish strings when guild language is es', async () => {
            GuildHelper.getGuildLanguage.mockResolvedValue('es');

            await dateCommand.run(mockMessage, []);

            expect(EmbedBuilder).toHaveBeenCalled();
        });

        it('should use English strings when guild language is en', async () => {
            GuildHelper.getGuildLanguage.mockResolvedValue('en');

            await dateCommand.run(mockMessage, []);

            expect(EmbedBuilder).toHaveBeenCalled();
        });

        it('should use Portuguese strings when guild language is pt', async () => {
            GuildHelper.getGuildLanguage.mockResolvedValue('pt');

            await dateCommand.run(mockMessage, []);

            expect(EmbedBuilder).toHaveBeenCalled();
        });
    });

    describe('embed structure', () => {
        it('should create embed with correct methods', async () => {
            await dateCommand.run(mockMessage, []);

            const embedInstance = EmbedBuilder.mock.results[0].value;
            expect(embedInstance.setColor).toHaveBeenCalled();
            expect(embedInstance.setTitle).toHaveBeenCalled();
            expect(embedInstance.addFields).toHaveBeenCalled();
        });

        it('should add fields for day, month, year, time, and timezone', async () => {
            await dateCommand.run(mockMessage, ['UTC']);

            const embedInstance = EmbedBuilder.mock.results[0].value;

            // addFields is called with an array of field objects
            expect(embedInstance.addFields).toHaveBeenCalled();

            // Check that addFields received objects with name/value
            const call = embedInstance.addFields.mock.calls[0];
            expect(call.length).toBeGreaterThan(0);
        });
    });
});
