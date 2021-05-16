const mongoose = require('../db/mongoose');

const newSchema = new mongoose.Schema({
    title: 'string',
    link: 'string',
    pubDate: "string",
    isoDate: "string",
    last: "boolean"
});

module.exports  = mongoose.model('new', newSchema);