const mongoose = require('mongoose');
const dsn = process.env.MONGO_DSN;

module.exports = {
    init() {
        // Mongoose 6+ no longer requires these options - they're the default
        mongoose.connect(dsn);
    }
};
