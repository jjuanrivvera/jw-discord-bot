# Discord.js v12 to v14 Migration Plan

This document provides a detailed, step-by-step plan for upgrading the JW Discord Bot from Discord.js v12 to v14.

## Table of Contents

- [Overview](#overview)
- [Pre-Migration Checklist](#pre-migration-checklist)
- [Phase 1: Environment Setup](#phase-1-environment-setup)
- [Phase 2: Core Infrastructure](#phase-2-core-infrastructure)
- [Phase 3: Embed System Updates](#phase-3-embed-system-updates)
- [Phase 4: Pagination System Rewrite](#phase-4-pagination-system-rewrite)
- [Phase 5: Command Updates](#phase-5-command-updates)
- [Phase 6: Helper Updates](#phase-6-helper-updates)
- [Phase 7: Testing](#phase-7-testing)
- [Phase 8: Deployment](#phase-8-deployment)
- [Optional: Slash Commands Migration](#optional-slash-commands-migration)
- [Rollback Plan](#rollback-plan)

---

## Overview

| Aspect | Current | Target |
|--------|---------|--------|
| Discord.js | v12.5.3 | v14.x |
| Node.js | v14+ | v18+ (LTS) |
| Command System | Prefix-based | Prefix-based (slash optional) |
| API Version | v6 | v10 |

**Total Estimated Effort:** 10-14 hours

**Risk Level:** Medium - Breaking changes are well-documented but require careful testing

---

## Pre-Migration Checklist

### Discord Developer Portal

- [ ] Go to [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Select your bot application
- [ ] Navigate to "Bot" section
- [ ] Enable **Privileged Gateway Intents**:
  - [ ] `MESSAGE CONTENT INTENT` (REQUIRED for prefix commands)
  - [ ] `SERVER MEMBERS INTENT` (if needed)
  - [ ] `PRESENCE INTENT` (if needed)

### Development Environment

- [ ] Backup current codebase (git commit all changes)
- [ ] Create a new git branch: `git checkout -b feature/discord-js-v14`
- [ ] Update Node.js to v18+ LTS
- [ ] Create a test bot application in Discord Developer Portal
- [ ] Create a private Discord server for testing
- [ ] Document current bot token (keep secure)

### Verification Commands

```bash
# Check Node.js version (must be 18+)
node --version

# Check current Discord.js version
npm list discord.js

# Create backup branch
git checkout -b backup/pre-v14-migration
git checkout -b feature/discord-js-v14
```

---

## Phase 1: Environment Setup

**Estimated Time:** 30 minutes

### Step 1.1: Update package.json

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "discord.js": "^14.14.1"
  }
}
```

### Step 1.2: Install Dependencies

```bash
# Remove node_modules and package-lock.json for clean install
rm -rf node_modules package-lock.json

# Install updated dependencies
npm install
```

### Step 1.3: Verify Installation

```bash
npm list discord.js
# Should show discord.js@14.x.x
```

---

## Phase 2: Core Infrastructure

**Estimated Time:** 1-2 hours

### Step 2.1: Update Client Initialization

**File:** `src/app.js`

**Current Code (v12):**
```javascript
const { Client, Collection } = require("discord.js");
const discordClient = new Client();
```

**Updated Code (v14):**
```javascript
const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    Events
} = require("discord.js");

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,        // REQUIRED for prefix commands
        GatewayIntentBits.GuildMessageReactions, // For pagination
        GatewayIntentBits.DirectMessages         // For DM support (if needed)
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});
```

### Step 2.2: Update Event Names

**File:** `src/events/message.event.js`

**Current:**
```javascript
module.exports = {
    name: 'message',
    async execute(message, client) {
        // ...
    }
};
```

**Updated:**
```javascript
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,  // 'message' -> Events.MessageCreate
    async execute(message, client) {
        // Rest remains the same
    }
};
```

**File:** `src/events/ready.event.js`

**Current:**
```javascript
module.exports = {
    name: 'ready',
    execute(client) {
        // ...
    }
};
```

**Updated:**
```javascript
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,  // 'ready' -> Events.ClientReady
    once: true,                 // Add this for one-time events
    execute(client) {
        // Rest remains the same
    }
};
```

### Step 2.3: Update Event Registration in app.js

**Current:**
```javascript
discordClient.on(event.name, (...args) => event.execute(...args, discordClient));
```

**Updated:**
```javascript
if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args, discordClient));
} else {
    discordClient.on(event.name, (...args) => event.execute(...args, discordClient));
}
```

---

## Phase 3: Embed System Updates

**Estimated Time:** 2-3 hours

### Step 3.1: Global Search and Replace

Search for all files containing `MessageEmbed`:

```bash
grep -r "MessageEmbed" src/
```

### Step 3.2: Import Changes

**Every file using embeds needs this change:**

**Current:**
```javascript
const { MessageEmbed } = require('discord.js');
```

**Updated:**
```javascript
const { EmbedBuilder } = require('discord.js');
```

### Step 3.3: Constructor Changes

**Current:**
```javascript
const embed = new MessageEmbed()
```

**Updated:**
```javascript
const embed = new EmbedBuilder()
```

### Step 3.4: Method Signature Changes

#### addField() -> addFields()

**Current:**
```javascript
embed.addField('Title', 'Value', true);
embed.addField('Title2', 'Value2', false);
```

**Updated:**
```javascript
embed.addFields([
    { name: 'Title', value: 'Value', inline: true },
    { name: 'Title2', value: 'Value2', inline: false }
]);
```

#### setFooter()

**Current:**
```javascript
embed.setFooter('Footer text');
embed.setFooter('Footer text', 'https://icon.url');
```

**Updated:**
```javascript
embed.setFooter({ text: 'Footer text' });
embed.setFooter({ text: 'Footer text', iconURL: 'https://icon.url' });
```

#### setAuthor()

**Current:**
```javascript
embed.setAuthor('Author name', 'https://icon.url', 'https://link.url');
```

**Updated:**
```javascript
embed.setAuthor({
    name: 'Author name',
    iconURL: 'https://icon.url',
    url: 'https://link.url'
});
```

### Step 3.5: Message Sending with Embeds

**Current:**
```javascript
message.channel.send(embed);
channel.send(embed);
```

**Updated:**
```javascript
message.channel.send({ embeds: [embed] });
channel.send({ embeds: [embed] });
```

### Files to Update

| File | Changes Needed |
|------|----------------|
| `src/commands/jw/daily-text.command.js` | EmbedBuilder, addFields, setFooter, send() |
| `src/commands/jw/news.command.js` | EmbedBuilder, addFields, send() |
| `src/commands/jw/topic.command.js` | EmbedBuilder, addFields, send() |
| `src/commands/jw/last-new.command.js` | EmbedBuilder, addFields, send() |
| `src/commands/misc/avatar.command.js` | EmbedBuilder, setFooter, send() |
| `src/commands/misc/date.command.js` | EmbedBuilder, send() |
| `src/commands/misc/help.command.js` | EmbedBuilder, addFields, send() |
| `src/helpers/jw.helper.js` | EmbedBuilder (if creates embeds) |
| `src/helpers/news.helper.js` | EmbedBuilder, send() |
| `src/helpers/schedule.helper.js` | EmbedBuilder, send() |

---

## Phase 4: Pagination System Rewrite

**Estimated Time:** 2-3 hours

**File:** `src/util/pagination-embed.js`

This file requires the most extensive changes.

### Current Implementation Issues

1. `.setFooter()` signature changed
2. `.send(embed)` -> `.send({ embeds: [embed] })`
3. `.createReactionCollector()` signature changed
4. `.deleted` property removed
5. Message deletion timeout syntax changed

### Complete Rewritten Code

```javascript
const paginationEmbed = async (channel, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
    if (!channel) throw new Error('Channel is inaccessible.');
    if (!pages || pages.length === 0) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');

    let page = 0;

    // Update footer and send first page
    const getPageEmbed = (pageIndex) => {
        return pages[pageIndex].setFooter({
            text: `Page ${pageIndex + 1} / ${pages.length}`
        });
    };

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

    // Create collector with new options syntax
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

        // Edit message with new page
        try {
            await curPage.edit({
                embeds: [getPageEmbed(page)]
            });
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    });

    reactionCollector.on('end', async () => {
        // Remove all reactions when collector ends
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
```

### Alternative: Button-Based Pagination (Recommended)

For better UX, consider migrating to buttons:

```javascript
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const paginationEmbed = async (channel, pages, timeout = 120000) => {
    if (!channel) throw new Error('Channel is inaccessible.');
    if (!pages || pages.length === 0) throw new Error('Pages are not given.');

    let page = 0;

    const getPageEmbed = (pageIndex) => {
        return pages[pageIndex].setFooter({
            text: `Page ${pageIndex + 1} / ${pages.length}`
        });
    };

    // Create buttons
    const getButtons = (disabled = false) => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('⏪')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(disabled),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('⏩')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(disabled)
        );
    };

    // If only one page, no buttons needed
    if (pages.length === 1) {
        return channel.send({ embeds: [getPageEmbed(0)] });
    }

    const curPage = await channel.send({
        embeds: [getPageEmbed(page)],
        components: [getButtons()]
    });

    const collector = curPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: timeout
    });

    collector.on('collect', async (interaction) => {
        // Update page index
        if (interaction.customId === 'prev') {
            page = page > 0 ? page - 1 : pages.length - 1;
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? page + 1 : 0;
        }

        await interaction.update({
            embeds: [getPageEmbed(page)],
            components: [getButtons()]
        });
    });

    collector.on('end', async () => {
        try {
            await curPage.edit({
                embeds: [getPageEmbed(page)],
                components: [getButtons(true)] // Disable buttons
            });
        } catch (error) {
            console.error('Failed to disable buttons:', error);
        }
    });

    return curPage;
};

module.exports = paginationEmbed;
```

---

## Phase 5: Command Updates

**Estimated Time:** 2-3 hours

### Checklist for Each Command File

For each file in `src/commands/`:

- [ ] Update `require('discord.js')` imports
- [ ] Change `MessageEmbed` to `EmbedBuilder`
- [ ] Update `.addField()` calls to `.addFields([])`
- [ ] Update `.setFooter()` calls
- [ ] Update `.setAuthor()` calls (if used)
- [ ] Update `.send(embed)` to `.send({ embeds: [embed] })`
- [ ] Test the command

### Command-by-Command Updates

#### daily-text.command.js

```javascript
// Before
const { MessageEmbed } = require('discord.js');
// After
const { EmbedBuilder } = require('discord.js');

// Before
const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .addField('Scripture', scripture)
    .setFooter('JW.org');
// After
const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .addFields([{ name: 'Scripture', value: scripture }])
    .setFooter({ text: 'JW.org' });
```

#### help.command.js

```javascript
// Before
commands.forEach(cmd => {
    embed.addField(cmd.name, cmd.description, true);
});
// After
const fields = commands.map(cmd => ({
    name: cmd.name,
    value: cmd.description,
    inline: true
}));
embed.addFields(fields);
```

---

## Phase 6: Helper Updates

**Estimated Time:** 1-2 hours

### news.helper.js

Update any embed creation and channel sending:

```javascript
// Before
channel.send(newsEmbed);

// After
channel.send({ embeds: [newsEmbed] });
```

### schedule.helper.js

Same pattern - update send calls:

```javascript
// Before
channel.send(dailyTextEmbed);

// After
channel.send({ embeds: [dailyTextEmbed] });
```

### jw.helper.js

This helper creates embeds for daily texts and topics. Complete migration required:

**Current Code (v12):**
```javascript
const { MessageEmbed } = require('discord.js');
const { Text, Topic } = require('../models');
const Sentry = require('../../sentry');
const { getLanguage, getWolSearchUrl, EMBED_COLORS, DEFAULT_LANG } = require('../config/languages');

const chunkString = (str, len) => {
    const size = Math.ceil(str.length / len);
    const result = Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        result[i] = str.substring(offset, offset + len);
        offset += len;
    }

    return result;
};

