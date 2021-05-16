const fs = require("fs");

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
    
    login() {
        discordClient.login(discordToken);
    }
}