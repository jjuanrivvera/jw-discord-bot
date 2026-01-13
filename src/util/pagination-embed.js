require('dotenv').config();

/**
 * Creates a paginated embed message with reaction navigation
 * @param {TextChannel} channel - The channel to send the embed to
 * @param {EmbedBuilder[]} pages - Array of embed pages
 * @param {string[]} emojiList - Array of two emoji for navigation [prev, next]
 * @param {number} timeout - Timeout in milliseconds (default: 120000)
 * @returns {Promise<Message>} The sent message
 */
const paginationEmbed = async (channel, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
    if (!channel) {
        throw new Error('Channel is inaccessible.');
    }
    if (!pages || pages.length === 0) {
        throw new Error('Pages are not given.');
    }
    if (emojiList.length !== 2) {
        throw new Error('Need two emojis.');
    }

    let page = 0;

    /**
     * Get the embed for a specific page with footer
     * @param {number} pageIndex - The page index
     * @returns {EmbedBuilder} The embed with footer
     */
    const getPageEmbed = (pageIndex) => {
        // v14: setFooter() now requires an object with text property
        return pages[pageIndex].setFooter({
            text: `Page ${pageIndex + 1} / ${pages.length}`
        });
    };

    // v14: send() now requires embeds to be in an array
    const curPage = await channel.send({
        embeds: [getPageEmbed(page)]
    });

    // If only one page, no need for reactions
    if (pages.length === 1) {
        return curPage;
    }

    // Add reactions
    for (const emoji of emojiList) {
        await curPage.react(emoji);
    }

    // v14: createReactionCollector() now uses an options object with filter
    const reactionCollector = curPage.createReactionCollector({
        filter: (reaction, user) => {
            return emojiList.includes(reaction.emoji.name) && !user.bot;
        },
        time: timeout
    });

    reactionCollector.on('collect', async (reaction, user) => {
        // Remove user's reaction
        try {
            await reaction.users.remove(user.id);
        } catch (error) {
            console.error('Failed to remove reaction:', error);
        }

        // Update page index
        switch (reaction.emoji.name) {
        case emojiList[0]: // Previous
            page = page > 0 ? page - 1 : pages.length - 1;
            break;
        case emojiList[1]: // Next
            page = page + 1 < pages.length ? page + 1 : 0;
            break;
        default:
            break;
        }

        // v14: edit() now requires embeds to be in an array
        try {
            await curPage.edit({
                embeds: [getPageEmbed(page)]
            });
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    });

    reactionCollector.on('end', async () => {
        // v14: .deleted property removed, check if message is editable instead
        try {
            if (curPage.editable) {
                await curPage.reactions.removeAll();
            }
        } catch (error) {
            console.error('Failed to remove reactions:', error);
        }
    });

    return curPage;
};

module.exports = paginationEmbed;
