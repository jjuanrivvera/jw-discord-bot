const { MessageEmbed } = require('discord.js');
const { Schedule } = require('../../models');
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
    const hourArg = args.find(arg => /^\d{1,2}$/.test(arg));

    // If no args, show current config
    if (!channel && !args.length) {
        const schedule = await Schedule.findOne({
            guild: message.guild.id,
            action: 'sendDailyText'
        });

        let scheduleDisplay = lang.strings.notConfigured;

        if (schedule?.channelId) {
            const configuredChannel = message.guild.channels.cache.get(schedule.channelId);
            scheduleDisplay = configuredChannel
                ? `${configuredChannel} ${lang.strings.atHour} ${schedule.time}:00`
                : `ID: ${schedule.channelId} (${lang.strings.notConfigured})`;
        }

        const configEmbed = new MessageEmbed()
            .setColor(EMBED_COLORS.PRIMARY)
            .setTitle(lang.strings.currentConfig)
            .addField('Daily Text', scheduleDisplay);

        return message.channel.send(configEmbed);
    }

    // If "off" or "remove" is passed, remove the schedule
    if (args[0] === 'off' || args[0] === 'remove') {
        await Schedule.findOneAndDelete({
            guild: message.guild.id,
            action: 'sendDailyText'
        });

        const embed = new MessageEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setDescription(lang.strings.dailyScheduleRemoved);

        return message.channel.send(embed);
    }

    // Require a channel mention
    if (!channel) {
        return message.channel.send(lang.strings.specifyChannel).then(msg => msg.delete({ timeout: 5000 }));
    }

    // Parse and validate hour (default to 7 if not provided)
    const hour = hourArg ? parseInt(hourArg, 10) : 7;

    if (hour < 0 || hour > 23) {
        return message.channel.send(lang.strings.invalidHour).then(msg => msg.delete({ timeout: 5000 }));
    }

    const hourStr = hour.toString().padStart(2, '0');

    // Update or create schedule with channel ID
    await Schedule.findOneAndUpdate(
        {
            guild: message.guild.id,
            action: 'sendDailyText'
        },
        {
            guild: message.guild.id,
            channelId: channel.id,
            time: hourStr,
            action: 'sendDailyText',
            last: ''
        },
        { upsert: true, new: true }
    );

    const embed = new MessageEmbed()
        .setColor(EMBED_COLORS.SUCCESS)
        .setDescription(`${lang.strings.dailyScheduleSet} ${channel} ${lang.strings.atHour} ${hourStr}:00`);

    return message.channel.send(embed);
};

module.exports.config = {
    name: 'Set Daily Text',
    command: 'setdaily'
};
