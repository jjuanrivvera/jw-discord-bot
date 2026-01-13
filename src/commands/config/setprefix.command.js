const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { EMBED_COLORS, getLanguage } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get current guild language for responses
    const guildLang = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(guildLang);

    // v14: hasPermission() -> permissions.has()
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const errorMsg = await message.channel.send(lang.strings.adminOnly);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        return;
    }

    const currentPrefix = await GuildHelper.getGuildPrefix(message.guild.id);
    const DEFAULT_PREFIX = process.env.PREFIX || 'jw!';

    // No args - show current config
    if (!args.length) {
        const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig || 'Current Configuration')
            .addFields([
                { name: lang.strings.prefix || 'Prefix', value: `\`${currentPrefix}\`` },
                { name: lang.strings.defaultPrefix || 'Default', value: `\`${DEFAULT_PREFIX}\`` },
                { name: lang.strings.usage || 'Usage', value: `\`${currentPrefix}setprefix <new-prefix>\`` }
            ]);

        return message.channel.send({ embeds: [embed] });
    }

    const newPrefix = args[0];

    // Validate prefix
    if (newPrefix.length > 10) {
        const errorMsg = lang.strings.prefixTooLong || 'Prefix must be 10 characters or less';
        const sentMsg = await message.channel.send(errorMsg);
        setTimeout(() => sentMsg.delete().catch(() => {}), 5000);
        return;
    }

    if (newPrefix.length < 1) {
        const errorMsg = lang.strings.prefixTooShort || 'Prefix must be at least 1 character';
        const sentMsg = await message.channel.send(errorMsg);
        setTimeout(() => sentMsg.delete().catch(() => {}), 5000);
        return;
    }

    // Set the new prefix
    try {
        await GuildHelper.setGuildPrefix(
            message.guild.id,
            message.guild.name,
            newPrefix
        );

        const successMsg = (lang.strings.prefixSet || 'Prefix set to') +
            ` \`${newPrefix}\``;

        return message.channel.send(successMsg);
    } catch (err) {
        console.error('Error setting guild prefix:', err);
        const errorMsg = await message.channel.send(lang.strings.commandError);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
    }
};

module.exports.config = {
    name: 'Set Prefix',
    command: 'setprefix'
};
