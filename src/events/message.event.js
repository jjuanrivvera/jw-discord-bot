const discordPrefix = process.env.PREFIX || 'jw!';
const Sentry = require('../../sentry');
const { getString } = require('../config/languages');

module.exports = {
	name: 'message',
	async execute(message, client) {
		if (!message.content.startsWith(discordPrefix) || message.author.bot || !message.guild) return;

        const args = message.content.slice(discordPrefix.length).trim().split(" "); // Command arguments
        const command = args.shift().toLowerCase(); // Command name
        const discordCommand = client.commands.get(command); // Get the discord command

        if (discordCommand) {
            try {
                await discordCommand.run(message, args, client); // Executes the given command
            } catch (err) {
                console.error('Command execution error:', err);
                Sentry.captureException(err);
                await message.channel.send(getString('commandError')).then(msg => msg.delete({ timeout: 3000 }));
            }
        }
	}
};