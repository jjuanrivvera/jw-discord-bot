require('dotenv').config();
const cron = require('node-cron');

//Discord vars
const Discord = require('discord.js');
const discordToken = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

//Mongo vars
const Schedule = require('./Models/Schedule');
const SchedulerController = require('./Controllers/SchedulerController');
const dsn = process.env.MONGO_DSN;
const mongoose = require('mongoose');
mongoose.connect(dsn, {useNewUrlParser: true, useUnifiedTopology: true});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    cron.schedule('* * * * *', async function() {
        let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });
        let date = new Date(dateStringFromTimeZone);
        let hours = ("0" + date.getHours()).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let dateString = `${year}-${month}-${day}`;

        try {
            await Schedule.find({}, async function(err, schedules) {
                schedules.forEach(async function(schedule) {
                    if (hours == schedule.time && dateString != schedule.last) {
                        const guild = client.guilds.cache.get(`${schedule.guild}`);
                        const channel = guild.channels.cache.find(channel => channel.name === schedule.channel);
                        const action = schedule.action;

                        SchedulerController[action](channel, dateString);

                        schedule.last = dateString;
                        schedule.save();
                    }
                });
            }); 
        } catch (err) {
            console.log(err);
        }
    });
});

client.login(discordToken);