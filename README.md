# JW Discord Bot

A Discord bot that provides daily texts, news, and topics from JW.org for Jehovah's Witnesses communities. Supports multiple servers with per-server language configuration.

## Features

- **Daily Text** - Fetch and display the daily scripture text with pagination
- **News Feed** - Get the latest news from JW.org with automatic notifications
- **Topic Search** - Search the JW Online Library for any topic
- **Multi-Language** - Support for Spanish, English, and Portuguese
- **Per-Server Config** - Each server can have its own language and channel settings
- **Scheduled Posts** - Automatic daily texts and news notifications

## Quick Start

### Prerequisites

- Node.js 14+ (LTS recommended)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Discord Bot Token

### 1. Clone & Install

```bash
git clone https://github.com/jjuanrivvera99/jw-discord-bot.git
cd jw-discord-bot
npm install
```

### 2. Configure

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Required
DISCORD_TOKEN=your_bot_token_here
DISCORD_BOT_ID=your_bot_id_here
MONGO_DSN=mongodb://localhost:27017/jw-discord-bot

# Optional (defaults shown)
PREFIX=jw!
DEFAULT_LANG=es
SCHEDULER_TIMEZONE=America/Bogota
```

### 3. Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 4. Invite Bot to Server

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=274877991936&scope=bot
```

## Commands

| Command | Description |
|---------|-------------|
| `jw!daily-text` | Get today's daily text |
| `jw!daily-text 2024-01-15` | Get daily text for specific date |
| `jw!news` | Get latest news from JW.org |
| `jw!topic bible` | Search for a topic |
| `jw!topic random` | Get a random topic |
| `jw!help` | Show available commands |
| `jw!ping` | Check bot latency |
| `jw!date` | Show current date/time |

### Admin Commands

| Command | Description |
|---------|-------------|
| `jw!setlang en` | Set server language (es/en/pt) |
| `jw!setnews #channel` | Set news notification channel |
| `jw!setdaily #channel 7` | Schedule daily text at 7:00 AM |

## Docker

```bash
# Development
docker-compose up node

# Production
docker-compose up bot
```

## Documentation

- [User Guide](docs/USER_GUIDE.md) - How to use bot commands
- [Admin Guide](docs/ADMIN_GUIDE.md) - Server configuration
- [Configuration](docs/CONFIGURATION.md) - All environment variables

## Project Structure

```
jw-discord-bot/
├── src/
│   ├── app.js              # Main bot module
│   ├── commands/           # Bot commands
│   │   ├── config/         # Admin commands (setnews, setdaily, setlang)
│   │   ├── jw/             # JW commands (daily-text, news, topic)
│   │   └── misc/           # Utility commands (help, ping, date)
│   ├── config/
│   │   └── languages.js    # Language configuration & translations
│   ├── events/             # Discord event handlers
│   ├── helpers/            # Business logic
│   └── models/             # MongoDB schemas
├── docs/                   # Documentation
├── .env.example            # Environment template
└── docker-compose.yml
```

## How It Works

### Multi-Server Architecture

The bot can run on multiple Discord servers simultaneously. Each server can configure:
- **Language** - Bot responses and JW.org content language
- **News Channel** - Where to post news notifications
- **Daily Text Schedule** - When to post daily text

### Scheduled Tasks

Two cron jobs run automatically:
1. **News Checker** - Checks JW.org RSS feeds for new articles (configurable interval)
2. **Daily Text Poster** - Posts daily text to configured channels at scheduled times

### Language Support

| Code | Language | JW.org Content |
|------|----------|----------------|
| `es` | Español | Spanish |
| `en` | English | English |
| `pt` | Português | Portuguese |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC
