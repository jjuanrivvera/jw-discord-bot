const Discord = require('discord.js');
const Text = require('../Models/Text');

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

        let dailyText = new Discord.MessageEmbed().setColor("0x1D82B6");
        let dateString = getDateString();
        console.log(dateString);

        if (args.length) {
            dateString = args[0];
        }
        
        let text = await Text.findOne({ date : dateString}).exec();

        if (!text) {
            message.channel.send("No tengo el texto de ese día aún :c");
            return;
        }

        dailyText.setTitle('Texto Diario');
        dailyText.addField(`${text.textContent} (${text.text}).`, `${text.explanation}`);
        dailyText.setFooter(`Tomado de ${text.reference}`);

        await message.channel.send(dailyText);
    } catch (err) {
        console.log(err);
        message.channel.send("Ocurrió un error al obtener el texto de este día, considera leerlo desde https://jw.org");
    }
}

module.exports.config = {
    command: "daily-text"
}