module.exports = {
    async getDailyText(dateString, langCode = DEFAULT_LANG) {
        const lang = getLanguage(langCode);
        const text = await Text.findOne({ date: dateString });

        if (!text) {
            console.log(`[${langCode}] ${lang.strings.couldNotGetText}`);
            return;
        }

        const embeds = [];
        const chunks = chunkString(`${text.explanation}`, 1024);

        chunks.forEach(chunk => {
            const dailyText = new MessageEmbed()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(lang.strings.dailyText)
                .addField(`${text.textContent} ${text.text}`, `${chunk}`);

            embeds.push(dailyText);
        });

        return embeds;
    },

    async getRandomTopic() {
        const topicCount = await Topic.countDocuments();
        const random = Math.floor(Math.random() * topicCount);
        const topic = await Topic.findOne().skip(random);

        return topic;
    },

    async sendRandomTopic(channel, langCode = DEFAULT_LANG) {
        try {
            const lang = getLanguage(langCode);
            const topic = await this.getRandomTopic();

            if (!topic) {
                console.log(`[${langCode}] No topics found`);
                return;
            }

            const topicEmbed = new MessageEmbed()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(topic.name)
                .addFields(
                    { name: lang.strings.consider, value: topic.discussion },
                    { name: lang.strings.search, value: getWolSearchUrl(topic.query, langCode) }
                );

            return channel.send(topicEmbed);
        } catch (err) {
            console.error('Error sending random topic:', err);
            Sentry.captureException(err);
        }
    }
};
```

**Updated Code (v14):**
```javascript
const { EmbedBuilder } = require('discord.js');
const { Text, Topic } = require('../models');
const Sentry = require('../../sentry');
const { getLanguage, getWolSearchUrl, EMBED_COLORS, DEFAULT_LANG } = require('../config/languages');

