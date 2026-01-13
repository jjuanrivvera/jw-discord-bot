const { New } = require('../../models');
const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Get last news for this guild's language
    const lastNew = await New.findOne({ language: langCode }).sort({ _id: -1 });

    if (!lastNew) {
        return message.channel.send(lang.strings.noNewsFound).then(msg => msg.delete({ timeout: 3000 }));
    }

    const newEmbed = new MessageEmbed()
        .setColor(EMBED_COLORS.PRIMARY)
        .setTitle(lastNew.title)
        .setDescription(lastNew.link);

    message.channel.send(newEmbed);
}

module.exports.config = {
    name: "Last New",
    command: "last-new"
}
