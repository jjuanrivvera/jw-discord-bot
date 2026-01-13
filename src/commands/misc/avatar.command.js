const { GuildHelper } = require('../../helpers');
const { getLanguage } = require('../../config/languages');

module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    if (args.length) {
        const user = message.mentions.users.first();

        if (!user) {
            return message.channel.send(lang.strings.mentionValidUser).then(msg => msg.delete({ timeout: 3000 }));
        }

        return message.channel.send(user.displayAvatarURL());
    }

    return message.channel.send(message.author.displayAvatarURL({
        size: 1024
    }));
};

module.exports.config = {
    name: 'Avatar',
    command: 'avatar'
};
