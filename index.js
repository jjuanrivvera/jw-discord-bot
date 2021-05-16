require("dotenv").config();

const bot = require('./src/app');
const db = require('./src/config/db');

db.init();
bot.loadCommands();
bot.loadEvents();
bot.login();