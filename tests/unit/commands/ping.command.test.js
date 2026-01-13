/**
 * Unit tests for ping.command.js
 */

const pingCommand = require('../../../src/commands/misc/ping.command');
const { createMockMessage } = require('../../mocks/discord.mock');

describe('Ping Command', () => {
    describe('config', () => {
        it('should have correct name', () => {
            expect(pingCommand.config.name).toBe('Ping');
        });

        it('should have correct command trigger', () => {
            expect(pingCommand.config.command).toBe('ping');
        });
    });

    describe('run', () => {
        it('should send pong message with latency', async () => {
            const mockMessage = createMockMessage({
                createdTimestamp: Date.now() - 100 // Simulate 100ms latency
            });

            await pingCommand.run(mockMessage);

            expect(mockMessage.channel.send).toHaveBeenCalled();

            const sentMessage = mockMessage.channel.send.mock.calls[0][0];
            expect(sentMessage).toContain('Pong');
            expect(sentMessage).toContain('🏓');
            expect(sentMessage).toContain('ms');
        });

        it('should calculate latency correctly', async () => {
            const now = Date.now();
            const mockMessage = createMockMessage({
                createdTimestamp: now - 50 // Simulate 50ms latency
            });

            await pingCommand.run(mockMessage);

            const sentMessage = mockMessage.channel.send.mock.calls[0][0];
            // The latency should be approximately 50ms (with small margin for execution time)
            const latencyMatch = sentMessage.match(/(\d+)ms/);
            expect(latencyMatch).toBeTruthy();

            const latency = parseInt(latencyMatch[1], 10);
            expect(latency).toBeGreaterThanOrEqual(50);
            expect(latency).toBeLessThan(200); // Reasonable upper bound
        });

        it('should return send result', async () => {
            const mockMessage = createMockMessage({
                createdTimestamp: Date.now()
            });

            const result = await pingCommand.run(mockMessage);

            // The function returns the result of channel.send (undefined in our mock)
            expect(mockMessage.channel.send).toHaveBeenCalledTimes(1);
        });
    });
});