/**
 * Split a string into chunks of specified length
 * @param {string} str - String to split
 * @param {number} len - Maximum length of each chunk
 * @returns {Array<string>} Array of string chunks
 */
const chunkString = (str, len) => {
    const size = Math.ceil(str.length / len);
    const result = Array(size);
    let offset = 0;

    for (let i = 0; i < size; i++) {
        result[i] = str.substring(offset, offset + len);
        offset += len;
    }

    return result;
};

module.exports = {
    /**
     * Get daily text embeds for a specific date
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @param {string} langCode - Language code (default: DEFAULT_LANG)
     * @returns {Array<EmbedBuilder>|undefined} Array of embeds or undefined if not found
     */
    async getDailyText(dateString, langCode = DEFAULT_LANG) {
        const lang = getLanguage(langCode);
        const text = await Text.findOne({ date: dateString });

        if (!text) {
            console.log(`[${langCode}] ${lang.strings.couldNotGetText}`);
            return;
        }

        const embeds = [];
        const chunks = chunkString(`${text.explanation}`, 1024);

        chunks.forEach(chunk => {
            // EmbedBuilder replaces MessageEmbed
            // addField() is replaced with addFields([])
            const dailyText = new EmbedBuilder()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(lang.strings.dailyText)
                .addFields([
                    { name: `${text.textContent} ${text.text}`, value: `${chunk}` }
                ]);

            embeds.push(dailyText);
        });

        return embeds;
    },

    /**
     * Get a random topic from the database
     * @returns {Object} Topic document
     */
    async getRandomTopic() {
        const topicCount = await Topic.countDocuments();
        const random = Math.floor(Math.random() * topicCount);
        const topic = await Topic.findOne().skip(random);

        return topic;
    },

    /**
     * Send a random topic to a channel
     * @param {Channel} channel - Discord channel to send to
     * @param {string} langCode - Language code (default: DEFAULT_LANG)
     */
    async sendRandomTopic(channel, langCode = DEFAULT_LANG) {
        try {
            const lang = getLanguage(langCode);
            const topic = await this.getRandomTopic();

            if (!topic) {
                console.log(`[${langCode}] No topics found`);
                return;
            }

            // EmbedBuilder replaces MessageEmbed
            const topicEmbed = new EmbedBuilder()
                .setColor(EMBED_COLORS.PRIMARY)
                .setTitle(topic.name)
                .addFields([
                    { name: lang.strings.consider, value: topic.discussion },
                    { name: lang.strings.search, value: getWolSearchUrl(topic.query, langCode) }
                ]);

            // send(embed) becomes send({ embeds: [embed] })
            return channel.send({ embeds: [topicEmbed] });
        } catch (err) {
            console.error('Error sending random topic:', err);
            Sentry.captureException(err);
        }
    }
};
```

**Key Changes Summary:**

| Line | Change | Description |
|------|--------|-------------|
| 1 | `MessageEmbed` → `EmbedBuilder` | Import rename |
| 35-38 | `.addField(name, value)` → `.addFields([{ name, value }])` | Method signature change in getDailyText |
| 63 | `new MessageEmbed()` → `new EmbedBuilder()` | Constructor change in sendRandomTopic |
| 64-67 | `.addFields(...)` → `.addFields([...])` | Wrap in array (already correct syntax, just ensure array) |
| 70 | `channel.send(embed)` → `channel.send({ embeds: [embed] })` | Send method signature |

---

## Phase 7: Testing

**Estimated Time:** 2-3 hours

### Test Environment Setup

1. Create test `.env.test` with test bot token
2. Use private Discord server for testing
3. Test each feature systematically

### Testing Checklist

#### Core Functionality
- [ ] Bot comes online
- [ ] Bot shows correct status
- [ ] No console errors on startup

#### Commands (Test Each)
- [ ] `jw!daily-text` - Displays correctly with pagination
- [ ] `jw!daily-text 2024-01-15` - Date parameter works
- [ ] `jw!news` - Fetches and displays news
- [ ] `jw!last-new` - Shows last stored news
- [ ] `jw!topic bible study` - Returns search link
- [ ] `jw!topic random` - Shows random topic
- [ ] `jw!help` - Displays all commands
- [ ] `jw!ping` - Shows latency
- [ ] `jw!date` - Shows current date
- [ ] `jw!avatar` - Shows user avatar

#### Admin Commands
- [ ] `jw!setlang es/en/pt` - Changes language
- [ ] `jw!setnews #channel` - Sets news channel
- [ ] `jw!setdaily #channel 7` - Sets daily schedule

