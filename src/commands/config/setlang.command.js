const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { EMBED_COLORS, getLanguage, getAvailableLanguages, DEFAULT_LANG } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get current guild language for responses
    const guildLang = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(guildLang);

    // Check admin permissions
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send(lang.strings.adminOnly)
            .then(msg => msg.delete({ timeout: 3000 }));
    }

    const availableLanguages = getAvailableLanguages();
    const langCodes = availableLanguages.map(l => l.code);

    // No args - show current config
    if (!args.length) {
        const currentLang = getLanguage(guildLang);

        const embed = new MessageEmbed()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig)
            .addField(lang.strings.language || 'Language', `${currentLang.name} (${currentLang.code})`)
            .addField(
                lang.strings.availableLanguages || 'Available Languages',
                availableLanguages.map(l => `\`${l.code}\` - ${l.name}`).join('\n')
            );

        return message.channel.send(embed);
    }

    const newLang = args[0].toLowerCase();

    // Validate language code
    if (!langCodes.includes(newLang)) {
        const errorMsg = (lang.strings.invalidLanguage || 'Invalid language. Available:') +
            ` ${langCodes.join(', ')}`;
        return message.channel.send(errorMsg)
            .then(msg => msg.delete({ timeout: 5000 }));
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
        return message.channel.send(lang.strings.commandError)
            .then(msg => msg.delete({ timeout: 3000 }));
    }
};

module.exports.config = {
    name: "Set Language",
    command: "setlang"
};
