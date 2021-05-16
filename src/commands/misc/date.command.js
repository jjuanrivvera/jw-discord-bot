const { MessageEmbed } = require('discord.js');

function isValidTimeZone(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw 'Time zones are not available in this environment';
    }

    try {
        Intl.DateTimeFormat(undefined, {timeZone: tz});
        return true;
    }
    catch (ex) {
        return false;
    }
}

module.exports.run = async (message, args) => {
    //Discord message embed
    let dateEmbed = new MessageEmbed().setColor("0x1D82B6");

    //Timezone
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    //If there is an arg it will replace the timezone
    if (args.length) {
        timeZone = args[0];

        if (!isValidTimeZone(timeZone)) {
            message.channel.send("La zona horaria ingresada no es válida").then(msg => msg.delete({ timeout: 3000}));
            return;
        }
    }

    // Date object initialized from user's timezone. Returns a datetime string
    let dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });

    // Date object initialized from the above datetime string
    let date = new Date(dateStringFromTimeZone);
    
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    let time_hh_mm_ss = hours + ":" + minutes + ":" + seconds;

    dateEmbed.setTitle("Today is:");
    dateEmbed.addField("Day:", day);
    dateEmbed.addField("Month:", month);
    dateEmbed.addField("Year:", year);
    dateEmbed.addField("Time:", time_hh_mm_ss);
    dateEmbed.addField("Time Zone:", timeZone);
    
    await message.channel.send(dateEmbed);
}

module.exports.config = {
    name: "Date",
    command: "date"
}