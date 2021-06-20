module.exports.run = async (message, args) => {
    
    if (args.length) {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send("Menciona a un usuario válido").then(msg => msg.delete({ timeout: 3000 }));
        }

        return message.channel.send(user.displayAvatarURL());
    }

    return message.channel.send(message.author.displayAvatarURL({
        size: 1024
    }));
}

module.exports.config = {
    name: "Avatar",
    command: "avatar"
}