#### Pagination
- [ ] Reaction buttons appear
- [ ] Previous (⏪) works
- [ ] Next (⏩) works
- [ ] Page numbers update
- [ ] Reactions removed after timeout

#### Scheduled Tasks
- [ ] News checker runs (wait for cron or trigger manually)
- [ ] Daily text posts at scheduled time
- [ ] Correct channel receives posts
- [ ] Correct language used

#### Error Handling
- [ ] Invalid commands show error message
- [ ] Missing permissions handled gracefully
- [ ] Network errors don't crash bot

### Automated Test Script

```javascript
// test/manual-test.js
const commands = [
    'jw!ping',
    'jw!help',
    'jw!date',
    'jw!daily-text',
    'jw!news',
    'jw!topic prayer'
];

console.log('Manual Test Checklist:');
commands.forEach((cmd, i) => {
    console.log(`${i + 1}. Test: ${cmd}`);
});
```

---

## Phase 8: Deployment

**Estimated Time:** 1-2 hours

### Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Commit all changes
- [ ] Create pull request (optional)
- [ ] Merge to main branch

### Deployment Steps

```bash
# 1. Ensure clean state
git status

# 2. Commit all changes
git add .
git commit -m "Upgrade Discord.js from v12 to v14"

# 3. Merge to main (if using branches)
git checkout main
git merge feature/discord-js-v14

# 4. Push to remote
git push origin main

# 5. Deploy to server
# (Railway, Heroku, VPS - depends on your setup)
```

