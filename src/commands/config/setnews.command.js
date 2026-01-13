const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { Guild } = require('../../models');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language for responses
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // v14: hasPermission() -> permissions.has()
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const errorMsg = await message.channel.send(lang.strings.adminOnly);
        setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
        return;
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

        // v14: MessageEmbed -> EmbedBuilder
        // v14: addField() -> addFields([])
        const configEmbed = new EmbedBuilder()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig)
            .addFields([
                { name: 'News Channel', value: channelDisplay }
            ]);

        // v14: send(embed) -> send({ embeds: [embed] })
        return message.channel.send({ embeds: [configEmbed] });
    }

    // If "off" or "remove" is passed, remove the news channel
    if (args[0] === 'off' || args[0] === 'remove') {
        await Guild.findOneAndUpdate(
            { id: message.guild.id },
            { $set: { newsNotificationChannelId: null } },
            { upsert: false }
        );

        const embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.SUCCESS)
            .setDescription(lang.strings.newsChannelRemoved);

        return message.channel.send({ embeds: [embed] });
    }

    // Require a channel mention
    if (!channel) {
        const errorMsg = await message.channel.send(lang.strings.specifyChannel);
        setTimeout(() => errorMsg.delete().catch(() => {}), 5000);
        return;
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

    const embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.SUCCESS)
        .setDescription(`${lang.strings.newsChannelSet} ${channel}`);

    return message.channel.send({ embeds: [embed] });
};

module.exports.config = {
    name: 'Set News Channel',
    command: 'setnews'
};
