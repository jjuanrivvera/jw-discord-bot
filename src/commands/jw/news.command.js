const { EmbedBuilder } = require('discord.js');
const { RssFeed } = require('../../util');
const { GuildHelper } = require('../../helpers');
const { getNewsRssUrl, getNewsPageUrl, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);

    let feed = new RssFeed(getNewsRssUrl(langCode));
    feed = await feed.requestFeed();

    const newsPageUrl = getNewsPageUrl(langCode);

    // v14: MessageEmbed -> EmbedBuilder
    // v14: setFooter() -> setFooter({ text: ... })
    const newsEmbed = new EmbedBuilder()
        .setColor(EMBED_COLORS.PRIMARY)
        .setTitle(feed.title)
        .setDescription(feed.description)
        .setURL(newsPageUrl)
        .setFooter({ text: newsPageUrl });

    // Get the first 5 items sort by date
    const items = feed.getItemsSortedByDate().slice(0, 4);

    // v14: addField() -> addFields([])
    const fields = items.map(item => ({
        name: item.title,
        value: item.link
    }));
    newsEmbed.addFields(fields);

    // v14: send(embed) -> send({ embeds: [embed] })
    return message.channel.send({ embeds: [newsEmbed] });
};

module.exports.config = {
    name: 'News',
    command: 'news'
};
