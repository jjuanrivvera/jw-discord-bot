const { MessageEmbed } = require('discord.js');
const Sentry = require('../sentry');
const Text = require('../Models/Text');

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
            dailyText.addField(`${text.textContent} (${text.text}).`, `${text.explanation}`);
            dailyText.setFooter(`Tomado de ${text.reference}`);
    
            await channel.send(dailyText);
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        }
    }
};