const JwHelper = require('./jw.helper');
const { PaginationEmbed } = require('../util');

module.exports = {
    async sendDailyText(channel, date) {
        const dailyTextEmbeds = await JwHelper.getDailyText(date);

        PaginationEmbed(channel, dailyTextEmbeds, ['⏪', '⏩'], 28800000);
    },

    async sendRandomTopic(channel, date) {
        return JwHelper.sendRandomTopic(channel);
    }
}