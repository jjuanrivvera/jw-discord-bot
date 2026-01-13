const botStatus = process.env.BOT_STATUS || 'JW Broadcasting';
const botStatusType = process.env.BOT_STATUS_TYPE || 'WATCHING';

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setActivity(botStatus, { type: botStatusType });
    }
};
