require("dotenv").config();
const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment-timezone");

//Discord vars
const Discord = require("discord.js");
const discordClient = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;

//Mongo vars
const dsn = process.env.MONGO_DSN;
const mongoose = require("mongoose");
mongoose.connect(dsn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schedule = require("./Models/ScheduleModel");
const SchedulerController = require("./Controllers/SchedulerController");

//Discord commands collection
discordClient.commands = new Discord.Collection();

//Read the files on Commands folder and load each command.
fs.readdir("./Commands/", (err, files) => {
    if (err) {
        console.log(err);
    }

    let jsFiles = files.filter((f) => f.split(".").pop() === "js");

    if (!jsFiles.length) {
        console.log("No commands found");
    }

    jsFiles.forEach((file, index) => {
        const command = require(`./Commands/${file}`);
        discordClient.commands.set(command.config.command, command);
        console.log(`Command ${file} loaded`);
    });
});

let setupScheduler = () => {
    cron.schedule("* * * * *", async function () {
        //Get date and hour
        let date = moment().format("YYYY-MM-DD");
        let hours = moment().format("HH");

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
};

//Discord bot ready
discordClient.on("ready", () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);

    setupScheduler();
});

discordClient.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    //Variables
    let args = message.content.slice(prefix.length).trim().split(" "); //Command arguments
    let command = args.shift().toLowerCase(); //Command name
    let discordCommand = discordClient.commands.get(command); //Get the discord command

    if (discordCommand) {
        discordCommand.run(discordClient, message, args); //Executes the given command
    }
});

discordClient.login(discordToken);