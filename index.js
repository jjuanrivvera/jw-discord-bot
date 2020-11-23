require('dotenv').config();
const fs = require('fs');

//Discord vars
const Discord = require('discord.js');
const discordClient = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;

//Mongo vars
const dsn = process.env.MONGO_DSN;
const mongoose = require('mongoose');
mongoose.connect(dsn, {useNewUrlParser: true, useUnifiedTopology: true});

//Mongoose Models
const Command = require('./Models/Command');

discordClient.commands = new Discord.Collection();

fs.readdir('./Commands/', (err, files) => {
    if (err) {
        console.log(err);
    }

    let jsFiles = files.filter(f => f.split('.').pop() === 'js'); 

    if (!jsFiles.length) {
        console.log('No commands found');
    }

    jsFiles.forEach((file, index) => {
        const command = require(`./Commands/${file}`);
        discordClient.commands.set(command.config.command, command);
        console.log(`Command ${file} loaded`);
    });
});

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});
  
discordClient.on('message', async message => {

    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

    //Variables
    let sender = message.author;
    let args = message.content.slice(prefix.length).trim().split(' ');
    let command = args.shift().toLowerCase();
    let discordCommand = discordClient.commands.get(command);

    if (discordCommand) {
        discordCommand.run(discordClient, message, args);
    }
});

discordClient.login(discordToken);