const { MessageEmbed } = require('discord.js');
const { Guild } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language for responses
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Check for admin permissions
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send(lang.strings.adminOnly).then(msg => msg.delete({ timeout: 5000 }));
    }

    const channel = message.mentions.channels.first();

    // If no channel mentioned and no args, show current config
    if (!channel && !args.length) {
        const guildConfig = await Guild.findOne({ id: message.guild.id });
        let channelDisplay = lang.strings.notConfigured;

        if (guildConfig?.newsNotificationChannelId) {
            const configuredChannel = message.guild.channels.cache.get(guildConfig.newsNotificationChannelId);
            channelDisplay = configuredChannel ? `${configuredChannel}` : `ID: ${guildConfig.newsNotificationChannelId} (${lang.strings.notConfigured})`;
        }

        const configEmbed = new MessageEmbed()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig)
            .addField('News Channel', channelDisplay);

        return message.channel.send(configEmbed);
    }

    // If "off" or "remove" is passed, remove the news channel
    if (args[0] === 'off' || args[0] === 'remove') {
        await Guild.findOneAndUpdate(
            { id: message.guild.id },
            { $set: { newsNotificationChannelId: null } },
            { upsert: false }
        );

        const embed = new MessageEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setDescription(lang.strings.newsChannelRemoved);

        return message.channel.send(embed);
    }

    // Require a channel mention
    if (!channel) {
        return message.channel.send(lang.strings.specifyChannel).then(msg => msg.delete({ timeout: 5000 }));
    }

    // Update or create guild config with channel ID
    await Guild.findOneAndUpdate(
        { id: message.guild.id },
        {
            id: message.guild.id,
            name: message.guild.name,
            newsNotificationChannelId: channel.id
        },
        { upsert: true, new: true }
    );

    const embed = new MessageEmbed()
        .setColor(EMBED_COLORS.SUCCESS)
        .setDescription(`${lang.strings.newsChannelSet} ${channel}`);

    return message.channel.send(embed);
};

module.exports.config = {
    name: 'Set News Channel',
    command: 'setnews'
};
