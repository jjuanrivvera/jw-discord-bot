module.exports.run = async (client, message, args) => {
    message.channel.send('Pong.');
}

module.exports.config = {
    command: "ping"
}