const { EmbedBuilder } = require('discord.js');
const { JwHelper, GuildHelper } = require('../../helpers');
const { getLanguage, getWolSearchUrl, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    if (!args.length) {
        // v14: message.delete() no longer accepts options object
        const errorMsg = await message.channel.send(lang.strings.specifyTopic);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        return;
    }

    if (args[0] === 'random') {
        return JwHelper.sendRandomTopic(message.channel, langCode);
    }

    const topic = args.join('+');

    // v14: MessageEmbed -> EmbedBuilder
    // v14: addField() -> addFields([])
    const topicEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.PRIMARY)
        .setTitle(lang.strings.jwOnlineLibrary)
        .addFields([
            { name: `${lang.strings.moreInfoAbout} "${topic}"`, value: getWolSearchUrl(topic, langCode) }
        ]);

    // v14: send(embed) -> send({ embeds: [embed] })
    message.channel.send({ embeds: [topicEmbed] });
};

module.exports.config = {
    name: 'Topic',
    command: 'topic'
};
