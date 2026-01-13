/**
 * Unit tests for jw.helper.js
 */

// Mock Discord.js MessageEmbed
jest.mock('discord.js', () => ({
    MessageEmbed: jest.fn().mockImplementation(() => ({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        addField: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis()
    }))
}));

// Mock sentry
jest.mock('../../../sentry', () => ({
    captureException: jest.fn()
}));

// Mock the models
jest.mock('../../../src/models', () => require('../../mocks/models.mock'));

const JwHelper = require('../../../src/helpers/jw.helper');
const { Text, Topic, resetAllMocks } = require('../../mocks/models.mock');
const { MessageEmbed } = require('discord.js');

describe('JW Helper', () => {
    beforeEach(() => {
        resetAllMocks();
        jest.clearAllMocks();
    });

    describe('getDailyText', () => {
        it('should return undefined when text not found', async () => {
            Text.findOne.mockResolvedValue(null);

            const result = await JwHelper.getDailyText('2024-01-01', 'es');

            expect(result).toBeUndefined();
            expect(Text.findOne).toHaveBeenCalledWith({ date: '2024-01-01' });
        });

        it('should return embeds when text is found', async () => {
            Text.findOne.mockResolvedValue({
                date: '2024-01-01',
                text: 'Proverbios 3:5',
                textContent: 'Confía en Jehová con todo tu corazón',
                explanation: 'Esta es una explicación corta.'
            });

            const result = await JwHelper.getDailyText('2024-01-01', 'es');

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(MessageEmbed).toHaveBeenCalled();
        });

        it('should use default language when not specified', async () => {
            Text.findOne.mockResolvedValue({
                date: '2024-01-01',
                text: 'Prov 3:5',
                textContent: 'Trust in Jehovah',
                explanation: 'Short explanation.'
            });

            const result = await JwHelper.getDailyText('2024-01-01');

            expect(result).toBeDefined();
        });

        it('should split long explanations into multiple embeds', async () => {
            // Create a very long explanation (over 1024 characters)
            const longExplanation = 'A'.repeat(2500);

            Text.findOne.mockResolvedValue({
                date: '2024-01-01',
                text: 'Prov 3:5',
                textContent: 'Trust in Jehovah',
                explanation: longExplanation
            });

            const result = await JwHelper.getDailyText('2024-01-01', 'en');

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(1);
        });

        it('should query database with correct date format', async () => {
            Text.findOne.mockResolvedValue(null);

            await JwHelper.getDailyText('2024-12-25', 'en');

            expect(Text.findOne).toHaveBeenCalledWith({ date: '2024-12-25' });
        });
    });

    describe('getRandomTopic', () => {
        it('should return a random topic', async () => {
            const mockTopic = {
                name: 'Test Topic',
                discussion: 'Test discussion',
                query: 'test query'
            };

            Topic.countDocuments.mockResolvedValue(10);
            Topic.findOne.mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockTopic)
            });

            const result = await JwHelper.getRandomTopic();

            expect(Topic.countDocuments).toHaveBeenCalled();
            expect(result).toEqual(mockTopic);
        });

        it('should handle empty topic collection', async () => {
            Topic.countDocuments.mockResolvedValue(0);
            Topic.findOne.mockReturnValue({
                skip: jest.fn().mockResolvedValue(null)
            });

            const result = await JwHelper.getRandomTopic();

            expect(result).toBeNull();
        });
    });

    describe('sendRandomTopic', () => {
        const mockChannel = {
            send: jest.fn().mockResolvedValue({ id: 'message-id' })
        };

        beforeEach(() => {
            mockChannel.send.mockClear();
        });

        it('should send topic embed to channel', async () => {
            const mockTopic = {
                name: 'Faith',
                discussion: 'What does faith mean?',
                query: 'faith'
            };

            Topic.countDocuments.mockResolvedValue(1);
            Topic.findOne.mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockTopic)
            });

            await JwHelper.sendRandomTopic(mockChannel, 'es');

            expect(mockChannel.send).toHaveBeenCalled();
        });

        it('should not send when no topics found', async () => {
            Topic.countDocuments.mockResolvedValue(0);
            Topic.findOne.mockReturnValue({
                skip: jest.fn().mockResolvedValue(null)
            });

            await JwHelper.sendRandomTopic(mockChannel, 'es');

            expect(mockChannel.send).not.toHaveBeenCalled();
        });

        it('should use default language when not specified', async () => {
            const mockTopic = {
                name: 'Love',
                discussion: 'What is love?',
                query: 'love'
            };

            Topic.countDocuments.mockResolvedValue(1);
            Topic.findOne.mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockTopic)
            });

            await JwHelper.sendRandomTopic(mockChannel);

            expect(mockChannel.send).toHaveBeenCalled();
        });

        it('should handle errors gracefully', async () => {
            const Sentry = require('../../../sentry');
            Topic.countDocuments.mockRejectedValue(new Error('Database error'));

            await JwHelper.sendRandomTopic(mockChannel, 'es');

            expect(Sentry.captureException).toHaveBeenCalled();
        });
    });
});
