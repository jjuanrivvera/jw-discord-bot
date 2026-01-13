/**
 * Unit tests for setlang.command.js
 */

// Mock Discord.js with v14 API
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn().mockImplementation(() => ({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        addField: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis()
    })),
    PermissionFlagsBits: {
        Administrator: BigInt(8) // Discord.js v14 uses BigInt for permissions
    }
}));

// Mock helpers
jest.mock('../../../src/helpers', () => ({
    GuildHelper: {
        getGuildLanguage: jest.fn(),
        setGuildLanguage: jest.fn()
    }
}));

const setlangCommand = require('../../../src/commands/config/setlang.command');
const { GuildHelper } = require('../../../src/helpers');
const { createMockMessage } = require('../../mocks/discord.mock');

describe('SetLang Command', () => {
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
        // v14: Use permissions.has() instead of hasPermission()
        mockMessage.member.permissions.has = jest.fn().mockReturnValue(true);

        GuildHelper.getGuildLanguage.mockResolvedValue('es');
        GuildHelper.setGuildLanguage.mockResolvedValue({ language: 'en' });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('config', () => {
        it('should have correct name', () => {
            expect(setlangCommand.config.name).toBe('Set Language');
        });

        it('should have correct command trigger', () => {
            expect(setlangCommand.config.command).toBe('setlang');
        });
    });

    describe('permissions', () => {
        it('should deny non-admin users', async () => {
            mockMessage.member.permissions.has.mockReturnValue(false);

            await setlangCommand.run(mockMessage, []);

            expect(mockMessage.channel.send).toHaveBeenCalled();
            // v14: delete is called via setTimeout
            jest.runAllTimers();
            expect(sentMessage.delete).toHaveBeenCalled();
        });

        it('should allow admin users', async () => {
            mockMessage.member.permissions.has.mockReturnValue(true);

            await setlangCommand.run(mockMessage, ['en']);

            expect(GuildHelper.setGuildLanguage).toHaveBeenCalled();
        });

        it('should check for Administrator permission using permissions.has()', async () => {
            await setlangCommand.run(mockMessage, []);

            expect(mockMessage.member.permissions.has).toHaveBeenCalled();
        });
    });

    describe('show current config', () => {
        it('should display current language when no args', async () => {
            await setlangCommand.run(mockMessage, []);

            expect(mockMessage.channel.send).toHaveBeenCalled();
            expect(GuildHelper.getGuildLanguage).toHaveBeenCalledWith(mockMessage.guild.id);
        });
    });

    describe('set language', () => {
        it('should set language to English', async () => {
            await setlangCommand.run(mockMessage, ['en']);

            expect(GuildHelper.setGuildLanguage).toHaveBeenCalledWith(
                mockMessage.guild.id,
                mockMessage.guild.name,
                'en'
            );
        });

        it('should set language to Spanish', async () => {
            await setlangCommand.run(mockMessage, ['es']);

            expect(GuildHelper.setGuildLanguage).toHaveBeenCalledWith(
                mockMessage.guild.id,
                mockMessage.guild.name,
                'es'
            );
        });

        it('should set language to Portuguese', async () => {
            await setlangCommand.run(mockMessage, ['pt']);

            expect(GuildHelper.setGuildLanguage).toHaveBeenCalledWith(
                mockMessage.guild.id,
                mockMessage.guild.name,
                'pt'
            );
        });

        it('should convert language code to lowercase', async () => {
            await setlangCommand.run(mockMessage, ['EN']);

            expect(GuildHelper.setGuildLanguage).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                'en'
            );
        });

        it('should send success message after setting language', async () => {
            await setlangCommand.run(mockMessage, ['en']);

            const sentContent = mockMessage.channel.send.mock.calls[0][0];
            expect(typeof sentContent).toBe('string');
            expect(sentContent).toContain('English');
        });
    });

    describe('invalid language', () => {
        it('should reject invalid language code', async () => {
            await setlangCommand.run(mockMessage, ['invalid']);

            expect(GuildHelper.setGuildLanguage).not.toHaveBeenCalled();
            expect(mockMessage.channel.send).toHaveBeenCalled();
        });

        it('should show available languages on invalid code', async () => {
            await setlangCommand.run(mockMessage, ['fr']);

            const sentContent = mockMessage.channel.send.mock.calls[0][0];
            expect(sentContent).toContain('es');
            expect(sentContent).toContain('en');
            expect(sentContent).toContain('pt');
        });

        it('should delete error message after timeout', async () => {
            await setlangCommand.run(mockMessage, ['invalid']);

            // v14: delete is called via setTimeout
            jest.runAllTimers();
            expect(sentMessage.delete).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        it('should handle database error gracefully', async () => {
            GuildHelper.setGuildLanguage.mockRejectedValue(new Error('Database error'));

            await setlangCommand.run(mockMessage, ['en']);

            expect(mockMessage.channel.send).toHaveBeenCalled();
            // v14: delete is called via setTimeout
            jest.runAllTimers();
            expect(sentMessage.delete).toHaveBeenCalled();
        });
    });
});
