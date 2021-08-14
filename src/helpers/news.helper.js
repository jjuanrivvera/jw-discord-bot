const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../util');
const { New, Guild} = require('../models');

module.exports = {
    async checkForNews(client) {
        const rssFeed = new RssFeed('https://www.jw.org/es/noticias/testigos-de-jehova/rss/NewsSubsectionRSSFeed/feed.xml');
        const news = await rssFeed.requestFeed();

        const lastNew = news.getItemsSortedByDate().slice(0, 1)[0];

        const lastStoredNew = await New.findOne().sort({ _id: -1 });

        const newNews = news.getItemsSortedByDate().filter(newItem => {
            return new Date(lastStoredNew.isoDate) < new Date(newItem.isoDate);
        });

        for (const newItem of newNews) {
            try {
                const servers = await Guild.find({});

                servers.forEach(async function (server) {
                    const guild = client.guilds.cache.get(`${server.id}`);
                    const channel = guild.channels.cache.find(channel => channel.name === server.newsNotificationChannel);
                    
                    const newsEmbed = new MessageEmbed()
                        .setColor("0x1D82B6")
                        .setTitle(newItem.title.replace('COMUNICADOS', 'Última noticia'))
                        .addField(`Leer aquí:`, `${newItem.link}`);

                    channel.send(newsEmbed);
                });

                lastStoredNew.last = false;
                lastStoredNew.save();

                lastNew.last = true;

                New.create(lastNew);
                console.log('Se registró una nueva noticia exitósamente');
            } catch (error) {
                console.log(error);
            }
        }
    }
}