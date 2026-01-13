const { New } = require('../../models');
const { EmbedBuilder } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Get last news for this guild's language
    const lastNew = await New.findOne({ language: langCode }).sort({ _id: -1 });

    if (!lastNew) {
        // v14: message.delete() no longer accepts options object
        const errorMsg = await message.channel.send(lang.strings.noNewsFound);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        return;
    }

    // v14: MessageEmbed -> EmbedBuilder
    const newEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.PRIMARY)
        .setTitle(lastNew.title)
        .setDescription(lastNew.link);

    // v14: send(embed) -> send({ embeds: [embed] })
    message.channel.send({ embeds: [newEmbed] });
};

module.exports.config = {
    name: 'Last New',
    command: 'last-new'
};
