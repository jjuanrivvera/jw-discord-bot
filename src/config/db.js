const mongoose = require("mongoose");
const dsn = process.env.MONGO_DSN;

module.exports = {
    init() {
        mongoose.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        //mongoose.set('useNewUrlParser', true);
        //mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
    }
};