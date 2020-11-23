const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    let topicEmbed = new Discord.MessageEmbed().setColor("0x1D82B6");
    if (!args.length) {
        message.channel.send("Tienes que especificar un tema");
        return;
    }

    let topic = args.join('+');

    topicEmbed.setTitle('JW Online Library');
    topicEmbed.addField(`Aquí puedes encontrar más info acerca de "${topic}"`, `https://wol.jw.org/es/wol/s/r4/lp-s?q=${topic}&p=par&r=occ`);

    message.channel.send(topicEmbed);
}

module.exports.config = {
    command: "topic"
}