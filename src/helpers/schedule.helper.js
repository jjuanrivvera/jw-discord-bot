const JwHelper = require('./jw.helper');
const { PaginationEmbed } = require('../util');
const { DEFAULT_LANG } = require('../config/languages');

module.exports = {
    /**
     * Send daily text to a channel
     * @param {Channel} channel - Discord channel to send to
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} langCode - Language code for the guild
     */
    async sendDailyText(channel, date, langCode = DEFAULT_LANG) {
        const dailyTextEmbeds = await JwHelper.getDailyText(date, langCode);

        if (!dailyTextEmbeds) {
            console.log(`[${langCode}] No daily text found for ${date}`);
            return;
        }

        PaginationEmbed(channel, dailyTextEmbeds, ['⏪', '⏩'], 28800000);
    },

    /**
     * Send a random topic to a channel
     * @param {Channel} channel - Discord channel to send to
     * @param {string} date - Date (unused but kept for API consistency)
     * @param {string} langCode - Language code for the guild
     */
    async sendRandomTopic(channel, date, langCode = DEFAULT_LANG) {
        return JwHelper.sendRandomTopic(channel, langCode);
    }
};
