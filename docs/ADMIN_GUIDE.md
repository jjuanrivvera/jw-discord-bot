# Server Administrator Guide

This guide is for Discord server administrators who want to configure the JW Discord Bot for their community.

## Table of Contents

- [Requirements](#requirements)
- [Setting Up the Bot](#setting-up-the-bot)
- [Configuration Commands](#configuration-commands)
  - [Set Language](#set-language)
  - [Set News Channel](#set-news-channel)
  - [Set Daily Text Schedule](#set-daily-text-schedule)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Requirements

To use admin commands, you need **Administrator** permission on your Discord server.

---

## Setting Up the Bot

### Step 1: Invite the Bot

Use the invite link provided by the bot owner:

```
https://discord.com/api/oauth2/authorize?client_id=BOT_ID&permissions=274877991936&scope=bot
```

### Step 2: Configure Language

Set your server's preferred language:

```
jw!setlang es    # Spanish
jw!setlang en    # English
jw!setlang pt    # Portuguese
```

### Step 3: Set Up News Notifications (Optional)

Choose a channel for automatic news updates:

```
jw!setnews #news
```

### Step 4: Schedule Daily Text (Optional)

Set up automatic daily text posting:

```
jw!setdaily #daily-text 7    # Posts at 7:00 AM
```

---

## Configuration Commands

All configuration commands require **Administrator** permissions.

### Set Language

```
jw!setlang <language_code>
```

**Language Codes:**
| Code | Language | Description |
|------|----------|-------------|
| `es` | Español | Spanish - Bot responses and JW.org content in Spanish |
| `en` | English | English - Bot responses and JW.org content in English |
| `pt` | Português | Portuguese - Bot responses and JW.org content in Portuguese |

**Examples:**
```
jw!setlang en           # Set to English
jw!setlang es           # Set to Spanish
jw!setlang pt           # Set to Portuguese
jw!setlang              # View current setting
```

**What changes with language:**
- All bot messages and error text
- News feed source (language-specific JW.org RSS)
- Daily text labels and titles
- Search links point to correct language WOL

---

### Set News Channel

```
jw!setnews #channel
```

Configures automatic news notifications from JW.org.

**Examples:**
```
jw!setnews #news          # Set news channel to #news
jw!setnews #announcements # Set to #announcements
jw!setnews                # View current setting
jw!setnews off            # Disable news notifications
```

**How it works:**
1. Bot periodically checks JW.org RSS feed (default: every 6 hours)
2. When new articles are found, they're posted to your configured channel
3. News is fetched in your server's configured language

**Requirements:**
- Bot must have permission to send messages in the target channel
- Channel must be a text channel (not voice or category)

---

### Set Daily Text Schedule

```
jw!setdaily #channel <hour>
```

Schedules automatic daily text posting.

**Parameters:**
- `#channel` - The channel to post in (mention the channel)
- `<hour>` - Hour to post (0-23, 24-hour format)

**Examples:**
```
jw!setdaily #daily-text 7     # Post at 7:00 AM
jw!setdaily #general 19       # Post at 7:00 PM
jw!setdaily #morning 6        # Post at 6:00 AM
jw!setdaily                   # View current setting
jw!setdaily off               # Disable scheduled posting
```

**Time Notes:**
- Uses 24-hour format (0 = midnight, 12 = noon, 18 = 6 PM)
- Time is based on the bot's configured timezone (default: America/Bogota)
- Posts happen at the start of the hour

**Requirements:**
- Bot must have permission to send messages in the target channel
- Daily texts must be loaded in the database

---

## Best Practices

### 1. Create Dedicated Channels

Consider creating dedicated channels for bot content:
- `#daily-text` - For scheduled daily texts
- `#jw-news` - For news notifications
- `#jw-bot` - For general bot commands

### 2. Set Appropriate Permissions

In your bot channels, consider:
- Allowing the bot to send messages
- Allowing the bot to embed links
- Allowing the bot to add reactions (for pagination)
- Restricting member message permissions if you want bot-only channels

### 3. Choose the Right Time

For daily text scheduling:
- Consider your congregation's timezone
- Morning hours (6-8 AM) work well for daily reading
- Evening hours (7-9 PM) work for family worship preparation

### 4. Use the Right Language

Set the language that matches your congregation:
- Spanish (`es`) for Spanish-speaking congregations
- English (`en`) for English-speaking congregations
- Portuguese (`pt`) for Portuguese-speaking congregations

### 5. Test Your Configuration

After setting up, test that everything works:
```
jw!daily-text           # Test daily text
jw!news                 # Test news
jw!setlang              # Verify language
jw!setnews              # Verify news channel
jw!setdaily             # Verify schedule
```

---

## Troubleshooting

### Bot doesn't respond to admin commands

1. Verify you have **Administrator** permission
2. Check the bot is online
3. Make sure you're using the correct prefix

### News notifications not posting

1. Run `jw!setnews` to verify the channel is set
2. Check bot has permission to post in that channel
3. Wait for the next news check cycle (default: every 6 hours)
4. Check bot logs for errors

### Daily text not posting

1. Run `jw!setdaily` to verify the schedule
2. Check the bot's timezone setting
3. Ensure daily texts are loaded in the database
4. Verify bot has permission in the target channel

### Wrong language content

1. Run `jw!setlang` to check current setting
2. Set the correct language: `jw!setlang en`
3. Note: Language only affects new posts, not existing ones

### Channel not found error

1. Make sure to **mention** the channel (use #)
2. Verify the channel exists and bot can see it
3. Channel must be a text channel

### Permission denied

1. You need **Administrator** permission for config commands
2. Regular users cannot change server settings
3. Check your Discord role permissions

---

## Command Reference

| Command | Description | Example |
|---------|-------------|---------|
| `jw!setlang` | View current language | `jw!setlang` |
| `jw!setlang <code>` | Set language | `jw!setlang en` |
| `jw!setnews` | View news config | `jw!setnews` |
| `jw!setnews #channel` | Set news channel | `jw!setnews #news` |
| `jw!setnews off` | Disable news | `jw!setnews off` |
| `jw!setdaily` | View schedule | `jw!setdaily` |
| `jw!setdaily #ch H` | Set schedule | `jw!setdaily #daily 7` |
| `jw!setdaily off` | Disable schedule | `jw!setdaily off` |

---

## Need Help?

- Check the [Configuration Guide](CONFIGURATION.md) for environment variables
- Check the [User Guide](USER_GUIDE.md) for regular commands
- Report issues on [GitHub](https://github.com/jjuanrivvera99/jw-discord-bot/issues)
