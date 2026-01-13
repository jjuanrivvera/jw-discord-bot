const { MessageEmbed } = require('discord.js');
const { GuildHelper } = require('../../helpers');
const { getLanguage, EMBED_COLORS } = require('../../config/languages');

function isValidTimeZone(tz) {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
        throw new Error('Time zones are not available in this environment');
    }

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (ex) {
        return false;
    }
}

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    const timeZone = args.length ? args[0] : Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!isValidTimeZone(timeZone)) {
        return message.channel.send(lang.strings.invalidTimezone).then(msg => msg.delete({ timeout: 3000 }));
    }

    const dateStringFromTimeZone = new Date().toLocaleString('en-US', { timeZone: timeZone });
    const date = new Date(dateStringFromTimeZone);

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const time_hh_mm_ss = hours + ':' + minutes + ':' + seconds;

    const dateEmbed = new MessageEmbed()
        .setColor(EMBED_COLORS.PRIMARY)
        .setTitle(lang.strings.todayIs)
        .addFields(
            {
                name: lang.strings.day,
                value: day
            },
            {
                name: lang.strings.month,
                value: month
            },
            {
                name: lang.strings.year,
                value: year.toString()
            },
            {
                name: lang.strings.time,
                value: time_hh_mm_ss
            },
            {
                name: lang.strings.timezone,
                value: timeZone
            }
        );

    return message.channel.send(dateEmbed);
};

module.exports.config = {
    name: 'Date',
    command: 'date'
};
