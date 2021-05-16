const { MessageEmbed } = require('discord.js');
const { Command } = require('../../models');

module.exports.run = async (message, args) => {
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
}

module.exports.config = {
    name: "Help",
    command: "help"
}