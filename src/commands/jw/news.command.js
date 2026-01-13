const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../../util');
const { GuildHelper } = require('../../helpers');
const { getNewsRssUrl, getNewsPageUrl, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);

    let feed = new RssFeed(getNewsRssUrl(langCode));
    feed = await feed.requestFeed();

    const newsPageUrl = getNewsPageUrl(langCode);

    // Discord message embed
    const newsEmbed = new MessageEmbed().setColor(EMBED_COLORS.PRIMARY)
        .setTitle(feed.title)
        .setDescription(feed.description)
        .setURL(newsPageUrl)
        .setFooter(newsPageUrl);

    // Get the first 5 items sort by date
    const items = feed.getItemsSortedByDate().slice(0, 4);

    // Generates embed fields
    items.forEach(item => {
        newsEmbed.addField(`${item.title}`, `${item.link}`);
    });

    return message.channel.send(newsEmbed);
}

module.exports.config = {
    name: "News",
    command: "news"
}
