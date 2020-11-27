const { MessageEmbed } = require('discord.js');
const Command = require('../Models/Command');
const Sentry = require('../sentry');

module.exports.run = async (client, message, args) => {
    try {
        if (!args.length) {
            await Command.find({}, async function(err, commands) {
                let commandMap = [];
                let help = new MessageEmbed().setColor("0x1D82B6");
                help.setTitle("Available Command List");

                commands.forEach(function(command) {
                    if (command.group === "User") {
                        help.addField(`${command.name}`, `**Description:** ${command.description}\n**Usage:** ${command.usage}`);
                    }
                    commandMap.push(command);
                });

                message.channel.send(help);
            });
        }
    } catch (err) {
        console.log(err);
        Sentry.captureException(err);
        message.channel.send("Ocurrió un error al obtener la ayuda").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    command: "help"
}