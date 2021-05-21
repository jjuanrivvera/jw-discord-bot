const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment-timezone");

const Discord = require("discord.js");
const discordClient = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;

module.exports = {
    loadCommands() {
        discordClient.commands = new Discord.Collection();

        const commandFolders = fs.readdirSync('./src/commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./commands/${folder}/${file}`);
                discordClient.commands.set(command.config.command, command);
                console.log(`${command.config.name} Command loaded`);
            }
        }
    },

    loadEvents() {
        const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`./events/${file}`);

            if (event.once) {
                discordClient.once(event.name, (...args) => event.execute(...args, discordClient));
            } else {
                discordClient.on(event.name, (...args) => event.execute(...args, discordClient));
            }
        }
    },

    setupScheduler() {
        cron.schedule(newsCronPeriodicity, async function () {
            SchedulerController.checkForNews(discordClient);
        });
    
        cron.schedule("* * * * *", async function () {
            //Get date and hour
            const date = moment().format("YYYY-MM-DD");
            const hours = moment().format("HH");
    
            try {
                await Schedule.find({}, async function (err, schedules) {
                    schedules.forEach(async function (schedule) {
                        if (hours == schedule.time && date != schedule.last) {
                            const guild = discordClient.guilds.cache.get(`${schedule.guild}`);
                            const channel = guild.channels.cache.find(
                                (channel) => channel.name === schedule.channel
                            );
                            const action = schedule.action;
    
                            SchedulerController[action](channel, date);
    
                            schedule.last = date;
                            schedule.save();
                        }
                    });
                });
            } catch (err) {
                console.log(err);
            }
        });
    },
    
    login() {
        discordClient.login(discordToken);
    }
}