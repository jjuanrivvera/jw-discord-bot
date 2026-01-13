const { Events } = require('discord.js');
const Sentry = require('../../sentry');
const { getString } = require('../config/languages');
const GuildHelper = require('../helpers/guild.helper');

const DEFAULT_PREFIX = process.env.PREFIX || 'jw!';

module.exports = {
    name: Events.MessageCreate,  // v14: 'message' -> Events.MessageCreate
    async execute(message, client) {
        // Ignore bot messages and DMs
        if (message.author.bot || !message.guild) {
            return;
        }

        // Get guild-specific prefix or fall back to default
        const guildPrefix = await GuildHelper.getGuildPrefix(message.guild.id);

        // Check if message starts with the guild's prefix
        if (!message.content.startsWith(guildPrefix)) {
            return;
        }

        const args = message.content.slice(guildPrefix.length).trim().split(' '); // Command arguments
        const command = args.shift().toLowerCase(); // Command name
        const discordCommand = client.commands.get(command); // Get the discord command

        if (discordCommand) {
            try {
                await discordCommand.run(message, args, client); // Executes the given command
            } catch (err) {
                console.error('Command execution error:', err);
                Sentry.captureException(err);
                // v14: message.delete() no longer accepts options object
                const errorMsg = await message.channel.send(getString('commandError'));
                setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
            }
        }
    }
};
