const { MessageEmbed } = require('discord.js');
const Sentry = require('../sentry');

const Parser = require('rss-parser');
const parser = new Parser();

module.exports.run = async (client, message, args) => {
    try {
        //Discord message embed
        const newsEmbed = new MessageEmbed().setColor("0x1D82B6");

        const feed = await parser.parseURL('https://www.jw.org/es/noticias/testigos-de-jehova/rss/NewsSubsectionRSSFeed/feed.xml');

        newsEmbed.setTitle(feed.title);
        newsEmbed.setDescription(feed.description);

        let count = 0;

        feed.items.forEach(item => {
            if (count === 5) return;

            newsEmbed.addField(`${item.title}`, `${item.link}`);
            count = count + 1;
        });

        newsEmbed.setFooter(`${feed.link}`);

        await message.channel.send(newsEmbed);
    } catch (err) {
        console.log(err);
        Sentry.captureException(err);
        message.channel.send("Ocurrió un error al obtener las últimas noticias")
                        .then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    command: "news"
}