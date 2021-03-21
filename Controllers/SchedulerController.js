const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../util');
const Sentry = require('../sentry');
const Text = require('../Models/TextModel');
const New = require('../Models/NewModel');
const Server = require('../Models/ServerModel');
const Topic = require('../Models/TopicModel');
const moment = require('moment');
const paginationEmbed = require('../util/pagination-embed');

const getDate = () => {
    return moment().format("YYYY-MM-DD");
}

const chunkString = (s, maxBytes) => {
    let buf = Buffer.from(s);
    const result = [];
    while (buf.length) {
        let i = buf.lastIndexOf(32, maxBytes+1);
        // If no space found, try forward search
        if (i < 0) i = buf.indexOf(32, maxBytes);
        // If there's no space at all, take the whole string
        if (i < 0) i = buf.length;
        // This is a safe cut-off point; never half-way a multi-byte
        result.push(buf.slice(0, i).toString());
        buf = buf.slice(i+1); // Skip space (if any)
    }
    return result;
}

module.exports = {
    sendDailyText: async (channel, dateString) => {
        try {
            const text = await Text.findOne({ date : dateString}).exec();
    
            if (!text) {
                console.log("No pude obtener el texto del día");
                return;
            }

            const embeds = [];
            const chunk = chunkString(`${text.explanation}`, 1024);

            chunk.forEach(element => {
                //Discord message embed
                const dailyText = new MessageEmbed().setColor("0x1D82B6");
                
                dailyText.setTitle('Texto Diario');
                dailyText.addField(`${text.textContent} ${text.text}`, `${element}`);

                embeds.push(dailyText);
            });

            await paginationEmbed(channel, embeds, ['⏪', '⏩'], 28800000);
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    },

    sendRandomTopic: async (channel, dateString = getDate()) => {
        try {
            // Get a random topic from MongoDB
            await Topic.countDocuments().exec(async function (err, count) {
                const topicEmbed = new MessageEmbed().setColor("0x1D82B6");
                
                // Get a random entry
                const random = Math.floor(Math.random() * count);
            
                // Again query all users but only fetch one offset by our random #
                await Topic.findOne().skip(random).exec(async function (err, topic) {
                    topicEmbed.setTitle(topic.name);
                    topicEmbed.addField(`Consideremos:`, `${topic.discussion}`);
                    topicEmbed.addField(`Búsqueda`,`https://wol.jw.org/es/wol/s/r4/lp-s?q=${topic.query}&p=par&r=occ`);
            
                    await channel.send(topicEmbed);
                })
            });
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    },

    checkForNews: async (client) => {
        let feed = new RssFeed('https://www.jw.org/es/noticias/testigos-de-jehova/rss/NewsSubsectionRSSFeed/feed.xml');
        feed = await feed.requestFeed();

        let lastItem = feed.getItemsSortedByDate().slice(0, 1)[0];

        let lastNew = await New.findOne().sort({ _id: -1 });

        if (lastItem.title !== lastNew.title) {
            try {
                const servers = await Server.find({});

                servers.forEach(async function (server) {
                    const guild = client.guilds.cache.get(`${server.id}`);
                    const channel = guild.channels.cache.find(
                        (channel) => channel.name === server.newsNotificationChannel
                    );
                    
                    const newsEmbed = new MessageEmbed().setColor("0x1D82B6");

                    const title = lastItem.title.replace('COMUNICADOS', 'Última noticia');
                    newsEmbed.setTitle(title);
                    newsEmbed.addField(`Leer aquí:`, `${lastItem.link}`);

                    channel.send(newsEmbed);
                });

                lastNew.last = false;
                lastNew.save();

                lastItem.last = true;

                lastNew = New.insertMany([lastItem]).then(() => {
                    console.log('Se registró una nueva noticia exitósamente');
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
};