### Post-Deployment Monitoring

1. Watch logs for first 30 minutes
2. Test commands in production server
3. Check Sentry for new errors
4. Monitor scheduled tasks

### Platform-Specific Deployment Examples

#### Railway Deployment

Create `railway.json` in project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci --production"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": null,
    "healthcheckTimeout": 300
  }
}
```

Environment variables in Railway dashboard:
```
DISCORD_TOKEN=your_bot_token
DISCORD_BOT_ID=your_bot_id
MONGO_DSN=mongodb+srv://...
PREFIX=jw!
DEFAULT_LANG=es
SCHEDULER_TIMEZONE=America/Bogota
SENTRY_DSN=https://...@sentry.io/...
```

Deploy commands:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up
```

#### Docker/VPS Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  bot:
    build: .
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - DISCORD_BOT_ID=${DISCORD_BOT_ID}
      - MONGO_DSN=${MONGO_DSN}
      - PREFIX=${PREFIX:-jw!}
      - DEFAULT_LANG=${DEFAULT_LANG:-es}
      - SCHEDULER_TIMEZONE=${SCHEDULER_TIMEZONE:-America/Bogota}
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      - mongo
    networks:
      - bot-network

  mongo:
    image: mongo:6
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db
    networks:
      - bot-network

volumes:
  mongo-data:

