# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**JW Discord Bot** - A Discord bot that provides daily texts, news, and topics from JW.org for Jehovah's Witnesses communities.

### JW Discord Ecosystem

This bot is part of a 3-project ecosystem:

| Project | Description | Stack |
|---------|-------------|-------|
| `jw-discord-bot` | **This project** - Discord bot that users interact with | Node.js, Discord.js v12, MongoDB |
| `jw-discord-api` | REST API backend for web dashboard | Express, Awilix DI, JWT auth |
| `jw-discord-frontend` | Web dashboard for bot management | Vue.js 2, Vuetify, Metronic |

**Shared Resources:**
- All three projects connect to the **same MongoDB database**
- Models/schemas should be kept in sync across projects
- The API provides OAuth2 authentication via Discord

---

## Quick Reference

```bash
# Install
npm install

# Development (with nodemon)
npm run dev

# Production
npm start

# Docker
docker-compose up node   # Development shell
docker-compose up bot    # Production
```

---

## Architecture

### File Structure

```
src/
├── app.js                    # Main bot module (command loading, schedulers)
├── commands/                 # Bot commands (organized by category)
│   ├── config/               # Admin commands (setnews, setdaily, setlang)
│   ├── jw/                   # JW commands (daily-text, news, topic)
│   └── misc/                 # Utility commands (help, ping, date)
├── config/
│   ├── db.js                 # Database configuration
│   └── languages.js          # Multi-language support (ES, EN, PT)
├── events/                   # Discord event handlers
│   ├── message.event.js      # Command processing
│   └── ready.event.js        # Bot initialization
├── helpers/                  # Business logic
│   ├── guild.helper.js       # Per-guild configuration
│   ├── jw.helper.js          # JW.org content fetching
│   ├── news.helper.js        # News distribution
│   └── schedule.helper.js    # Scheduled actions
├── models/                   # Mongoose schemas
│   ├── guild.model.js        # Server configuration
│   ├── schedule.model.js     # Scheduled tasks
│   ├── text.model.js         # Daily texts
│   ├── new.model.js          # News articles
│   └── topic.model.js        # Discussion topics
└── util/                     # Utilities
    ├── pagination-embed.js   # Paginated embeds
    └── rss-feed.js           # RSS parser
```

### Key Patterns

**Command Structure:**
```javascript
// Every command exports run() and config
module.exports.run = async (message, args) => {
    // Get per-guild language
    const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
    const lang = getLanguage(langCode);

    // Command logic here
};

module.exports.config = {
    name: "Command Name",
    command: "command-trigger"
};
```

**Per-Guild Language:**
```javascript
// Always use GuildHelper for translations
const langCode = await GuildHelper.getGuildLanguage(message.guild.id);
const lang = getLanguage(langCode);
// Use lang.strings.key for translated strings
```

**Channel References:**
```javascript
// ALWAYS use channel ID, never channel name
// Correct:
guild.channels.cache.get(channelId)

// Avoid:
guild.channels.cache.find(ch => ch.name === channelName)
```

---

## Key Components

### Language System (`src/config/languages.js`)

Central configuration for multi-language support:
- `getLanguage(code)` - Get language config
- `getString(key, code)` - Get translated string
- `getNewsRssUrl(code)` - Build language-specific RSS URL
- `getWolSearchUrl(query, code)` - Build WOL search URL
- `EMBED_COLORS` - Standard embed colors

### Guild Helper (`src/helpers/guild.helper.js`)

Per-server configuration:
- `getGuildLanguage(guildId)` - Get server's language
- `setGuildLanguage(guildId, name, lang)` - Set language
- `getGuildConfig(guildId)` - Get full config

### Schedulers (`src/app.js`)

Two cron jobs:
1. **News checker** - Checks RSS feeds, broadcasts to configured channels
2. **Daily scheduler** - Runs every minute, checks for scheduled actions

---

## Database Models

