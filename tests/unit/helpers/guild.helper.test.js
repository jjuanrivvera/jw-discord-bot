/**
 * Unit tests for guild.helper.js
 */

const { DEFAULT_LANG } = require('../../../src/config/languages');

// Mock the models before requiring the helper
jest.mock('../../../src/models', () => require('../../mocks/models.mock'));

const {
    getGuildLanguage,
    getGuildConfig,
    setGuildLanguage,
    getGuildString
} = require('../../../src/helpers/guild.helper');

const { Guild, resetAllMocks } = require('../../mocks/models.mock');

describe('Guild Helper', () => {
    beforeEach(() => {
        resetAllMocks();
        jest.clearAllMocks();
    });

    describe('getGuildLanguage', () => {
        it('should return DEFAULT_LANG when guildId is null', async () => {
            const result = await getGuildLanguage(null);
            expect(result).toBe(DEFAULT_LANG);
            expect(Guild.findOne).not.toHaveBeenCalled();
        });

        it('should return DEFAULT_LANG when guildId is undefined', async () => {
            const result = await getGuildLanguage(undefined);
            expect(result).toBe(DEFAULT_LANG);
            expect(Guild.findOne).not.toHaveBeenCalled();
        });

        it('should return DEFAULT_LANG when guildId is empty string', async () => {
            const result = await getGuildLanguage('');
            expect(result).toBe(DEFAULT_LANG);
            expect(Guild.findOne).not.toHaveBeenCalled();
        });

        it('should return guild language when found', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: 'en' });

            const result = await getGuildLanguage('guild-123');

            expect(result).toBe('en');
            expect(Guild.findOne).toHaveBeenCalledWith({ id: 'guild-123' });
        });

        it('should return DEFAULT_LANG when guild not found', async () => {
            Guild.findOne.mockResolvedValue(null);

            const result = await getGuildLanguage('guild-123');

            expect(result).toBe(DEFAULT_LANG);
        });

        it('should return DEFAULT_LANG when guild has no language set', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: null });

            const result = await getGuildLanguage('guild-123');

            expect(result).toBe(DEFAULT_LANG);
        });

        it('should return DEFAULT_LANG on database error', async () => {
            Guild.findOne.mockRejectedValue(new Error('Database error'));

            const result = await getGuildLanguage('guild-123');

            expect(result).toBe(DEFAULT_LANG);
        });
    });

    describe('getGuildConfig', () => {
        it('should return null when guildId is null', async () => {
            const result = await getGuildConfig(null);
            expect(result).toBeNull();
            expect(Guild.findOne).not.toHaveBeenCalled();
        });

        it('should return null when guildId is undefined', async () => {
            const result = await getGuildConfig(undefined);
            expect(result).toBeNull();
        });

        it('should return null when guildId is empty string', async () => {
            const result = await getGuildConfig('');
            expect(result).toBeNull();
        });

        it('should return guild config when found', async () => {
            const mockConfig = {
                id: 'guild-123',
                name: 'Test Guild',
                language: 'en',
                newsNotificationChannelId: 'channel-456'
            };
            Guild.findOne.mockResolvedValue(mockConfig);

            const result = await getGuildConfig('guild-123');

            expect(result).toEqual(mockConfig);
            expect(Guild.findOne).toHaveBeenCalledWith({ id: 'guild-123' });
        });

        it('should return null when guild not found', async () => {
            Guild.findOne.mockResolvedValue(null);

            const result = await getGuildConfig('guild-123');

            expect(result).toBeNull();
        });

        it('should return null on database error', async () => {
            Guild.findOne.mockRejectedValue(new Error('Database error'));

            const result = await getGuildConfig('guild-123');

            expect(result).toBeNull();
        });
    });

    describe('setGuildLanguage', () => {
        it('should update guild language successfully', async () => {
            const mockUpdatedGuild = {
                id: 'guild-123',
                name: 'Test Guild',
                language: 'en'
            };
            Guild.findOneAndUpdate.mockResolvedValue(mockUpdatedGuild);

            const result = await setGuildLanguage('guild-123', 'Test Guild', 'en');

            expect(result).toEqual(mockUpdatedGuild);
            expect(Guild.findOneAndUpdate).toHaveBeenCalledWith(
                { id: 'guild-123' },
                {
                    id: 'guild-123',
                    name: 'Test Guild',
                    language: 'en'
                },
                { upsert: true, new: true }
            );
        });

        it('should accept valid language code "es"', async () => {
            Guild.findOneAndUpdate.mockResolvedValue({ language: 'es' });

            await expect(setGuildLanguage('guild-123', 'Test', 'es')).resolves.toBeDefined();
        });

        it('should accept valid language code "en"', async () => {
            Guild.findOneAndUpdate.mockResolvedValue({ language: 'en' });

            await expect(setGuildLanguage('guild-123', 'Test', 'en')).resolves.toBeDefined();
        });

        it('should accept valid language code "pt"', async () => {
            Guild.findOneAndUpdate.mockResolvedValue({ language: 'pt' });

            await expect(setGuildLanguage('guild-123', 'Test', 'pt')).resolves.toBeDefined();
        });

        it('should throw error for invalid language code', async () => {
            await expect(setGuildLanguage('guild-123', 'Test', 'invalid'))
                .rejects
                .toThrow('Invalid language code');
        });

        it('should throw error for null language code', async () => {
            await expect(setGuildLanguage('guild-123', 'Test', null))
                .rejects
                .toThrow('Invalid language code');
        });

        it('should throw error for empty language code', async () => {
            await expect(setGuildLanguage('guild-123', 'Test', ''))
                .rejects
                .toThrow('Invalid language code');
        });

        it('should create guild if it does not exist (upsert)', async () => {
            const mockNewGuild = {
                id: 'new-guild',
                name: 'New Guild',
                language: 'pt'
            };
            Guild.findOneAndUpdate.mockResolvedValue(mockNewGuild);

            const result = await setGuildLanguage('new-guild', 'New Guild', 'pt');

            expect(result).toEqual(mockNewGuild);
            expect(Guild.findOneAndUpdate).toHaveBeenCalledWith(
                { id: 'new-guild' },
                expect.any(Object),
                { upsert: true, new: true }
            );
        });
    });

    describe('getGuildString', () => {
        it('should return translated string for guild language', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: 'en' });

            const result = await getGuildString('dailyText', 'guild-123');

            expect(result).toBe('Daily Text');
        });

        it('should return Spanish string when guild has Spanish language', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: 'es' });

            const result = await getGuildString('dailyText', 'guild-123');

            expect(result).toBe('Texto Diario');
        });

        it('should return Portuguese string when guild has Portuguese language', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: 'pt' });

            const result = await getGuildString('dailyText', 'guild-123');

            expect(result).toBe('Texto Diário');
        });

        it('should return default language string when guild not found', async () => {
            Guild.findOne.mockResolvedValue(null);

            const result = await getGuildString('dailyText', 'guild-123');

            // Should return the string in DEFAULT_LANG
            expect(typeof result).toBe('string');
        });

        it('should return key itself for missing string key', async () => {
            Guild.findOne.mockResolvedValue({ id: 'guild-123', language: 'en' });

            const result = await getGuildString('nonExistentKey', 'guild-123');

            expect(result).toBe('nonExistentKey');
        });
    });
});
