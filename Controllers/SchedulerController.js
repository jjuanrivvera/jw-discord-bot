const { MessageEmbed } = require('discord.js');
const Sentry = require('../sentry');
const Text = require('../Models/TextModel');
const Topic = require('../Models/TopicModel');
const moment = require('moment');

const getDate = () => {
    return moment().format("YYYY-MM-DD");
}

module.exports = {
    sendDailyText: async (channel, dateString) => {
        try {
            let dailyText = new MessageEmbed().setColor("0x1D82B6");
            let text = await Text.findOne({ date : dateString}).exec();
    
            if (!text) {
                console.log("No pude obtener el texto del día");
                return;
            }
    
            dailyText.setTitle('Texto Diario');
            dailyText.addField(`${text.textContent} ${text.text}`, `${text.explanation}`);
            dailyText.setFooter(`Tomado de ${text.reference}`);
    
            await channel.send(dailyText);
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    },

    sendRandomTopic: async (channel, dateString = getDate()) => {
        try {
            // Get a random topic from MongoDB
            await Topic.countDocuments().exec(async function (err, count) {
                let topicEmbed = new MessageEmbed().setColor("0x1D82B6");
                
                // Get a random entry
                var random = Math.floor(Math.random() * count);
            
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
    }
};