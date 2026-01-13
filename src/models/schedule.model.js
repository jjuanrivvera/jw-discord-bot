const mongoose = require('../db/mongoose');

/**
 * Schedule Schema
 * Stores scheduled actions for each guild (daily text, random topics, etc.)
 */
const scheduleSchema = new mongoose.Schema({
    // Discord guild (server) ID
    guild: {
        type: String,
        required: true,
        index: true
    },
    // Hour to execute (24h format, e.g., "07", "19")
    time: {
        type: String,
        required: true
    },
    // Channel ID to post in (using ID for reliability)
    channelId: {
        type: String,
        required: true
    },
    // Action to execute (sendDailyText, sendRandomTopic)
    action: {
        type: String,
        required: true,
        enum: ['sendDailyText', 'sendRandomTopic']
    },
    // Last execution date (YYYY-MM-DD format)
    last: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index for efficient lookups
scheduleSchema.index({ guild: 1, action: 1 }, { unique: true });

module.exports = mongoose.model('schedule', scheduleSchema);
