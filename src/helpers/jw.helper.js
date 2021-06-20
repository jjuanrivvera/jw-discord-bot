const { MessageEmbed } = require('discord.js');
const { Text, Topic } = require('../models');
const Sentry = require('../../sentry');

// const chunkString = (s, maxBytes) => {
//     let buf = Buffer.from(s);
//     const result = [];
//     while (buf.length) {
//         let i = buf.lastIndexOf(32, maxBytes+1);
//         // If no space found, try forward search
//         if (i < 0) i = buf.indexOf(32, maxBytes);
//         // If there's no space at all, take the whole string
//         if (i < 0) i = buf.length;
//         // This is a safe cut-off point; never half-way a multi-byte
//         result.push(buf.slice(0, i).toString());
//         buf = buf.slice(i+1); // Skip space (if any)
//     }
//     return result;
// }

const chunkString = (str, len) => {
    const size = Math.ceil(str.length / len);
    const r = Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        r[i] = str.substr(offset, len);
        offset += len;
    }

    return r;
}

module.exports = {
    async getDailyText(dateString) {
        const text = await Text.findOne({ date : dateString});

        if (!text) {
            console.log("No pude obtener el texto del día");
            return;
        }

        const embeds = [];
        const chunk = chunkString(`${text.explanation}`, 1024);

        chunk.forEach(element => {
            //Discord message embed
            const dailyText = new MessageEmbed().setColor("0x1D82B6")
                .setTitle('Texto Diario')
                .addField(`${text.textContent} ${text.text}`, `${element}`);

            embeds.push(dailyText);
        });

        return embeds;
    },

    async getRandomTopic() {
        const topicCount = await Topic.countDocuments();

        const random = Math.floor(Math.random() * topicCount);

        const topic = await Topic.findOne().skip(random);

        return topic;
    },

    async sendRandomTopic(channel) {
        try {
            const topic = await this.getRandomTopic();

            const topicEmbed = new MessageEmbed()
                .setColor("0x1D82B6")
                .setTitle(topic.name)
                .addFields(
                    {
                        name: "Consideremos:",
                        value: topic.discussion
                    },
                    {
                        name: "Busqueda",
                        value: `https://wol.jw.org/es/wol/s/r4/lp-s?q=${topic.query}&p=par&r=occ`
                    }
                );

            return channel.send(topicEmbed);
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    }
}