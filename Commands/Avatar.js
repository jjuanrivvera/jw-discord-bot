module.exports.run = async (client, message, args) => {
    if (args.length) {
        const user = message.mentions.users.first();
        message.channel.send(user.displayAvatarURL());
        return;
    }

    message.channel.send(message.author.displayAvatarURL());
}

module.exports.config = {
    command: "avatar"
}