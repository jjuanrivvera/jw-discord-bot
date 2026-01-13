const { MessageEmbed } = require('discord.js');
const { RssFeed } = require('../util');
const { New, Guild } = require('../models');
const { GuildHelper } = require('./');
const { getLanguage, getNewsRssUrl, getNewsTitleKeyword, EMBED_COLORS, DEFAULT_LANG } = require('../config/languages');
const Sentry = require('../../sentry');

module.exports = {
    /**
     * Check for new news and broadcast to all configured guilds
     * Each guild receives news in its configured language
     */
    async checkForNews(client) {
        try {
            // Get all guilds with news channels configured
            const servers = await Guild.find({ newsNotificationChannelId: { $exists: true, $ne: null } });

            if (servers.length === 0) {
                console.log('No servers configured for news notifications');
                return;
            }

            // Group servers by language for efficient RSS fetching
            const serversByLang = this.groupServersByLanguage(servers);

            // Process each language group
            for (const [langCode, langServers] of Object.entries(serversByLang)) {
                await this.processNewsForLanguage(client, langCode, langServers);
            }
        } catch (error) {
            console.error('Error checking for news:', error);
            Sentry.captureException(error);
        }
    },

    /**
     * Group servers by their language setting
     */
    groupServersByLanguage(servers) {
        return servers.reduce((acc, server) => {
            const lang = server.language || DEFAULT_LANG;
            if (!acc[lang]) {
                acc[lang] = [];
            }
            acc[lang].push(server);
            return acc;
        }, {});
    },

    /**
     * Process news for a specific language and its associated servers
     */
    async processNewsForLanguage(client, langCode, servers) {
        try {
            const rssFeed = new RssFeed(getNewsRssUrl(langCode));
            const news = await rssFeed.requestFeed();

            // Get last stored news for this language
            const lastStoredNew = await New.findOne({ language: langCode }).sort({ _id: -1 });

            if (!lastStoredNew) {
                console.log(`No stored news found for language ${langCode}, skipping check`);
                return;
            }

            const newNews = news.getItemsSortedByDate().filter(newItem => {
                return new Date(lastStoredNew.isoDate) < new Date(newItem.isoDate);
            });

            for (const newItem of newNews) {
                await this.broadcastNewsToServers(client, newItem, servers, langCode);
                await this.saveNewsItem(newItem, langCode);
            }
        } catch (error) {
            console.error(`Error processing news for language ${langCode}:`, error);
            Sentry.captureException(error, { tags: { language: langCode } });
        }
    },

    /**
     * Broadcast a news item to specific servers
     */
    async broadcastNewsToServers(client, newItem, servers, langCode) {
        const lang = getLanguage(langCode);
        const titleKeyword = getNewsTitleKeyword(langCode);

        for (const server of servers) {
            try {
                const guild = client.guilds.cache.get(`${server.id}`);

                if (!guild) {
                    console.warn(`Guild ${server.id} not found in cache`);
                    continue;
                }

                // Get channel by ID instead of name
                const channel = guild.channels.cache.get(server.newsNotificationChannelId);

                if (!channel) {
                    console.warn(`Channel ID ${server.newsNotificationChannelId} not found in guild ${server.id}`);
                    continue;
                }

                const newsEmbed = new MessageEmbed()
                    .setColor(EMBED_COLORS.PRIMARY)
                    .setTitle(newItem.title.replace(titleKeyword, lang.strings.latestNews))
                    .addField(lang.strings.readHere, `${newItem.link}`);

                await channel.send(newsEmbed);
            } catch (error) {
                console.error(`Failed to send news to guild ${server.id}:`, error);
                Sentry.captureException(error, {
                    tags: { guildId: server.id, newsItem: newItem.title, language: langCode }
                });
            }
        }
    },

    /**
     * Save a news item to the database
     */
    async saveNewsItem(newItem, langCode) {
        try {
            // Mark previous last news as not last
            await New.updateMany(
                { language: langCode, last: true },
                { $set: { last: false } }
            );

            // Create new news entry
            await New.create({
                ...newItem,
                language: langCode,
                last: true
            });

            const lang = getLanguage(langCode);
            console.log(`[${langCode}] ${lang.strings.newNewsRegistered}`);
        } catch (error) {
            console.error('Failed to save news item:', error);
            Sentry.captureException(error);
        }
    }
};
