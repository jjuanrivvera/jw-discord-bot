const { MessageEmbed } = require('discord.js');
const Text = require('../Models/Text');
const Sentry = require('../sentry');

/**
 * Get date in format YY-MM-DD
 * 
 * @returns string
 */
function getDateString () {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Date object initialized from user's timezone. Returns a datetime string
    let dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });

    // Date object initialized from the above datetime string
    let date = new Date(dateStringFromTimeZone);
    
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let dateString = `${year}-${month}-${day}`;

    return dateString;
}

module.exports.run = async (client, message, args) => {
    try {
        //Discord message embed
        let dailyText = new MessageEmbed().setColor("0x1D82B6");

        //Date string YY-MM-DD
        let dateString = getDateString();

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