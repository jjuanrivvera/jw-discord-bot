const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment-timezone");

const { Client, Collection } = require("discord.js");
const discordClient = new Client();
const discordToken = process.env.DISCORD_TOKEN;

/* -------------------------------------------
 * Initialize Schedule vars.
 --------------------------------------------- */
const newsCronPeriodicity = process.env.NEWS_CRON || '* */6 * * *';
const schedulerTimezone = process.env.SCHEDULER_TIMEZONE || 'America/Bogota';
const { Schedule, Guild } = require("./models");
const { ScheduleHelper, NewsHelper } = require('./helpers');
const { DEFAULT_LANG } = require('./config/languages');

module.exports = {
    loadCommands() {
        discordClient.commands = new Collection();

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
        // News check scheduler
        cron.schedule(newsCronPeriodicity, async function () {
            NewsHelper.checkForNews(discordClient);
        });

        // Scheduled actions (daily text, random topics, etc.)
        cron.schedule("* * * * *", async function () {
            // Get date and hour using configurable timezone
            const date = moment().tz(schedulerTimezone).format("YYYY-MM-DD");
            const hours = moment().tz(schedulerTimezone).format("HH");

            try {
                const schedules = await Schedule.find();

                for (const schedule of schedules) {
                    if (hours === schedule.time && date !== schedule.last) {
                        const guild = discordClient.guilds.cache.get(`${schedule.guild}`);

                        if (!guild) {
                            console.warn(`Guild ${schedule.guild} not found in cache`);
                            continue;
                        }

                        // Get channel by ID instead of name
                        const channel = guild.channels.cache.get(schedule.channelId);

                        if (!channel) {
                            console.warn(`Channel ID ${schedule.channelId} not found in guild ${schedule.guild}`);
                            continue;
                        }

                        const action = schedule.action;

                        if (ScheduleHelper[action]) {
                            // Get guild language for localized content
                            const guildConfig = await Guild.findOne({ id: schedule.guild });
                            const langCode = guildConfig?.language || DEFAULT_LANG;

                            await ScheduleHelper[action](channel, date, langCode);
                            schedule.last = date;
                            await schedule.save();
                        } else {
                            console.warn(`Unknown schedule action: ${action}`);
                        }
                    }
                }
            } catch (err) {
                console.error('Scheduler error:', err);
            }
        });
    },

    login() {
        discordClient.login(discordToken);
    }
}
