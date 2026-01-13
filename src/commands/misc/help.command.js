const { EmbedBuilder } = require('discord.js');
const { Command } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    if (!args.length) {
        const commands = await Command.find({});

        // v14: MessageEmbed -> EmbedBuilder
        const help = new EmbedBuilder()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.availableCommands || 'Available Command List');

        // v14: addField() -> addFields([])
        const fields = commands
            .filter(command => command.group === 'User')
            .map(command => ({
                name: command.name,
                value: `**${lang.strings.description || 'Description'}:** ${command.description}\n**${lang.strings.usage || 'Usage'}:** ${command.usage}`
            }));

        if (fields.length > 0) {
            help.addFields(fields);
        }

        // v14: send(embed) -> send({ embeds: [embed] })
        return message.channel.send({ embeds: [help] });
    }
};

module.exports.config = {
    name: 'Help',
    command: 'help'
};