### Guild (Server Configuration)
```javascript
{
    id: String,                    // Discord guild ID (unique)
    name: String,                  // Guild name
    newsNotificationChannelId: String, // Channel ID for news
    prefix: String,                // Custom prefix (optional)
    language: String               // 'es' | 'en' | 'pt' (optional)
}
```

### Schedule (Scheduled Tasks)
```javascript
{
    guild: String,                 // Discord guild ID
    channelId: String,             // Channel ID to post in
    time: String,                  // Hour (24h format: "07", "19")
    action: String,                // 'sendDailyText' | 'sendRandomTopic'
    last: String                   // Last execution date (YYYY-MM-DD)
}
```

### Text (Daily Texts)
```javascript
{
    date: String,                  // YYYY-MM-DD format
    text: String,                  // Scripture reference
    textContent: String,           // Bible verse
    explanation: String            // Commentary
}
```

### New (News Articles)
```javascript
{
    title: String,
    link: String,
    isoDate: String,
    language: String,              // 'es' | 'en' | 'pt'
    last: Boolean                  // Is most recent for language
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISCORD_TOKEN` | Yes | - | Bot token |
| `DISCORD_BOT_ID` | Yes | - | Bot application ID |
| `MONGO_DSN` | Yes | - | MongoDB connection |
| `PREFIX` | No | `jw!` | Command prefix |
| `DEFAULT_LANG` | No | `es` | Default language |
| `SCHEDULER_TIMEZONE` | No | `America/Bogota` | Timezone for schedules |
| `NEWS_CRON` | No | `* */6 * * *` | News check frequency |
| `BOT_STATUS` | No | `JW Broadcasting` | Bot activity text |
| `BOT_STATUS_TYPE` | No | `WATCHING` | Activity type |
| `SENTRY_DSN` | No | - | Error tracking |

---

## Development Guidelines

### Adding a New Command

1. Create file in appropriate folder (`commands/jw/`, `commands/misc/`, or `commands/config/`)
2. Use the standard structure with `run` and `config` exports
3. Get guild language at the start
4. Use `lang.strings.key` for all user-facing text
5. Add any new strings to `languages.js` for all 3 languages

### Modifying Models

**Important:** Models are shared with `jw-discord-api`. When changing:
1. Update the model in this project
2. Update the corresponding model in `jw-discord-api`
3. Consider migration for existing data

### Adding Translations

Add strings to ALL languages in `src/config/languages.js`:
```javascript
// Spanish
es: { strings: { newKey: 'Spanish text' } },
// English
en: { strings: { newKey: 'English text' } },
// Portuguese
pt: { strings: { newKey: 'Portuguese text' } }
```

### Testing

No automated tests configured. Test manually:
1. Start bot: `npm run dev`
2. Test commands in a Discord server
3. Check console for errors
4. Verify database changes in MongoDB

---

## Common Tasks

### Add a new language
1. Add language config in `languages.js`
2. Add language to enum in `guild.model.js`
3. Find JW.org/WOL URL parameters for that language

### Import daily texts
```javascript
// Use MongoDB directly or create a script
const texts = require('./output.json');
await Text.insertMany(texts);
```

### Debug scheduled tasks
- Check `SCHEDULER_TIMEZONE` matches expected
- Verify schedule documents in MongoDB
- Check bot console for scheduler logs

---

## Important Notes

- **Discord.js v12** - Not the latest v14, APIs differ significantly
- **Message-based commands** - Not slash commands
- **Channel IDs** - Always use IDs, not names (channels can be renamed)
- **Per-guild language** - Every command should support it
- **Shared database** - Changes affect API and frontend too

---

## Related Projects

- **jw-discord-api** (`../jw-discord-api/`)
  - REST API for web dashboard
  - Discord OAuth2 authentication
  - Same MongoDB database

- **jw-discord-frontend** (`../jw-discord-frontend/`)
  - Vue.js web dashboard
  - Server management UI
  - Connects to jw-discord-api

---

## Documentation

- [README.md](README.md) - Quick start guide
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) - Command usage
- [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) - Server configuration
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md) - Environment variables
