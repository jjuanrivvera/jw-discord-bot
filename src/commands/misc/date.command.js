const { MessageEmbed } = require('discord.js');

function isValidTimeZone(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw 'Time zones are not available in this environment';
    }

    try {
        Intl.DateTimeFormat(undefined, {timeZone: tz});
        return true;
    } catch (ex) {
        return false;
    }
}

module.exports.run = async (message, args) => {
    //Timezone
    const timeZone = args.length ? args[0] : Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!isValidTimeZone(timeZone)) {
        return message.channel.send("La zona horaria ingresada no es válida").then(msg => msg.delete({ timeout: 3000}));
    }

    // Date object initialized from user's timezone. Returns a datetime string
    const dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });

    // Date object initialized from the above datetime string
    const date = new Date(dateStringFromTimeZone);
    
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const time_hh_mm_ss = hours + ":" + minutes + ":" + seconds;

    const dateEmbed = new MessageEmbed()
        .setColor("0x1D82B6")
        .setTitle("Today is:")
        .addFields(
            {
                name: "Day:",
                value: day
            },
            {
                name: "Month:",
                value: month
            },
            {
                name: "Year:",
                value: year
            },
            {
                name: "Time:",
                value: time_hh_mm_ss
            },
            {
                name: "Time Zone:",
                value: timeZone
            },
        );
    
    return message.channel.send(dateEmbed);
}

module.exports.config = {
    name: "Date",
    command: "date"
}