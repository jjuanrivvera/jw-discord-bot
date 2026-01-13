const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { EMBED_COLORS, getLanguage, getAvailableLanguages } = require('../../config/languages');

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

    const availableLanguages = getAvailableLanguages();
    const langCodes = availableLanguages.map(l => l.code);

    // No args - show current config
    if (!args.length) {
        const currentLang = getLanguage(guildLang);

        // v14: MessageEmbed -> EmbedBuilder
        // v14: addField() -> addFields([])
        const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig)
            .addFields([
                { name: lang.strings.language || 'Language', value: `${currentLang.name} (${currentLang.code})` },
                {
                    name: lang.strings.availableLanguages || 'Available Languages',
                    value: availableLanguages.map(l => `\`${l.code}\` - ${l.name}`).join('\n')
                }
            ]);

        // v14: send(embed) -> send({ embeds: [embed] })
        return message.channel.send({ embeds: [embed] });
    }

    const newLang = args[0].toLowerCase();

    // Validate language code
    if (!langCodes.includes(newLang)) {
        const errorMsg = (lang.strings.invalidLanguage || 'Invalid language. Available:') +
            ` ${langCodes.join(', ')}`;
        const sentMsg = await message.channel.send(errorMsg);
        setTimeout(() => sentMsg.delete().catch(() => {}), 5000);
        return;
    }

    // Set the new language
    try {
        await GuildHelper.setGuildLanguage(
            message.guild.id,
            message.guild.name,
            newLang
        );

        const newLangConfig = getLanguage(newLang);
        const successMsg = (lang.strings.languageSet || 'Language set to') +
            ` **${newLangConfig.name}** (${newLang})`;

        return message.channel.send(successMsg);
    } catch (err) {
        console.error('Error setting guild language:', err);
        const errorMsg = await message.channel.send(lang.strings.commandError);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
    }
};

module.exports.config = {
    name: 'Set Language',
    command: 'setlang'
};
