const New = require('../Models/NewModel');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
    const lastNew = await New.findOne().sort({ _id: -1 });

    console.log(lastNew);

    const newEmbed = new MessageEmbed().setColor("0x1D82B6");
    newEmbed.setTitle(lastNew.title);
    newEmbed.addField(lastNew.link);

    await message.channel.send(newEmbed);
}

module.exports.config = {
    command: "last-new"
}