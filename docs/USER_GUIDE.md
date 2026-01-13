# User Guide

This guide explains how to use the JW Discord Bot commands.

## Table of Contents

- [Getting Started](#getting-started)
- [Daily Text](#daily-text)
- [News](#news)
- [Topic Search](#topic-search)
- [Utility Commands](#utility-commands)
- [Tips & Tricks](#tips--tricks)

---

## Getting Started

The bot responds to commands that start with a prefix (default: `jw!`). Type a command in any channel where the bot has access.

**Example:**
```
jw!daily-text
```

> **Note:** Your server admin may have configured a different prefix. Ask them if commands aren't working.

---

## Daily Text

Get the daily scripture text from JW.org.

### Get Today's Text

```
jw!daily-text
```

The bot will display the daily text with:
- Scripture reference
- Bible verse
- Explanation/commentary

If the text is long, use the ⏪ and ⏩ reactions to navigate between pages.

### Get Text for a Specific Date

```
jw!daily-text 2024-01-15
```

Use the format `YYYY-MM-DD` (year-month-day).

**Examples:**
```
jw!daily-text 2024-12-25    # December 25, 2024
jw!daily-text 2025-01-01    # January 1, 2025
```

> **Note:** Daily texts must be loaded into the database. If you see "I don't have the text for that day yet", the text for that date hasn't been imported.

---

## News

Get the latest news from JW.org.

### View Recent News

```
jw!news
```

Shows the 4 most recent news articles with links to read more.

### View Last Stored News

```
jw!last-new
```

Shows the most recent news article that was saved to the database.

### Automatic News Notifications

Ask your server admin to set up automatic news notifications using `jw!setnews #channel`. When new articles are published on JW.org, the bot will automatically post them.

---

## Topic Search

Search for topics in the JW Online Library (WOL).

### Search for a Topic

```
jw!topic bible study
```

Returns a link to search results in the Watchtower Online Library.

**Examples:**
```
jw!topic prayer
jw!topic kingdom hall
jw!topic jehovah's witnesses history
```

### Get a Random Topic

```
jw!topic random
```

Displays a random topic from the database with:
- Topic name
- Discussion points
- Link to search in WOL

Great for conversation starters or personal study!

---

## Utility Commands

### Help

```
jw!help
```

Shows a list of available commands with descriptions.

### Ping

```
jw!ping
```

Check if the bot is online and measure response time.

### Date & Time

```
jw!date
```

Shows the current date and time in the server's timezone.

**With specific timezone:**
```
jw!date America/New_York
jw!date Europe/London
jw!date Asia/Tokyo
```

### Avatar

```
jw!avatar
```

Shows your profile picture in full size.

**View someone else's avatar:**
```
jw!avatar @username
```

---

## Tips & Tricks

### 1. Use Pagination

Long daily texts are split into pages. Look for the reaction buttons:
- ⏪ Previous page
- ⏩ Next page

### 2. Check Your Server's Language

The bot can respond in different languages (Spanish, English, Portuguese). Ask your admin to set the server language with `jw!setlang`.

### 3. Bookmark Daily Texts

Want to save a daily text? Right-click on the bot's message and select "Pin Message" (if you have permissions) or use Discord's bookmark feature.

### 4. Share News Links

The news command provides direct links to JW.org articles. You can copy and share these links with others.

### 5. Use Topics for Study

The random topic feature is great for:
- Family worship preparation
- Personal study ideas
- Conversation topics

---

## Troubleshooting

### Bot doesn't respond

1. Make sure you're using the correct prefix (`jw!` by default)
2. Check if the bot is online (look for green status dot)
3. Verify the bot has permission to read and send messages in your channel

### "I don't have the text for that day"

The daily text for that date hasn't been imported into the database. Contact your server admin.

### Wrong language

Ask your server admin to set the correct language using `jw!setlang`.

### Commands are slow

The bot needs to fetch data from JW.org, which may take a few seconds. Be patient!

---

## Need Help?

- Contact your server administrator
- Check the [Admin Guide](ADMIN_GUIDE.md) for server configuration
- Report issues on [GitHub](https://github.com/jjuanrivvera99/jw-discord-bot/issues)
