const { Guild } = require('../models');
const { DEFAULT_LANG, getLanguage } = require('../config/languages');

/**
 * Get the language code for a guild
 * Falls back to DEFAULT_LANG if not set or guild not found
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<string>} Language code (e.g., 'es', 'en', 'pt')
 */
async function getGuildLanguage(guildId) {
    if (!guildId) {
        return DEFAULT_LANG;
    }

    try {
        const guild = await Guild.findOne({ id: guildId });
        return guild?.language || DEFAULT_LANG;
    } catch (err) {
        console.error('Error getting guild language:', err);
        return DEFAULT_LANG;
    }
}

/**
 * Get guild configuration
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<object|null>} Guild document or null
 */
async function getGuildConfig(guildId) {
    if (!guildId) {
        return null;
    }

    try {
        return await Guild.findOne({ id: guildId });
    } catch (err) {
        console.error('Error getting guild config:', err);
        return null;
    }
}

/**
 * Set the language for a guild
 * Creates guild document if it doesn't exist
 * @param {string} guildId - Discord guild ID
 * @param {string} guildName - Discord guild name
 * @param {string} langCode - Language code ('es', 'en', 'pt')
 * @returns {Promise<object>} Updated guild document
 */
async function setGuildLanguage(guildId, guildName, langCode) {
    const validLangs = ['es', 'en', 'pt'];
    if (!validLangs.includes(langCode)) {
        throw new Error(`Invalid language code. Available: ${validLangs.join(', ')}`);
    }

    return Guild.findOneAndUpdate(
        { id: guildId },
        {
            id: guildId,
            name: guildName,
            language: langCode
        },
        { upsert: true, new: true }
    );
}

/**
 * Get translated string for a guild
 * @param {string} key - String key
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<string>} Translated string
 */
async function getGuildString(key, guildId) {
    const langCode = await getGuildLanguage(guildId);
    const lang = getLanguage(langCode);
    return lang.strings[key] || key;
}

/**
 * Get the command prefix for a guild
 * Falls back to DEFAULT_PREFIX from env if not set
 * @param {string} guildId - Discord guild ID
 * @returns {Promise<string>} Command prefix
 */
async function getGuildPrefix(guildId) {
    const DEFAULT_PREFIX = process.env.PREFIX || 'jw!';

    if (!guildId) {
        return DEFAULT_PREFIX;
    }

    try {
        const guild = await Guild.findOne({ id: guildId });
        return guild?.prefix || DEFAULT_PREFIX;
    } catch (err) {
        console.error('Error getting guild prefix:', err);
        return DEFAULT_PREFIX;
    }
}

/**
 * Set the command prefix for a guild
 * @param {string} guildId - Discord guild ID
 * @param {string} guildName - Discord guild name
 * @param {string} prefix - New command prefix
 * @returns {Promise<object>} Updated guild document
 */
async function setGuildPrefix(guildId, guildName, prefix) {
    if (!prefix || prefix.length > 10) {
        throw new Error('Prefix must be 1-10 characters');
    }

    return Guild.findOneAndUpdate(
        { id: guildId },
        {
            id: guildId,
            name: guildName,
            prefix: prefix
        },
        { upsert: true, new: true }
    );
}

module.exports = {
    getGuildLanguage,
    getGuildConfig,
    setGuildLanguage,
    getGuildString,
    getGuildPrefix,
    setGuildPrefix
};
