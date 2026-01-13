const { MessageEmbed } = require('discord.js');
const { Command } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    if (!args.length) {
        const commands = await Command.find({});

        let help = new MessageEmbed().setColor(EMBED_COLORS.PRIMARY);
        help.setTitle(lang.strings.availableCommands || "Available Command List");

        commands.forEach(function(command) {
            if (command.group === "User") {
                help.addField(`${command.name}`, `**${lang.strings.description || 'Description'}:** ${command.description}\n**${lang.strings.usage || 'Usage'}:** ${command.usage}`);
            }
        });

        return message.channel.send(help);
    }
}

module.exports.config = {
    name: "Help",
    command: "help"
}
