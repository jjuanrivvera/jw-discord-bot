const { MessageEmbed } = require('discord.js');
const { JwHelper, GuildHelper } = require('../../helpers');
const { getLanguage, getWolSearchUrl, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Discord message embed
    let topicEmbed = new MessageEmbed().setColor(EMBED_COLORS.PRIMARY);

    if (!args.length) {
        message.channel.send(lang.strings.specifyTopic).then(msg => msg.delete({ timeout: 3000 }));
        return;
    }

    if (args[0] == "random") {
        return JwHelper.sendRandomTopic(message.channel, langCode);
    }

    let topic = args.join('+');

    topicEmbed.setTitle(lang.strings.jwOnlineLibrary);
    topicEmbed.addField(`${lang.strings.moreInfoAbout} "${topic}"`, getWolSearchUrl(topic, langCode));

    message.channel.send(topicEmbed);
}

module.exports.config = {
    name: "Topic",
    command: "topic"
}
