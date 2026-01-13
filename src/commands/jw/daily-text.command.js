const moment = require('moment-timezone');
const { JwHelper, GuildHelper } = require('../../helpers');
const { PaginationEmbed } = require('../../util');
const { getLanguage } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Date string YYYY-MM-DD
    const dateString = args.length ? args[0] : moment().format('YYYY-MM-DD');

    const dailyTextEmbeds = await JwHelper.getDailyText(dateString, langCode);

    if (!dailyTextEmbeds) {
        // v14: message.delete() no longer accepts options object
        const errorMsg = await message.channel.send(lang.strings.noTextForDate);
        setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
        return;
    }

    PaginationEmbed(message.channel, dailyTextEmbeds, ['⏪', '⏩'], 28800000);
};

module.exports.config = {
    name: 'Daily Text',
    command: 'daily-text'
};
