/**
 * E2E tests for database operations
 * These tests require a running MongoDB instance
 *
 * Skip these tests if no database is available by setting SKIP_DB_TESTS=true
 * In CI, these tests run only when MongoDB service is available
 */

// Check if we should skip database tests
const SKIP_DB_TESTS = process.env.SKIP_DB_TESTS === 'true' || !process.env.TEST_MONGO_DSN;

if (SKIP_DB_TESTS) {
    describe('Database E2E Tests', () => {
        it.skip('Database tests skipped (no MongoDB available)', () => {});
    });
} else {
    describe('Database E2E Tests', () => {
        let mongoose;
        let Guild;
        let Schedule;

        beforeAll(async () => {
            mongoose = require('mongoose');
            await mongoose.connect(process.env.TEST_MONGO_DSN, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            // Load models after connection
            Guild = require('../../src/models/guild.model');
            Schedule = require('../../src/models/schedule.model');
        }, 30000);

        afterAll(async () => {
            if (mongoose && mongoose.connection.readyState === 1) {
                // Clean up test data
                await Guild.deleteMany({});
                await Schedule.deleteMany({});
                await mongoose.connection.close();
            }
        });

        beforeEach(async () => {
            // Clean up before each test
            if (Guild) {
                await Guild.deleteMany({});
            }
            if (Schedule) {
                await Schedule.deleteMany({});
            }
        });

        describe('Guild Model', () => {
            it('should create a new guild', async () => {
                const guild = await Guild.create({
                    id: 'test-guild-123',
                    name: 'Test Guild'
                });

                expect(guild.id).toBe('test-guild-123');
                expect(guild.name).toBe('Test Guild');
                expect(guild.language).toBeNull();
            });

            it('should update guild language', async () => {
                await Guild.create({
                    id: 'test-guild-123',
                    name: 'Test Guild'
                });

                const updated = await Guild.findOneAndUpdate(
                    { id: 'test-guild-123' },
                    { language: 'en' },
                    { new: true }
                );

                expect(updated.language).toBe('en');
            });

            it('should enforce unique guild id', async () => {
                await Guild.create({
                    id: 'unique-guild',
                    name: 'First Guild'
                });

                await expect(Guild.create({
                    id: 'unique-guild',
                    name: 'Second Guild'
                })).rejects.toThrow();
            });

            it('should set newsNotificationChannelId', async () => {
                const guild = await Guild.create({
                    id: 'guild-with-news',
                    name: 'News Guild',
                    newsNotificationChannelId: 'channel-456'
                });

                expect(guild.newsNotificationChannelId).toBe('channel-456');
            });
        });

        describe('Schedule Model', () => {
            it('should create a new schedule', async () => {
                const schedule = await Schedule.create({
                    guild: 'test-guild-123',
                    channelId: 'channel-456',
                    time: '07',
                    action: 'sendDailyText'
                });

                expect(schedule.guild).toBe('test-guild-123');
                expect(schedule.time).toBe('07');
                expect(schedule.action).toBe('sendDailyText');
            });

            it('should find schedules by guild', async () => {
                await Schedule.create({
                    guild: 'guild-1',
                    channelId: 'channel-1',
                    time: '07',
                    action: 'sendDailyText'
                });

                await Schedule.create({
                    guild: 'guild-1',
                    channelId: 'channel-2',
                    time: '19',
                    action: 'sendRandomTopic'
                });

                await Schedule.create({
                    guild: 'guild-2',
                    channelId: 'channel-3',
                    time: '08',
                    action: 'sendDailyText'
                });

                const guild1Schedules = await Schedule.find({ guild: 'guild-1' });
                expect(guild1Schedules).toHaveLength(2);

                const guild2Schedules = await Schedule.find({ guild: 'guild-2' });
                expect(guild2Schedules).toHaveLength(1);
            });

            it('should delete schedule', async () => {
                const schedule = await Schedule.create({
                    guild: 'delete-test',
                    channelId: 'channel-1',
                    time: '07',
                    action: 'sendDailyText'
                });

                await Schedule.findByIdAndDelete(schedule._id);

                const found = await Schedule.findById(schedule._id);
                expect(found).toBeNull();
            });
        });
    });
}
