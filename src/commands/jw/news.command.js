const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../../util');

module.exports.run = async (message) => {
    let feed = new RssFeed('https://www.jw.org/es/noticias/testigos-de-jehova/rss/NewsSubsectionRSSFeed/feed.xml');
    feed = await feed.requestFeed();

    //Discord message embed
    const newsEmbed = new MessageEmbed().setColor("0x1D82B6")
        .setTitle(feed.title)
        .setDescription(feed.description)
        .setURL(`https://www.jw.org/es/noticias/testigos-de-jehova/#newsAlerts`)
        .setFooter(`https://www.jw.org/es/noticias/testigos-de-jehova/#newsAlerts`);

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