require("dotenv").config();

const botId = process.env.BOT_ID;

const paginationEmbed = async (channel, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
	if (!channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');
    
    let page = 0;
    
	const curPage = await channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
	
	if (pages.length === 1) {
		return curPage;
	}
    
    for (const emoji of emojiList) await curPage.react(emoji);
    
	const reactionCollector = curPage.createReactionCollector(
		(reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
		{ time: timeout }
    );
    
	reactionCollector.on('collect', reaction => {
        reaction.users.cache.forEach(element => {
            if (element.id != botId) {
                reaction.users.remove(element);
            }
        });

		switch (reaction.emoji.name) {
			case emojiList[0]:
				page = page > 0 ? --page : pages.length - 1;
				break;
			case emojiList[1]:
				page = page + 1 < pages.length ? ++page : 0;
				break;
			default:
				break;
		}
		curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    });
    
	reactionCollector.on('end', () => {
		if (!curPage.deleted) {
			curPage.reactions.removeAll()
		}
    });
    
	return curPage;
};

module.exports = paginationEmbed;
