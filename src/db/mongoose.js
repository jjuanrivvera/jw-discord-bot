const mongoose = require('mongoose');
const dsn = process.env.MONGO_DSN;

mongoose.connect(dsn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose;
