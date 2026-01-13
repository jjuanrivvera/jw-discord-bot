const mongoose = require('../db/mongoose');

/**
 * News Schema
 * Stores news items from JW.org RSS feeds
 * Each news item is associated with a language for multi-language support
 */
const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    pubDate: {
        type: String
    },
    isoDate: {
        type: String,
        required: true
    },
    // Language code this news belongs to
    language: {
        type: String,
        enum: ['es', 'en', 'pt'],
        default: 'es',
        index: true
    },
    // Whether this is the most recent news for its language
    last: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
newSchema.index({ language: 1, isoDate: -1 });
newSchema.index({ language: 1, last: 1 });

module.exports = mongoose.model('new', newSchema);
