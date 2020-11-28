const { MessageEmbed } = require('discord.js');
const Text = require('../Models/TextModel');
const Sentry = require('../sentry');
const moment = require('moment-timezone');

module.exports.run = async (client, message, args) => {
    try {
        //Discord message embed
        let dailyText = new MessageEmbed().setColor("0x1D82B6");

        //Date string YYYY-MM-DD
        let dateString = moment().format('YYYY-MM-DD');

        if (args.length) {
            dateString = args[0];
        }
        
        //Get the text from MongoDB
        let text = await Text.findOne({ date : dateString}).exec();

        if (!text) {
            message.channel.send("No tengo el texto de ese día aún :c").then(msg => msg.delete({ timeout: 3000 }));
            return;
        }

        dailyText.setTitle('Texto Diario');
        dailyText.addField(`${text.textContent} (${text.text}).`, `${text.explanation}`);
        dailyText.setFooter(`Tomado de ${text.reference}`);

        await message.channel.send(dailyText);
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