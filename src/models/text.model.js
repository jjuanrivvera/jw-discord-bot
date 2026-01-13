const mongoose = require('../db/mongoose');

const textSchema = new mongoose.Schema({
    date: 'string',
    text: 'string',
    textContent: 'string',
    explanation: 'string',
    reference: 'string'
});

module.exports = mongoose.model('text', textSchema);
