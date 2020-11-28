const { MessageEmbed } = require('discord.js');
const SchedulerController = require('../Controllers/SchedulerController');

module.exports.run = async (client, message, args) => {
    //Discord message embed
    let topicEmbed = new MessageEmbed().setColor("0x1D82B6");
    
    if (!args.length) {
        message.channel.send("Tienes que especificar un tema").then(msg => msg.delete({ timeout: 3000 }));
        return;
    }

    if (args[0] == "random") {
        SchedulerController.sendRandomTopic(message.channel);
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