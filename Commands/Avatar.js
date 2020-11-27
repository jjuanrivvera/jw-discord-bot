const Sentry = require('../sentry');

module.exports.run = async (client, message, args) => {
    try {
        if (args.length) {
            const user = message.mentions.users.first();

            if (!user) {
                message.channel.send("Menciona a un usuario válido").then(msg => msg.delete({ timeout: 3000 }));
                return;
            }

            message.channel.send(user.displayAvatarURL());
            return;
        }

        message.channel.send(message.author.displayAvatarURL());
    } catch(err) {
        console.log(err);
        Sentry.captureException(err);
        message.channel.send("Ocurrió un error al obtener el avatar").then(msg => msg.delete({ timeout: 3000 }));
    }
}

module.exports.config = {
    command: "avatar"
}