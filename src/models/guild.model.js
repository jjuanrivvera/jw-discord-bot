const mongoose = require('../db/mongoose');

/**
 * Guild (Server) Schema
 * Stores per-guild configuration for the bot
 * Each Discord server can have its own language, channels, and settings
 */
const guildSchema = new mongoose.Schema({
    // Discord guild (server) ID
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // Guild name (for reference/debugging)
    name: {
        type: String,
        required: true
    },
    // Channel ID for news notifications (null if disabled)
    // Using ID instead of name for reliability (channels can be renamed)
    newsNotificationChannelId: {
        type: String,
        default: null
    },
    // Custom command prefix for this guild (null = use default)
    prefix: {
        type: String,
        default: null
    },
    // Language code for this guild (null = use DEFAULT_LANG)
    // Supported: 'es', 'en', 'pt'
    language: {
        type: String,
        enum: ['es', 'en', 'pt', null],
        default: null
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster lookups when broadcasting news
guildSchema.index({ newsNotificationChannelId: 1 });

module.exports = mongoose.model('guild', guildSchema);
