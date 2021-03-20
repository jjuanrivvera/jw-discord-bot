const { MessageEmbed } = require('discord.js');
const Text = require('../Models/TextModel');
const Sentry = require('../sentry');
const moment = require('moment-timezone');
const paginationEmbed = require('../util/pagination-embed');

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

module.exports.run = async (client, message, args) => {
    try {
        //Date string YYYY-MM-DD
        let dateString = moment().format('YYYY-MM-DD');

        if (args.length) {
            dateString = args[0];
        }
        
        //Get the text from MongoDB
        const text = await Text.findOne({ date : dateString}).exec();

        if (!text) {
            message.channel.send("No tengo el texto de ese día aún :c").then(msg => msg.delete({ timeout: 3000 }));
            return;
        }

        const embeds = [];

        const chunk = chunkString(`${text.explanation}`, 1024).slice(0, -1);

        chunk.forEach(element => {
            //Discord message embed
            const dailyText = new MessageEmbed().setColor("0x1D82B6");
            
            dailyText.setTitle('Texto Diario');
            dailyText.addField(`${text.textContent} ${text.text}`, `${element}`);

            embeds.push(dailyText);
        });

        await paginationEmbed(message.channel, embeds, ['⏪', '⏩'], 28800000);
    } catch (err) {
        console.log(err);
        Sentry.captureException(err);
        message.channel.send("Ocurrió un error al obtener el texto de este día, considera leerlo desde https://jw.org")
                        //.then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    command: "daily-text"
}