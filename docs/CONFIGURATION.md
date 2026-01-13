# Configuration Guide

Complete reference for all environment variables and configuration options.

## Table of Contents

- [Environment Variables](#environment-variables)
  - [Required Settings](#required-settings)
  - [Bot Behavior](#bot-behavior)
  - [Scheduler Settings](#scheduler-settings)
  - [Monitoring](#monitoring)
- [Getting Discord Credentials](#getting-discord-credentials)
- [Database Setup](#database-setup)
- [Docker Configuration](#docker-configuration)
- [Adding Languages](#adding-languages)

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Settings

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Bot authentication token | `MTIzNDU2Nzg5...` |
| `DISCORD_BOT_ID` | Bot application ID | `123456789012345678` |
| `MONGO_DSN` | MongoDB connection string | `mongodb://localhost:27017/jw-bot` |

### Bot Behavior

| Variable | Description | Default |
|----------|-------------|---------|
| `PREFIX` | Command prefix | `jw!` |
| `DEFAULT_LANG` | Default language | `es` |
| `BOT_STATUS` | Activity text | `JW Broadcasting` |
| `BOT_STATUS_TYPE` | Activity type | `WATCHING` |

**PREFIX Examples:**
```env
PREFIX=jw!      # Commands: jw!daily-text, jw!news
PREFIX=!        # Commands: !daily-text, !news
PREFIX=bot      # Commands: botdaily-text, botnews
```

**BOT_STATUS_TYPE Options:**
- `PLAYING` - "Playing JW Broadcasting"
- `STREAMING` - "Streaming JW Broadcasting"
- `LISTENING` - "Listening to JW Broadcasting"
- `WATCHING` - "Watching JW Broadcasting"
- `COMPETING` - "Competing in JW Broadcasting"

### Scheduler Settings

| Variable | Description | Default |
|----------|-------------|---------|
| `SCHEDULER_TIMEZONE` | Timezone for schedules | `America/Bogota` |
| `NEWS_CRON` | News check frequency | `* */6 * * *` |

**Timezone Examples:**
```env
SCHEDULER_TIMEZONE=America/New_York      # Eastern US
SCHEDULER_TIMEZONE=America/Los_Angeles   # Pacific US
SCHEDULER_TIMEZONE=Europe/London         # UK
SCHEDULER_TIMEZONE=Europe/Madrid         # Spain
SCHEDULER_TIMEZONE=America/Sao_Paulo     # Brazil
SCHEDULER_TIMEZONE=Asia/Tokyo            # Japan
```

Find your timezone: [Wikipedia Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

**NEWS_CRON Examples:**
```env
NEWS_CRON=* */6 * * *    # Every 6 hours (default)
NEWS_CRON=0 */4 * * *    # Every 4 hours
NEWS_CRON=0 8,20 * * *   # At 8 AM and 8 PM
NEWS_CRON=0 * * * *      # Every hour
NEWS_CRON=*/30 * * * *   # Every 30 minutes
```

Build cron expressions: [crontab.guru](https://crontab.guru/)

### Monitoring

| Variable | Description | Required |
|----------|-------------|----------|
| `SENTRY_DSN` | Sentry error tracking | Optional |
| `INSPECTOR_KEY` | Inspector APM | Optional |

---

## Getting Discord Credentials

### 1. Create Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Enter a name (e.g., "JW Bot")
4. Click "Create"

### 2. Get Bot ID

1. In your application, go to "General Information"
2. Copy the **Application ID**
3. Set as `DISCORD_BOT_ID` in `.env`

### 3. Create Bot User

1. Go to "Bot" section in sidebar
2. Click "Add Bot"
3. Confirm by clicking "Yes, do it!"

### 4. Get Bot Token

1. In the Bot section, click "Reset Token"
2. Copy the token (keep it secret!)
3. Set as `DISCORD_TOKEN` in `.env`

### 5. Configure Intents

Enable these intents in the Bot section:
- ✅ Presence Intent (optional)
- ✅ Server Members Intent (optional)
- ✅ Message Content Intent (required)

### 6. Generate Invite URL

Use this format:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=274877991936&scope=bot
```

Required permissions (274877991936):
- Read Messages/View Channels
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions

---

## Database Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Configure connection:

```env
MONGO_DSN=mongodb://localhost:27017/jw-discord-bot
```

### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Add database user (username/password)
4. Whitelist your IP (or 0.0.0.0/0 for any IP)
5. Get connection string:

```env
MONGO_DSN=mongodb+srv://username:password@cluster.mongodb.net/jw-discord-bot
```

### Database Collections

The bot uses these collections (created automatically):

| Collection | Purpose |
|------------|---------|
| `guilds` | Server configurations |
| `schedules` | Scheduled tasks |
| `texts` | Daily texts |
| `news` | News articles |
| `topics` | Discussion topics |
| `commands` | Command definitions |

---

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  bot:
    build: .
    env_file: .env
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

  # Development container
  node:
    build: .
    command: tail -f /dev/null
    volumes:
      - .:/app
      - /app/node_modules
    env_file: .env

volumes:
  mongo-data:
```

### Running with Docker

```bash
# Production
docker-compose up -d bot

# Development (with shell access)
docker-compose up -d node
docker-compose exec node bash

# View logs
docker-compose logs -f bot

# Stop
docker-compose down
```

### Environment for Docker

When using Docker, you can use the MongoDB container:

```env
MONGO_DSN=mongodb://mongo:27017/jw-discord-bot
```

---

## Adding Languages

To add a new language, edit `src/config/languages.js`:

### 1. Add Language Configuration

```javascript
const languages = {
    // ... existing languages ...

    fr: {
        code: 'fr',
        name: 'Français',
        jwOrg: 'fr',
        wol: {
            lang: 'fr',
            region: 'r?',      // Find correct region code
            langParam: 'lp-?'  // Find correct language param
        },
        newsPath: 'actualites/temoins-de-jehovah',
        newsTitleKeyword: 'ACTUALITÉS',
        strings: {
            // Add all translated strings...
            dailyText: 'Texte du jour',
            // ...
        }
    }
};
```

### 2. Find JW.org Parameters

1. Go to JW.org in your target language
2. Navigate to the news section - note the URL path
3. Go to WOL (wol.jw.org) in your language
4. Perform a search and note the URL parameters:
   - `region` (e.g., r1, r4, r5)
   - `langParam` (e.g., lp-e, lp-s, lp-t)

### 3. Add All Translations

Copy the strings from an existing language and translate:

```javascript
strings: {
    dailyText: 'Translated text',
    noTextForDate: 'Translated text',
    consider: 'Translated text',
    // ... all other strings
}
```

### 4. Update Guild Model

Add new language code to the enum in `src/models/guild.model.js`:

```javascript
language: {
    type: String,
    enum: ['es', 'en', 'pt', 'fr', null],  // Add new code
    default: null
}
```

---

## Full .env Example

```env
# ============================================
# REQUIRED
# ============================================
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_BOT_ID=123456789012345678
MONGO_DSN=mongodb://localhost:27017/jw-discord-bot

# ============================================
# BOT BEHAVIOR
# ============================================
PREFIX=jw!
DEFAULT_LANG=es
BOT_STATUS=JW Broadcasting
BOT_STATUS_TYPE=WATCHING

# ============================================
# SCHEDULER
# ============================================
SCHEDULER_TIMEZONE=America/Bogota
NEWS_CRON=* */6 * * *

# ============================================
# MONITORING (optional)
# ============================================
SENTRY_DSN=
INSPECTOR_KEY=
```

---

## Troubleshooting

### Invalid token error

- Make sure you copied the entire token
- Reset the token and copy again
- Don't share your token publicly

### Cannot connect to MongoDB

- Check MongoDB is running
- Verify connection string format
- For Atlas: check IP whitelist and user credentials

### Timezone not working

- Use IANA timezone format (e.g., `America/New_York`)
- Check spelling and capitalization
- Verify timezone exists: [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Bot offline but no errors

- Check Discord token is valid
- Verify bot has Message Content Intent enabled
- Check for rate limiting

---

## Related Documentation

- [README](../README.md) - Quick start guide
- [User Guide](USER_GUIDE.md) - Command usage
- [Admin Guide](ADMIN_GUIDE.md) - Server configuration
