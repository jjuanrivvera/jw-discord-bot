const { EmbedBuilder } = require('discord.js');
const { Text, Topic } = require('../models');
const Sentry = require('../../sentry');
const { getLanguage, getWolSearchUrl, EMBED_COLORS, DEFAULT_LANG } = require('../config/languages');

/**
 * Split a string into chunks of specified length
 * @param {string} str - String to split
 * @param {number} len - Maximum length of each chunk
 * @returns {Array<string>} Array of string chunks
 */
const chunkString = (str, len) => {
    const size = Math.ceil(str.length / len);
    const result = Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        result[i] = str.substring(offset, offset + len);
        offset += len;
    }

    return result;
};

module.exports = {
    /**
     * Get daily text embeds for a specific date
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @param {string} langCode - Language code (default: DEFAULT_LANG)
     * @returns {Array<EmbedBuilder>|undefined} Array of embeds or undefined if not found
     */
    async getDailyText(dateString, langCode = DEFAULT_LANG) {
        const lang = getLanguage(langCode);
        const text = await Text.findOne({ date: dateString });

        if (!text) {
            console.log(`[${langCode}] ${lang.strings.couldNotGetText}`);
            return;
        }

        const embeds = [];
        const chunks = chunkString(`${text.explanation}`, 1024);

        chunks.forEach(chunk => {
            // v14: MessageEmbed -> EmbedBuilder
            // v14: addField() -> addFields([{ name, value }])
            const dailyText = new EmbedBuilder()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(lang.strings.dailyText)
                .addFields([
                    { name: `${text.textContent} ${text.text}`, value: `${chunk}` }
                ]);

            embeds.push(dailyText);
        });

        return embeds;
    },

    /**
     * Get a random topic from the database
     * @returns {Object} Topic document
     */
    async getRandomTopic() {
        const topicCount = await Topic.countDocuments();
        const random = Math.floor(Math.random() * topicCount);
        const topic = await Topic.findOne().skip(random);

        return topic;
    },

    /**
     * Send a random topic to a channel
     * @param {Channel} channel - Discord channel to send to
     * @param {string} langCode - Language code (default: DEFAULT_LANG)
     */
    async sendRandomTopic(channel, langCode = DEFAULT_LANG) {
        try {
            const lang = getLanguage(langCode);
            const topic = await this.getRandomTopic();

            if (!topic) {
                console.log(`[${langCode}] No topics found`);
                return;
            }

            // v14: MessageEmbed -> EmbedBuilder
            const topicEmbed = new EmbedBuilder()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(topic.name)
                .addFields([
                    { name: lang.strings.consider, value: topic.discussion },
                    { name: lang.strings.search, value: getWolSearchUrl(topic.query, langCode) }
                ]);

            // v14: send(embed) -> send({ embeds: [embed] })
            return channel.send({ embeds: [topicEmbed] });
        } catch (err) {
            console.error('Error sending random topic:', err);
            Sentry.captureException(err);
        }
    }
};
