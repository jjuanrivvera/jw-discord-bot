const { Events, ActivityType } = require('discord.js');
const botStatus = process.env.BOT_STATUS || 'JW Broadcasting';
const botStatusType = process.env.BOT_STATUS_TYPE || 'Watching';

// Map string activity types to v14 ActivityType enum
const activityTypeMap = {
    'PLAYING': ActivityType.Playing,
    'STREAMING': ActivityType.Streaming,
    'LISTENING': ActivityType.Listening,
    'WATCHING': ActivityType.Watching,
    'COMPETING': ActivityType.Competing,
    // Also support lowercase and capitalized versions
    'Playing': ActivityType.Playing,
    'Streaming': ActivityType.Streaming,
    'Listening': ActivityType.Listening,
    'Watching': ActivityType.Watching,
    'Competing': ActivityType.Competing
};

module.exports = {
    name: Events.ClientReady,  // v14: 'ready' -> Events.ClientReady
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        // Get activity type from map or default to Watching
        const activityType = activityTypeMap[botStatusType] || ActivityType.Watching;

        client.user.setActivity(botStatus, { type: activityType });
    }
};
