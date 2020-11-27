module.exports.run = async (client, message, args) => {
    message.channel.send(`Pong | 🏓 ${Date.now() - message.createdTimestamp}ms.`);
}

module.exports.config = {
    command: "ping"
}