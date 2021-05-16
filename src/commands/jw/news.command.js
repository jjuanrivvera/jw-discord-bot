const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../../util');

module.exports.run = async (message) => {
    //Discord message embed
    const newsEmbed = new MessageEmbed().setColor("0x1D82B6");

    let feed = new RssFeed('https://www.jw.org/es/noticias/testigos-de-jehova/rss/NewsSubsectionRSSFeed/feed.xml');
    feed = await feed.requestFeed();

    newsEmbed.setTitle(feed.title);
    newsEmbed.setDescription(feed.description);

    // Get the first 5 items sort by date
    const items = feed.getItemsSortedByDate().slice(0, 4);

    // Generates embed fields
    items.forEach(item => {
        newsEmbed.addField(`${item.title}`, `${item.link}`);
    });

    newsEmbed.setFooter(`https://www.jw.org/es/noticias/testigos-de-jehova/#newsAlerts`);

    await message.channel.send(newsEmbed);
}

module.exports.config = {
    name: "News",
    command: "news"
}