networks:
  bot-network:
    driver: bridge
```

Deploy commands:
```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f bot

# Restart after code changes
docker-compose restart bot

# Stop
docker-compose down
```

**Systemd Service (for bare-metal VPS):**

Create `/etc/systemd/system/jw-discord-bot.service`:
```ini
[Unit]
Description=JW Discord Bot
After=network.target mongodb.service

[Service]
Type=simple
User=botuser
Group=botuser
WorkingDirectory=/opt/jw-discord-bot
ExecStart=/usr/bin/node /opt/jw-discord-bot/src/app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=jw-discord-bot

# Environment file
EnvironmentFile=/opt/jw-discord-bot/.env

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Systemd commands:
```bash
# Reload systemd configuration
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable jw-discord-bot

# Start the service
sudo systemctl start jw-discord-bot

# Check status
sudo systemctl status jw-discord-bot

# View logs
sudo journalctl -u jw-discord-bot -f

# Restart after update
sudo systemctl restart jw-discord-bot
```

#### PM2 Deployment (Node.js Process Manager)

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'jw-discord-bot',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

PM2 commands:
```bash
# Install PM2 globally
npm install -g pm2

# Start in production mode
pm2 start ecosystem.config.js --env production

# Save process list for auto-restart on reboot
pm2 save
pm2 startup

# View logs
pm2 logs jw-discord-bot

# Restart after code changes
pm2 restart jw-discord-bot

# Monitor resources
pm2 monit

# Stop
pm2 stop jw-discord-bot
```

#### Vercel (Not Recommended)

**Note:** Vercel is designed for serverless functions and is NOT recommended for Discord bots because:
- Discord bots require persistent WebSocket connections
- Serverless functions have execution time limits (10-60 seconds)
- Scheduled tasks won't work reliably

If you must use Vercel, consider using it only for the web dashboard (jw-discord-frontend) and deploy the bot on Railway or a VPS.

---

## Optional: Slash Commands Migration

If you want to also migrate to slash commands (recommended for future):

### Benefits
- No `MessageContent` intent required
- Better UX with autocomplete
- Officially supported by Discord
- Built-in command documentation

### Effort: Additional 6-8 hours

### Example Slash Command

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily-text')
        .setDescription('Get the daily text from JW.org')
        .addStringOption(option =>
            option
                .setName('date')
                .setDescription('Date in YYYY-MM-DD format (optional)')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply(); // Show loading state

        const date = interaction.options.getString('date') ||
                     moment().format('YYYY-MM-DD');

        // ... existing logic to get daily text ...

        await interaction.editReply({ embeds: dailyTextEmbeds });
    }
};
```

### Registration Script

```javascript
// scripts/register-commands.js
const { REST, Routes } = require('discord.js');

const commands = [
    // Load all slash command data
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_BOT_ID),
        { body: commands }
    );
    console.log('Slash commands registered!');
})();
```

---

## Rollback Plan

If critical issues arise:

### Quick Rollback

```bash
# 1. Switch back to old code
git checkout backup/pre-v14-migration

# 2. Reinstall old dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Restart bot
npm start
```

### Gradual Rollback

If only specific features break:
1. Identify the breaking change
2. Check v12 code for that feature
3. Apply targeted fix
4. Don't revert entire upgrade

---

## Resources

- [Discord.js Guide - Updating to v14](https://discordjs.guide/additional-info/changes-in-v14.html)
- [Discord.js Guide - Updating to v13](https://v13.discordjs.guide/additional-info/changes-in-v13.html)
- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Gateway Intents FAQ](https://support-dev.discord.com/hc/en-us/articles/4404772028055)

---

## Summary

| Phase | Task | Effort |
|-------|------|--------|
| 1 | Environment Setup | 30 min |
| 2 | Core Infrastructure | 1-2 hours |
| 3 | Embed System | 2-3 hours |
| 4 | Pagination System | 2-3 hours |
| 5 | Command Updates | 2-3 hours |
| 6 | Helper Updates | 1-2 hours |
| 7 | Testing | 2-3 hours |
| 8 | Deployment | 1-2 hours |
| **Total** | | **10-14 hours** |

**Critical Success Factor:** Enable `MessageContent` privileged intent in Discord Developer Portal before testing.
