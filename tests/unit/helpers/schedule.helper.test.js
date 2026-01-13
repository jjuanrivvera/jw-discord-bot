/**
 * Unit tests for schedule.helper.js
 */

// Mock JwHelper
jest.mock('../../../src/helpers/jw.helper', () => ({
    getDailyText: jest.fn(),
    sendRandomTopic: jest.fn()
}));

// Mock PaginationEmbed
jest.mock('../../../src/util', () => ({
    PaginationEmbed: jest.fn()
}));

const ScheduleHelper = require('../../../src/helpers/schedule.helper');
const JwHelper = require('../../../src/helpers/jw.helper');
const { PaginationEmbed } = require('../../../src/util');

describe('Schedule Helper', () => {
    const mockChannel = {
        id: 'channel-123',
        send: jest.fn().mockResolvedValue({ id: 'message-id' })
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('sendDailyText', () => {
        it('should send paginated embeds when text exists', async () => {
            const mockEmbeds = [{ title: 'Daily Text' }, { title: 'Page 2' }];
            JwHelper.getDailyText.mockResolvedValue(mockEmbeds);

            await ScheduleHelper.sendDailyText(mockChannel, '2024-01-01', 'es');

            expect(JwHelper.getDailyText).toHaveBeenCalledWith('2024-01-01', 'es');
            expect(PaginationEmbed).toHaveBeenCalledWith(
                mockChannel,
                mockEmbeds,
                ['⏪', '⏩'],
                28800000
            );
        });

        it('should not send anything when text not found', async () => {
            JwHelper.getDailyText.mockResolvedValue(undefined);

            await ScheduleHelper.sendDailyText(mockChannel, '2024-01-01', 'es');

            expect(JwHelper.getDailyText).toHaveBeenCalled();
            expect(PaginationEmbed).not.toHaveBeenCalled();
        });

        it('should use default language when not provided', async () => {
            JwHelper.getDailyText.mockResolvedValue([{ title: 'Text' }]);

            await ScheduleHelper.sendDailyText(mockChannel, '2024-01-01');

            expect(JwHelper.getDailyText).toHaveBeenCalledWith('2024-01-01', 'es');
        });

        it('should use correct pagination timeout (8 hours)', async () => {
            const mockEmbeds = [{ title: 'Daily Text' }];
            JwHelper.getDailyText.mockResolvedValue(mockEmbeds);

            await ScheduleHelper.sendDailyText(mockChannel, '2024-01-01', 'en');

            // 28800000ms = 8 hours
            expect(PaginationEmbed).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                28800000
            );
        });
    });

    describe('sendRandomTopic', () => {
        it('should delegate to JwHelper.sendRandomTopic', async () => {
            JwHelper.sendRandomTopic.mockResolvedValue({ id: 'message-id' });

            await ScheduleHelper.sendRandomTopic(mockChannel, '2024-01-01', 'es');

            expect(JwHelper.sendRandomTopic).toHaveBeenCalledWith(mockChannel, 'es');
        });

        it('should use default language when not provided', async () => {
            JwHelper.sendRandomTopic.mockResolvedValue({ id: 'message-id' });

            await ScheduleHelper.sendRandomTopic(mockChannel, '2024-01-01');

            expect(JwHelper.sendRandomTopic).toHaveBeenCalledWith(mockChannel, 'es');
        });

        it('should ignore date parameter (kept for API consistency)', async () => {
            JwHelper.sendRandomTopic.mockResolvedValue({ id: 'message-id' });

            await ScheduleHelper.sendRandomTopic(mockChannel, 'any-date', 'pt');

            // Date is not passed to JwHelper.sendRandomTopic
            expect(JwHelper.sendRandomTopic).toHaveBeenCalledWith(mockChannel, 'pt');
        });
    });
});
