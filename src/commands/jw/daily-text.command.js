const moment = require('moment-timezone');
const { JwHelper } = require('../../helpers');
const { PaginationEmbed } = require('../../util');

module.exports.run = async (message, args) => {
    //Date string YYYY-MM-DD
    const dateString = args.length ? args[0] : moment().format('YYYY-MM-DD');
    
    const dailyTextEmbeds = await JwHelper.getDailyText(dateString);

    if (!dailyTextEmbeds) {
        return message.channel.send("No tengo el texto de ese día aún :c").then(msg => msg.delete({ timeout: 3000 }));
    }

    PaginationEmbed(message.channel, dailyTextEmbeds, ['⏪', '⏩'], 28800000);
}

module.exports.config = {
    name: "Daily Text",
    command: "daily-text"
}