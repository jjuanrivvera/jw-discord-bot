# JW Discord API - Development Plan

This document provides a detailed development plan for completing the jw-discord-api project.

## Table of Contents

- [Overview](#overview)
- [Current State Analysis](#current-state-analysis)
- [Phase 1: Model Synchronization](#phase-1-model-synchronization)
- [Phase 2: Guild Configuration Endpoints](#phase-2-guild-configuration-endpoints)
- [Phase 3: Schedule Management Endpoints](#phase-3-schedule-management-endpoints)
- [Phase 4: Dashboard & Statistics](#phase-4-dashboard--statistics)
- [Phase 5: Content Endpoints](#phase-5-content-endpoints)
- [Phase 6: Security & Polish](#phase-6-security--polish)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)

---

## Overview

| Aspect | Current | Target |
|--------|---------|--------|
| Completion | 40% | 100% |
| Endpoints | 5 | 20+ |
| Models | 7 (outdated) | 7 (synced) |
| Documentation | None | OpenAPI/Swagger |

**Architecture:** Express.js + Awilix DI + MongoDB (Mongoose)

**Related Projects:**
- `jw-discord-bot` - Shares MongoDB database
- `jw-discord-frontend` - Consumes this API

---

## Current State Analysis

### Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| Express server | Working | With middleware stack |
| Awilix DI | Working | Container configured |
| Discord OAuth2 | Working | Login flow complete |
| JWT tokens | Working | Auth middleware exists |
| User endpoints | Basic | CRUD exists |
| Guild list | Working | Fetches from Discord API |

### Existing Endpoints

```
POST /api/v1/auth/login      # Exchange OAuth code for JWT
POST /api/v1/auth/discord    # Generate OAuth URL
GET  /api/v1/guilds          # List user's guilds
GET  /api/v1/guilds/:id      # Get guild details
GET  /api/v1/users           # List users
```

### Architecture Pattern

```
Routes → Controllers → Services → Repositories → Models
                          ↓
                     Discord API (via discord.js client)
```

### Current File Structure

```
src/
├── api/
│   ├── base.api.js          # HTTP client base
│   └── discord.api.js       # Discord API wrapper
├── config/
│   └── index.js             # Environment config
├── controllers/
│   ├── auth.controller.js   # Auth endpoints
│   ├── guild.controller.js  # Guild endpoints
│   └── user.controller.js   # User endpoints
├── helpers/
│   ├── jwt.helper.js        # JWT utilities
│   └── cache-time.helper.js # Cache helpers
├── middlewares/
│   ├── auth.middleware.js   # JWT verification
│   ├── error.middleware.js  # Error handling
│   └── not-found.middleware.js
├── models/
│   ├── guild.model.js       # OUTDATED - needs sync
│   ├── schedule.model.js    # OUTDATED - needs sync
│   ├── new.model.js         # OUTDATED - needs sync
│   ├── text.model.js
│   ├── topic.model.js
│   └── user.model.js
├── repositories/
│   ├── base.repository.js   # CRUD base class
│   ├── guild.repository.js
│   └── user.repository.js
├── routes/
│   ├── auth.routes.js
│   ├── guild.routes.js
│   └── user.routes.js
├── services/
│   ├── base.service.js
│   ├── auth.service.js
│   ├── guild.service.js
│   └── user.service.js
└── startup/
    ├── container.js         # Awilix DI container
    └── index.js             # Express app
```

---

## Phase 1: Model Synchronization

**Priority:** CRITICAL
**Estimated Time:** 2-3 hours

The API models are outdated and must match the bot's models.

### Step 1.1: Update Guild Model

**File:** `src/models/guild.model.js`

**Current (OUTDATED):**
```javascript
const serverSchema = new mongoose.Schema({
  id: "string",
  name: "string",
  newsNotificationChannel: "string",
  prefix: "string",
});
```

**Updated (Match Bot):**
```javascript
const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    newsNotificationChannelId: {
        type: String,
        default: null
    },
    prefix: {
        type: String,
        default: null
    },
    language: {
        type: String,
        enum: ['es', 'en', 'pt', null],
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("guild", guildSchema);
```

**Key Changes:**
- `newsNotificationChannel` → `newsNotificationChannelId`
- Added `language` field with enum
- Added proper types and validation
- Added timestamps
- Changed collection name from "server" to "guild"

### Step 1.2: Update Schedule Model

**File:** `src/models/schedule.model.js`

**Current (OUTDATED):**
```javascript
const scheduleSchema = new mongoose.Schema({
  guild: "string",
  time: "string",
  channel: "string",
  action: "string",
  last: "string",
});
```

**Updated (Match Bot):**
```javascript
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    guild: {
        type: String,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['sendDailyText', 'sendRandomTopic']
    },
    last: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("schedule", scheduleSchema);
```

**Key Changes:**
- `channel` → `channelId`
- Added action enum validation
- Added timestamps

### Step 1.3: Update New Model

**File:** `src/models/new.model.js`

**Updated (Match Bot):**
```javascript
const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    pubDate: {
        type: Date
    },
    language: {
        type: String,
        enum: ['es', 'en', 'pt'],
        default: 'es',
        index: true
    },
    last: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("new", newSchema);
```

**Key Changes:**
- Added `language` field
- Added proper types

### Step 1.4: Update Remaining Models

#### Text Model

**File:** `src/models/text.model.js`

```javascript
const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format (YYYY-MM-DD)`
        }
    },
    text: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for date range queries
textSchema.index({ date: 1 });

module.exports = mongoose.model("text", textSchema);
```

**Schema Fields:**
- `date` - YYYY-MM-DD format (unique key for each daily text)
- `text` - Scripture reference (e.g., "Proverbios 3:5")
- `textContent` - The actual Bible verse text
- `explanation` - Commentary/explanation for the day

#### Topic Model

**File:** `src/models/topic.model.js`

```javascript
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discussion: {
        type: String,
        required: true
    },
    query: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Text index for searching topics
topicSchema.index({ name: 'text', discussion: 'text' });

module.exports = mongoose.model("topic", topicSchema);
```

**Schema Fields:**
- `name` - Topic title (e.g., "Faith", "Love")
- `discussion` - Discussion question or description
- `query` - Search query for WOL library (optional)

#### User Model

**File:** `src/models/user.model.js`

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        default: '0'
    },
    avatar: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Virtual for full Discord tag
userSchema.virtual('tag').get(function() {
    if (this.discriminator === '0') {
        return this.username;
    }
    return `${this.username}#${this.discriminator}`;
});

// Method to update tokens
userSchema.methods.updateTokens = function(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.lastLogin = new Date();
    return this.save();
};

// Static method to find or create user from Discord data
userSchema.statics.findOrCreateFromDiscord = async function(discordUser, tokens = {}) {
    let user = await this.findOne({ discordId: discordUser.id });

    if (user) {
        user.username = discordUser.username;
        user.discriminator = discordUser.discriminator || '0';
        user.avatar = discordUser.avatar;
        if (tokens.accessToken) user.accessToken = tokens.accessToken;
        if (tokens.refreshToken) user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();
    } else {
        user = await this.create({
            discordId: discordUser.id,
            username: discordUser.username,
            discriminator: discordUser.discriminator || '0',
            avatar: discordUser.avatar,
            email: discordUser.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }

    return user;
};

module.exports = mongoose.model("user", userSchema);
```

**Schema Fields:**
- `discordId` - Discord user ID (unique identifier)
- `username` - Discord username
- `discriminator` - Discord discriminator (legacy, now '0' for new usernames)
- `avatar` - Avatar hash for Discord CDN
- `email` - User email (from Discord OAuth, optional)
- `accessToken` - Discord OAuth access token
- `refreshToken` - Discord OAuth refresh token
- `role` - User role in the system (user/admin)
- `lastLogin` - Last login timestamp

---

## Phase 2: Guild Configuration Endpoints

**Priority:** HIGH
**Estimated Time:** 4-6 hours

### Step 2.1: Create Guild Config Routes

**File:** `src/routes/guild.routes.js`

```javascript
const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ GuildController }) {
  const router = Router();

  // Existing routes
  router.get("/", AuthMiddleware, GuildController.get);
  router.get("/:guildId", AuthMiddleware, GuildController.find);

  // NEW: Guild configuration
  router.get("/:guildId/config", AuthMiddleware, GuildController.getConfig);
  router.put("/:guildId/config", AuthMiddleware, GuildController.updateConfig);

  // NEW: Guild channels (for dropdown selection)
  router.get("/:guildId/channels", AuthMiddleware, GuildController.getChannels);

  return router;
};
```

### Step 2.2: Update Guild Controller

**File:** `src/controllers/guild.controller.js`

Add these methods:

```javascript
async getConfig(req, res) {
    const { guildId } = req.params;

    // Verify user has access to this guild
    const hasAccess = await _guildService.userHasAccess(req.user, guildId);
    if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const config = await _guildService.getConfig(guildId);

    if (!config) {
        // Return default config if guild not in DB yet
        return res.json({
            id: guildId,
            language: null,
            newsNotificationChannelId: null,
            prefix: null
        });
    }

    return res.json(config);
}

async updateConfig(req, res) {
    const { guildId } = req.params;
    const { language, newsNotificationChannelId, prefix } = req.body;

    // Verify user has admin access
    const hasAccess = await _guildService.userHasAdminAccess(req.user, guildId);
    if (!hasAccess) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate language
    if (language && !['es', 'en', 'pt'].includes(language)) {
        return res.status(400).json({ error: 'Invalid language' });
    }

    const updated = await _guildService.updateConfig(guildId, {
        language,
        newsNotificationChannelId,
        prefix
    });

    return res.json(updated);
}

async getChannels(req, res) {
    const { guildId } = req.params;

    // Verify user has access
    const hasAccess = await _guildService.userHasAccess(req.user, guildId);
    if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const channels = await _guildService.getGuildChannels(guildId);

    return res.json(channels);
}
```

### Step 2.3: Update Guild Service

**File:** `src/services/guild.service.js`

```javascript
let _guildRepository = null;
let _client = null;

class GuildService {
    constructor({ GuildRepository, client }) {
        _guildRepository = GuildRepository;
        _client = client;
    }

    async get(guildId) {
        return await _guildRepository.get(guildId);
    }

    async getAll(user) {
        return await _guildRepository.getAll(user);
    }

    async getBotGuilds() {
        return await _guildRepository.getBotGuilds();
    }

    async getConfig(guildId) {
        return await _guildRepository.findByGuildId(guildId);
    }

    async updateConfig(guildId, config) {
        return await _guildRepository.upsertByGuildId(guildId, config);
    }

    async userHasAccess(user, guildId) {
        // Check if user is member of the guild via Discord API
        const userGuilds = await this.getAll(user);
        return userGuilds.some(g => g.id === guildId);
    }

    async userHasAdminAccess(user, guildId) {
        const userGuilds = await this.getAll(user);
        const guild = userGuilds.find(g => g.id === guildId);
        if (!guild) return false;

        // Check if owner or has ADMINISTRATOR permission (0x8)
        return guild.owner || (guild.permissions & 0x8) !== 0;
    }

    async getGuildChannels(guildId) {
        try {
            const guild = await _client.guilds.fetch(guildId);
            const channels = guild.channels.cache
                .filter(ch => ch.type === 'text' || ch.type === 0) // text channels
                .map(ch => ({
                    id: ch.id,
                    name: ch.name,
                    position: ch.position
                }))
                .sort((a, b) => a.position - b.position);

            return channels;
        } catch (error) {
            console.error('Error fetching channels:', error);
            return [];
        }
    }
}

module.exports = GuildService;
```

### Step 2.4: Update Guild Repository

**File:** `src/repositories/guild.repository.js`

Add these methods:

```javascript
async findByGuildId(guildId) {
    return await this.model.findOne({ id: guildId });
}

async upsertByGuildId(guildId, data) {
    return await this.model.findOneAndUpdate(
        { id: guildId },
        { $set: data },
        { new: true, upsert: true }
    );
}
```

---

## Phase 3: Schedule Management Endpoints

**Priority:** HIGH
**Estimated Time:** 4-6 hours

### Step 3.1: Create Schedule Routes

**File:** `src/routes/schedule.routes.js` (NEW)

```javascript
const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ ScheduleController }) {
    const router = Router();

    // All routes require authentication
    router.use(AuthMiddleware);

    // Guild schedules
    router.get("/guild/:guildId", ScheduleController.getByGuild);
    router.post("/guild/:guildId", ScheduleController.create);
    router.put("/:scheduleId", ScheduleController.update);
    router.delete("/:scheduleId", ScheduleController.delete);

    return router;
};
```

### Step 3.2: Create Schedule Controller

**File:** `src/controllers/schedule.controller.js` (NEW)

```javascript
let _scheduleService = null;
let _guildService = null;

class ScheduleController {
    constructor({ ScheduleService, GuildService }) {
        _scheduleService = ScheduleService;
        _guildService = GuildService;
    }

    async getByGuild(req, res) {
        const { guildId } = req.params;

        // Verify access
        const hasAccess = await _guildService.userHasAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const schedules = await _scheduleService.getByGuild(guildId);
        return res.json(schedules);
    }

    async create(req, res) {
        const { guildId } = req.params;
        const { time, channelId, action } = req.body;

        // Verify admin access
        const hasAccess = await _guildService.userHasAdminAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Validate action
        if (!['sendDailyText', 'sendRandomTopic'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action' });
        }

        // Validate time (0-23)
        const hour = parseInt(time);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            return res.status(400).json({ error: 'Invalid time (0-23)' });
        }

        const schedule = await _scheduleService.create({
            guild: guildId,
            time: time.toString(),
            channelId,
            action,
            last: ''
        });

        return res.status(201).json(schedule);
    }

    async update(req, res) {
        const { scheduleId } = req.params;
        const { time, channelId, action } = req.body;

        // Get schedule to verify guild
        const schedule = await _scheduleService.get(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Verify admin access
        const hasAccess = await _guildService.userHasAdminAccess(req.user, schedule.guild);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const updated = await _scheduleService.update(scheduleId, {
            time,
            channelId,
            action
        });

        return res.json(updated);
    }

    async delete(req, res) {
        const { scheduleId } = req.params;

        // Get schedule to verify guild
        const schedule = await _scheduleService.get(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Verify admin access
        const hasAccess = await _guildService.userHasAdminAccess(req.user, schedule.guild);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await _scheduleService.delete(scheduleId);

        return res.status(204).send();
    }
}

module.exports = ScheduleController;
```

### Step 3.3: Create Schedule Service

**File:** `src/services/schedule.service.js` (NEW)

```javascript
const BaseService = require('./base.service');

class ScheduleService extends BaseService {
    constructor({ ScheduleRepository }) {
        super(ScheduleRepository);
        this.repository = ScheduleRepository;
    }

    async getByGuild(guildId) {
        return await this.repository.findByGuild(guildId);
    }
}

module.exports = ScheduleService;
```

### Step 3.4: Create Schedule Repository

**File:** `src/repositories/schedule.repository.js` (NEW)

```javascript
const BaseRepository = require('./base.repository');

class ScheduleRepository extends BaseRepository {
    constructor({ Schedule }) {
        super(Schedule);
    }

    async findByGuild(guildId) {
        return await this.model.find({ guild: guildId });
    }
}

module.exports = ScheduleRepository;
```

### Step 3.5: Register in DI Container

**File:** `src/startup/container.js`

Add to container registration:

```javascript
// Import new components
const { ScheduleService } = require("../services");
const { ScheduleController } = require("../controllers");
const { ScheduleRoutes } = require("../routes/index.routes");
const { ScheduleRepository } = require("../repositories");
const { Schedule } = require("../models");

// Register in container
container
    .register({
        Schedule: asValue(Schedule),
    })
    .register({
        ScheduleRepository: asClass(ScheduleRepository).singleton(),
    })
    .register({
        ScheduleService: asClass(ScheduleService).singleton(),
    })
    .register({
        ScheduleController: asClass(ScheduleController.bind(ScheduleController)).singleton(),
    })
    .register({
        ScheduleRoutes: asFunction(ScheduleRoutes).singleton(),
    });
```

### Step 3.6: Add Schedule Routes to Main Router

**File:** `src/routes/index.js`

```javascript
module.exports = function ({ AuthRoutes, GuildRoutes, UserRoutes, ScheduleRoutes }) {
    // ...
    apiRoutes.use("/schedules", ScheduleRoutes);
    // ...
};
```

---

## Phase 4: Dashboard & Statistics

**Priority:** MEDIUM
**Estimated Time:** 3-4 hours

### Step 4.1: Create Dashboard Routes

**File:** `src/routes/dashboard.routes.js` (NEW)

```javascript
const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ DashboardController }) {
    const router = Router();

    router.use(AuthMiddleware);

    router.get("/stats", DashboardController.getStats);
    router.get("/guilds", DashboardController.getUserGuilds);

    return router;
};
```

### Step 4.2: Create Dashboard Controller

**File:** `src/controllers/dashboard.controller.js` (NEW)

```javascript
let _dashboardService = null;

class DashboardController {
    constructor({ DashboardService }) {
        _dashboardService = DashboardService;
    }

    async getStats(req, res) {
        const stats = await _dashboardService.getOverallStats();
        return res.json(stats);
    }

    async getUserGuilds(req, res) {
        const guilds = await _dashboardService.getUserGuildsWithStats(req.user);
        return res.json(guilds);
    }
}

module.exports = DashboardController;
```

### Step 4.3: Create Dashboard Service

**File:** `src/services/dashboard.service.js` (NEW)

```javascript
class DashboardService {
    constructor({ Guild, Schedule, Text, New, Topic, GuildService }) {
        this.Guild = Guild;
        this.Schedule = Schedule;
        this.Text = Text;
        this.New = New;
        this.Topic = Topic;
        this.guildService = GuildService;
    }

    async getOverallStats() {
        const [
            totalGuilds,
            totalSchedules,
            totalTexts,
            totalNews,
            totalTopics
        ] = await Promise.all([
            this.Guild.countDocuments(),
            this.Schedule.countDocuments(),
            this.Text.countDocuments(),
            this.New.countDocuments(),
            this.Topic.countDocuments()
        ]);

        return {
            guilds: totalGuilds,
            schedules: totalSchedules,
            dailyTexts: totalTexts,
            newsArticles: totalNews,
            topics: totalTopics
        };
    }

    async getUserGuildsWithStats(user) {
        const userGuilds = await this.guildService.getAll(user);
        const botGuilds = await this.guildService.getBotGuilds();

        const guildsWithStats = await Promise.all(
            userGuilds
                .filter(g => botGuilds.some(bg => bg.id === g.id))
                .map(async (guild) => {
                    const config = await this.Guild.findOne({ id: guild.id });
                    const scheduleCount = await this.Schedule.countDocuments({ guild: guild.id });

                    return {
                        id: guild.id,
                        name: guild.name,
                        icon: guild.icon,
                        language: config?.language || 'default',
                        schedules: scheduleCount,
                        hasNewsChannel: !!config?.newsNotificationChannelId
                    };
                })
        );

        return guildsWithStats;
    }
}

module.exports = DashboardService;
```

---

## Phase 5: Content Endpoints

**Priority:** MEDIUM
**Estimated Time:** 4-6 hours

### Step 5.1: Create Pagination Utility

**File:** `src/utils/pagination.js` (NEW)

```javascript
/**
 * Paginate Mongoose query results
 * @param {Model} model - Mongoose model
 * @param {Object} query - Query filter
 * @param {Object} options - Pagination options
 * @returns {Object} Paginated results
 */
async function paginate(model, query = {}, options = {}) {
    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };

    const [data, total] = await Promise.all([
        model.find(query).sort(sort).skip(skip).limit(limit),
        model.countDocuments(query)
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
}

module.exports = { paginate };
```

### Step 5.2: Daily Texts Endpoints

#### Text Routes

**File:** `src/routes/text.routes.js` (NEW)

```javascript
const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ TextController }) {
    const router = Router();

    // Public routes (no auth required for reading)
    router.get("/", TextController.list);
    router.get("/:date", TextController.getByDate);

    // Admin routes
    router.post("/import", AuthMiddleware, TextController.bulkImport);

    return router;
};
```

#### Text Controller

**File:** `src/controllers/text.controller.js` (NEW)

```javascript
let _textService = null;

class TextController {
    constructor({ TextService }) {
        _textService = TextService;
    }

    async list(req, res) {
        try {
            const { page, limit, language } = req.query;
            const result = await _textService.list({ page, limit, language });
            return res.json(result);
        } catch (error) {
            console.error('Error listing texts:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getByDate(req, res) {
        try {
            const { date } = req.params;

            // Validate date format (YYYY-MM-DD)
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
            }

            const text = await _textService.getByDate(date);

            if (!text) {
                return res.status(404).json({ error: 'Text not found for this date' });
            }

            return res.json(text);
        } catch (error) {
            console.error('Error getting text:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async bulkImport(req, res) {
        try {
            // Check admin role (you may want more sophisticated role checking)
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { texts } = req.body;

            if (!Array.isArray(texts) || texts.length === 0) {
                return res.status(400).json({ error: 'texts must be a non-empty array' });
            }

            const result = await _textService.bulkImport(texts);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error importing texts:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TextController;
```

#### Text Service

**File:** `src/services/text.service.js` (NEW)

```javascript
const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class TextService extends BaseService {
    constructor({ TextRepository, Text }) {
        super(TextRepository);
        this.repository = TextRepository;
        this.model = Text;
    }

    async list(options = {}) {
        const query = {};

        // Language filtering is not typically used for texts
        // but could be added if multi-language texts are stored

        return await paginate(this.model, query, {
            page: options.page,
            limit: options.limit,
            sort: { date: -1 }
        });
    }

    async getByDate(date) {
        return await this.repository.findByDate(date);
    }

    async bulkImport(texts) {
        const operations = texts.map(text => ({
            updateOne: {
                filter: { date: text.date },
                update: { $set: text },
                upsert: true
            }
        }));

        const result = await this.model.bulkWrite(operations);

        return {
            imported: result.upsertedCount,
            updated: result.modifiedCount,
            total: texts.length
        };
    }
}

module.exports = TextService;
```

#### Text Repository

**File:** `src/repositories/text.repository.js` (NEW)

```javascript
const BaseRepository = require('./base.repository');

class TextRepository extends BaseRepository {
    constructor({ Text }) {
        super(Text);
    }

    async findByDate(date) {
        return await this.model.findOne({ date });
    }

    async findByDateRange(startDate, endDate) {
        return await this.model.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });
    }
}

module.exports = TextRepository;
```

### Step 5.3: News Endpoints

#### News Routes

**File:** `src/routes/news.routes.js` (NEW)

```javascript
const { Router } = require("express");

module.exports = function ({ NewsController }) {
    const router = Router();

    // All news routes are public (read-only)
    router.get("/", NewsController.list);
    router.get("/latest", NewsController.getLatest);

    return router;
};
```

#### News Controller

**File:** `src/controllers/news.controller.js` (NEW)

```javascript
let _newsService = null;

class NewsController {
    constructor({ NewsService }) {
        _newsService = NewsService;
    }

    async list(req, res) {
        try {
            const { page, limit, language } = req.query;
            const result = await _newsService.list({ page, limit, language });
            return res.json(result);
        } catch (error) {
            console.error('Error listing news:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getLatest(req, res) {
        try {
            const { language } = req.query;
            const validLanguages = ['es', 'en', 'pt'];

            if (language && !validLanguages.includes(language)) {
                return res.status(400).json({
                    error: 'Invalid language. Must be one of: es, en, pt'
                });
            }

            const news = await _newsService.getLatest(language || 'es');

            if (!news) {
                return res.status(404).json({ error: 'No news found' });
            }

            return res.json(news);
        } catch (error) {
            console.error('Error getting latest news:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = NewsController;
```

#### News Service

**File:** `src/services/news.service.js` (NEW)

```javascript
const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class NewsService extends BaseService {
    constructor({ NewsRepository, New }) {
        super(NewsRepository);
        this.repository = NewsRepository;
        this.model = New;
    }

    async list(options = {}) {
        const query = {};

        if (options.language) {
            query.language = options.language;
        }

        return await paginate(this.model, query, {
            page: options.page,
            limit: options.limit,
            sort: { pubDate: -1 }
        });
    }

    async getLatest(language = 'es') {
        return await this.repository.findLatestByLanguage(language);
    }
}

module.exports = NewsService;
```

#### News Repository

**File:** `src/repositories/news.repository.js` (NEW)

```javascript
const BaseRepository = require('./base.repository');

class NewsRepository extends BaseRepository {
    constructor({ New }) {
        super(New);
    }

    async findLatestByLanguage(language) {
        return await this.model.findOne({
            language,
            last: true
        });
    }

    async findByLanguage(language, limit = 20) {
        return await this.model.find({ language })
            .sort({ pubDate: -1 })
            .limit(limit);
    }
}

module.exports = NewsRepository;
```

### Step 5.4: Topics Endpoints

#### Topic Routes

**File:** `src/routes/topic.routes.js` (NEW)

```javascript
const { Router } = require("express");
const { AuthMiddleware } = require("../middlewares");

module.exports = function ({ TopicController }) {
    const router = Router();

    // Public routes
    router.get("/", TopicController.list);
    router.get("/random", TopicController.getRandom);
    router.get("/:id", TopicController.getById);

    // Admin routes
    router.post("/", AuthMiddleware, TopicController.create);
    router.put("/:id", AuthMiddleware, TopicController.update);
    router.delete("/:id", AuthMiddleware, TopicController.delete);

    return router;
};
```

#### Topic Controller

**File:** `src/controllers/topic.controller.js` (NEW)

```javascript
let _topicService = null;

class TopicController {
    constructor({ TopicService }) {
        _topicService = TopicService;
    }

    async list(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await _topicService.list({ page, limit });
            return res.json(result);
        } catch (error) {
            console.error('Error listing topics:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const topic = await _topicService.get(id);

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.json(topic);
        } catch (error) {
            console.error('Error getting topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getRandom(req, res) {
        try {
            const topic = await _topicService.getRandom();

            if (!topic) {
                return res.status(404).json({ error: 'No topics available' });
            }

            return res.json(topic);
        } catch (error) {
            console.error('Error getting random topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { name, discussion, query } = req.body;

            if (!name || !discussion) {
                return res.status(400).json({
                    error: 'name and discussion are required'
                });
            }

            const topic = await _topicService.create({
                name,
                discussion,
                query: query || ''
            });

            return res.status(201).json(topic);
        } catch (error) {
            console.error('Error creating topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { id } = req.params;
            const { name, discussion, query } = req.body;

            const topic = await _topicService.update(id, {
                name,
                discussion,
                query
            });

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.json(topic);
        } catch (error) {
            console.error('Error updating topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { id } = req.params;
            const deleted = await _topicService.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TopicController;
```

#### Topic Service

**File:** `src/services/topic.service.js` (NEW)

```javascript
const BaseService = require('./base.service');
const { paginate } = require('../utils/pagination');

class TopicService extends BaseService {
    constructor({ TopicRepository, Topic }) {
        super(TopicRepository);
        this.repository = TopicRepository;
        this.model = Topic;
    }

    async list(options = {}) {
        return await paginate(this.model, {}, {
            page: options.page,
            limit: options.limit,
            sort: { createdAt: -1 }
        });
    }

    async getRandom() {
        return await this.repository.findRandom();
    }
}

module.exports = TopicService;
```

#### Topic Repository

**File:** `src/repositories/topic.repository.js` (NEW)

```javascript
const BaseRepository = require('./base.repository');

class TopicRepository extends BaseRepository {
    constructor({ Topic }) {
        super(Topic);
    }

    async findRandom() {
        const count = await this.model.countDocuments();
        if (count === 0) return null;

        const random = Math.floor(Math.random() * count);
        return await this.model.findOne().skip(random);
    }

    async search(query) {
        return await this.model.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { discussion: { $regex: query, $options: 'i' } }
            ]
        });
    }
}

module.exports = TopicRepository;
```

### Step 5.5: Register Content Endpoints in DI Container

**File:** `src/startup/container.js` (additions)

```javascript
// Import content components
const TextService = require("../services/text.service");
const TextController = require("../controllers/text.controller");
const TextRepository = require("../repositories/text.repository");
const TextRoutes = require("../routes/text.routes");

const NewsService = require("../services/news.service");
const NewsController = require("../controllers/news.controller");
const NewsRepository = require("../repositories/news.repository");
const NewsRoutes = require("../routes/news.routes");

const TopicService = require("../services/topic.service");
const TopicController = require("../controllers/topic.controller");
const TopicRepository = require("../repositories/topic.repository");
const TopicRoutes = require("../routes/topic.routes");

// Register in container
container
    // Text components
    .register({
        TextRepository: asClass(TextRepository).singleton(),
        TextService: asClass(TextService).singleton(),
        TextController: asClass(TextController.bind(TextController)).singleton(),
        TextRoutes: asFunction(TextRoutes).singleton(),
    })
    // News components
    .register({
        NewsRepository: asClass(NewsRepository).singleton(),
        NewsService: asClass(NewsService).singleton(),
        NewsController: asClass(NewsController.bind(NewsController)).singleton(),
        NewsRoutes: asFunction(NewsRoutes).singleton(),
    })
    // Topic components
    .register({
        TopicRepository: asClass(TopicRepository).singleton(),
        TopicService: asClass(TopicService).singleton(),
        TopicController: asClass(TopicController.bind(TopicController)).singleton(),
        TopicRoutes: asFunction(TopicRoutes).singleton(),
    });
```

### Step 5.6: Add Content Routes to Main Router

**File:** `src/routes/index.js` (additions)

```javascript
module.exports = function ({
    AuthRoutes,
    GuildRoutes,
    UserRoutes,
    ScheduleRoutes,
    DashboardRoutes,
    TextRoutes,
    NewsRoutes,
    TopicRoutes
}) {
    // ... existing code ...

    // Content routes
    apiRoutes.use("/texts", TextRoutes);
    apiRoutes.use("/news", NewsRoutes);
    apiRoutes.use("/topics", TopicRoutes);

    return router;
};
```

---

## Phase 6: Security & Polish

**Priority:** MEDIUM
**Estimated Time:** 3-4 hours

### Step 6.1: Input Validation

Use `express-validator` or `joi`:

```javascript
const { body, param, validationResult } = require('express-validator');

const validateGuildConfig = [
    body('language').optional().isIn(['es', 'en', 'pt']),
    body('newsNotificationChannelId').optional().isString(),
    body('prefix').optional().isString().isLength({ max: 10 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
```

### Step 6.2: Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: { error: 'Too many requests, please try again later' }
});

app.use('/api/v1/', apiLimiter);
```

### Step 6.3: API Documentation

Generate OpenAPI/Swagger docs:

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const specs = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JW Discord API',
            version: '1.0.0',
        },
        servers: [{ url: '/api/v1' }]
    },
    apis: ['./src/routes/*.js']
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
```

---

## Testing Strategy

### Step T.1: Jest Configuration

**File:** `jest.config.js`

```javascript
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/startup/**',
        '!src/config/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    verbose: true,
    testTimeout: 10000
};
```

### Step T.2: Test Setup

**File:** `tests/setup.js`

```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to in-memory database before all tests
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// Clear database between tests
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Disconnect and stop server after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
```

### Step T.3: Test Utilities

**File:** `tests/utils/test-helpers.js`

```javascript
const jwt = require('jsonwebtoken');
const config = require('../../src/config');

/**
 * Generate a valid JWT token for testing
 */
function generateTestToken(user = {}) {
    const payload = {
        id: user.id || 'test-user-123',
        discordId: user.discordId || '123456789',
        username: user.username || 'testuser',
        role: user.role || 'user'
    };

    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: '1h'
    });
}

/**
 * Generate an admin token
 */
function generateAdminToken() {
    return generateTestToken({ role: 'admin' });
}

/**
 * Create a mock Express request
 */
function mockRequest(overrides = {}) {
    return {
        params: {},
        query: {},
        body: {},
        user: null,
        headers: {},
        ...overrides
    };
}

/**
 * Create a mock Express response
 */
function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}

module.exports = {
    generateTestToken,
    generateAdminToken,
    mockRequest,
    mockResponse
};
```

### Step T.4: Unit Tests

#### Guild Service Tests

**File:** `tests/unit/services/guild.service.test.js`

```javascript
const GuildService = require('../../../src/services/guild.service');

describe('GuildService', () => {
    let guildService;
    let mockGuildRepository;
    let mockClient;

    beforeEach(() => {
        mockGuildRepository = {
            findByGuildId: jest.fn(),
            upsertByGuildId: jest.fn(),
            getAll: jest.fn()
        };

        mockClient = {
            guilds: {
                fetch: jest.fn(),
                cache: new Map()
            }
        };

        guildService = new GuildService({
            GuildRepository: mockGuildRepository,
            client: mockClient
        });
    });

    describe('getConfig', () => {
        it('should return guild config when found', async () => {
            const mockConfig = { id: '123', language: 'es' };
            mockGuildRepository.findByGuildId.mockResolvedValue(mockConfig);

            const result = await guildService.getConfig('123');

            expect(mockGuildRepository.findByGuildId).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockConfig);
        });

        it('should return null when guild not found', async () => {
            mockGuildRepository.findByGuildId.mockResolvedValue(null);

            const result = await guildService.getConfig('999');

            expect(result).toBeNull();
        });
    });

    describe('updateConfig', () => {
        it('should update guild configuration', async () => {
            const config = { language: 'en', prefix: '!' };
            const updatedConfig = { id: '123', ...config };
            mockGuildRepository.upsertByGuildId.mockResolvedValue(updatedConfig);

            const result = await guildService.updateConfig('123', config);

            expect(mockGuildRepository.upsertByGuildId).toHaveBeenCalledWith('123', config);
            expect(result).toEqual(updatedConfig);
        });
    });

    describe('userHasAccess', () => {
        it('should return true when user is member of guild', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild' },
                { id: '456', name: 'Other Guild' }
            ]);

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return false when user is not member', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '456', name: 'Other Guild' }
            ]);

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(false);
        });
    });

    describe('userHasAdminAccess', () => {
        it('should return true for guild owner', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: true, permissions: 0 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return true for admin permission (0x8)', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: false, permissions: 0x8 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return false for regular member', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: false, permissions: 0 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });

        it('should return false when user not in guild', async () => {
            const user = { id: 'user-1' };
            mockGuildRepository.getAll.mockResolvedValue([]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });
    });
});
```

#### Schedule Service Tests

**File:** `tests/unit/services/schedule.service.test.js`

```javascript
const ScheduleService = require('../../../src/services/schedule.service');

describe('ScheduleService', () => {
    let scheduleService;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findByGuild: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn()
        };

        scheduleService = new ScheduleService({
            ScheduleRepository: mockRepository
        });
    });

    describe('getByGuild', () => {
        it('should return all schedules for a guild', async () => {
            const mockSchedules = [
                { guild: '123', action: 'sendDailyText', time: '07' },
                { guild: '123', action: 'sendRandomTopic', time: '19' }
            ];
            mockRepository.findByGuild.mockResolvedValue(mockSchedules);

            const result = await scheduleService.getByGuild('123');

            expect(mockRepository.findByGuild).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockSchedules);
        });

        it('should return empty array when no schedules', async () => {
            mockRepository.findByGuild.mockResolvedValue([]);

            const result = await scheduleService.getByGuild('999');

            expect(result).toEqual([]);
        });
    });
});
```

### Step T.5: Integration Tests

#### Guild Routes Integration Tests

**File:** `tests/integration/routes/guild.routes.test.js`

```javascript
const request = require('supertest');
const { createApp } = require('../../../src/startup');
const { generateTestToken, generateAdminToken } = require('../../utils/test-helpers');
const Guild = require('../../../src/models/guild.model');

describe('Guild Routes', () => {
    let app;
    let validToken;
    let adminToken;

    beforeAll(async () => {
        app = await createApp();
        validToken = generateTestToken();
        adminToken = generateAdminToken();
    });

    describe('GET /api/v1/guilds/:id/config', () => {
        beforeEach(async () => {
            await Guild.create({
                id: '123456789',
                name: 'Test Guild',
                language: 'es',
                newsNotificationChannelId: '987654321'
            });
        });

        it('should return guild config for authorized user', async () => {
            const res = await request(app)
                .get('/api/v1/guilds/123456789/config')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', '123456789');
            expect(res.body).toHaveProperty('language', 'es');
            expect(res.body).toHaveProperty('newsNotificationChannelId', '987654321');
        });

        it('should return 401 without token', async () => {
            const res = await request(app)
                .get('/api/v1/guilds/123456789/config');

            expect(res.status).toBe(401);
        });

        it('should return 403 for unauthorized user', async () => {
            // Token for user not in guild
            const unauthorizedToken = generateTestToken({ id: 'other-user' });

            const res = await request(app)
                .get('/api/v1/guilds/999999999/config')
                .set('Authorization', `Bearer ${unauthorizedToken}`);

            expect(res.status).toBe(403);
        });

        it('should return default config for unconfigured guild', async () => {
            const res = await request(app)
                .get('/api/v1/guilds/unconfigured-guild/config')
                .set('Authorization', `Bearer ${validToken}`);

            expect(res.status).toBe(200);
            expect(res.body.language).toBeNull();
        });
    });

    describe('PUT /api/v1/guilds/:id/config', () => {
        it('should update guild config for admin user', async () => {
            const res = await request(app)
                .put('/api/v1/guilds/123456789/config')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    language: 'en',
                    prefix: '!'
                });

            expect(res.status).toBe(200);
            expect(res.body.language).toBe('en');
            expect(res.body.prefix).toBe('!');
        });

        it('should reject invalid language', async () => {
            const res = await request(app)
                .put('/api/v1/guilds/123456789/config')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    language: 'invalid'
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Invalid language');
        });

        it('should return 403 for non-admin user', async () => {
            const res = await request(app)
                .put('/api/v1/guilds/123456789/config')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    language: 'en'
                });

            expect(res.status).toBe(403);
        });
    });
});
```

#### Schedule Routes Integration Tests

**File:** `tests/integration/routes/schedule.routes.test.js`

```javascript
const request = require('supertest');
const { createApp } = require('../../../src/startup');
const { generateAdminToken } = require('../../utils/test-helpers');
const Schedule = require('../../../src/models/schedule.model');

describe('Schedule Routes', () => {
    let app;
    let adminToken;

    beforeAll(async () => {
        app = await createApp();
        adminToken = generateAdminToken();
    });

    describe('GET /api/v1/schedules/guild/:guildId', () => {
        beforeEach(async () => {
            await Schedule.create([
                { guild: '123', time: '07', channelId: 'ch-1', action: 'sendDailyText' },
                { guild: '123', time: '19', channelId: 'ch-2', action: 'sendRandomTopic' }
            ]);
        });

        it('should return all schedules for guild', async () => {
            const res = await request(app)
                .get('/api/v1/schedules/guild/123')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('action', 'sendDailyText');
        });
    });

    describe('POST /api/v1/schedules/guild/:guildId', () => {
        it('should create a new schedule', async () => {
            const res = await request(app)
                .post('/api/v1/schedules/guild/456')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    time: '08',
                    channelId: 'new-channel',
                    action: 'sendDailyText'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('guild', '456');
            expect(res.body).toHaveProperty('action', 'sendDailyText');
        });

        it('should reject invalid action', async () => {
            const res = await request(app)
                .post('/api/v1/schedules/guild/456')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    time: '08',
                    channelId: 'channel',
                    action: 'invalidAction'
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Invalid action');
        });

        it('should reject invalid time', async () => {
            const res = await request(app)
                .post('/api/v1/schedules/guild/456')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    time: '25', // Invalid hour
                    channelId: 'channel',
                    action: 'sendDailyText'
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Invalid time');
        });
    });

    describe('PUT /api/v1/schedules/:scheduleId', () => {
        let scheduleId;

        beforeEach(async () => {
            const schedule = await Schedule.create({
                guild: '123',
                time: '07',
                channelId: 'ch-1',
                action: 'sendDailyText'
            });
            scheduleId = schedule._id;
        });

        it('should update existing schedule', async () => {
            const res = await request(app)
                .put(`/api/v1/schedules/${scheduleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    time: '09',
                    action: 'sendRandomTopic'
                });

            expect(res.status).toBe(200);
            expect(res.body.time).toBe('09');
            expect(res.body.action).toBe('sendRandomTopic');
        });

        it('should return 404 for non-existent schedule', async () => {
            const res = await request(app)
                .put('/api/v1/schedules/000000000000000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ time: '09' });

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/v1/schedules/:scheduleId', () => {
        let scheduleId;

        beforeEach(async () => {
            const schedule = await Schedule.create({
                guild: '123',
                time: '07',
                channelId: 'ch-1',
                action: 'sendDailyText'
            });
            scheduleId = schedule._id;
        });

        it('should delete schedule', async () => {
            const res = await request(app)
                .delete(`/api/v1/schedules/${scheduleId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);

            // Verify deletion
            const deleted = await Schedule.findById(scheduleId);
            expect(deleted).toBeNull();
        });
    });
});
```

### Step T.6: Test Scripts

**File:** `package.json` (test scripts)

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:unit": "jest tests/unit",
        "test:integration": "jest tests/integration",
        "test:ci": "jest --ci --coverage --reporters=default --reporters=jest-junit"
    },
    "devDependencies": {
        "jest": "^29.7.0",
        "supertest": "^6.3.3",
        "mongodb-memory-server": "^9.1.6",
        "jest-junit": "^16.0.0"
    }
}
```

### Test File Structure

```
tests/
├── setup.js                              # Global test setup
├── utils/
│   └── test-helpers.js                   # Test utilities
├── unit/
│   ├── services/
│   │   ├── guild.service.test.js
│   │   ├── schedule.service.test.js
│   │   ├── text.service.test.js
│   │   ├── news.service.test.js
│   │   └── topic.service.test.js
│   ├── repositories/
│   │   ├── guild.repository.test.js
│   │   └── schedule.repository.test.js
│   └── middlewares/
│       └── auth.middleware.test.js
└── integration/
    └── routes/
        ├── guild.routes.test.js
        ├── schedule.routes.test.js
        ├── text.routes.test.js
        ├── news.routes.test.js
        └── topic.routes.test.js
```

---

## Deployment

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# MongoDB
MONGO_DSN=mongodb://localhost:27017/jw-discord-bot

# Discord
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT=https://your-frontend.com/callback

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend.com
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

### Deployment Platforms

| Platform | Notes |
|----------|-------|
| Railway | Recommended - easy setup |
| Vercel | Serverless functions |
| Heroku | Paid only |
| VPS | Full control |

---

## Summary

| Phase | Tasks | Effort |
|-------|-------|--------|
| 1 | Model Sync | 2-3 hours |
| 2 | Guild Config | 4-6 hours |
| 3 | Schedule Management | 4-6 hours |
| 4 | Dashboard | 3-4 hours |
| 5 | Content Endpoints | 4-6 hours |
| 6 | Security & Polish | 3-4 hours |
| **Total** | | **20-29 hours** |

### Priority Order

1. **Phase 1** - Model Sync (CRITICAL - frontend depends on this)
2. **Phase 2** - Guild Config (HIGH - core frontend feature)
3. **Phase 3** - Schedule Management (HIGH - core frontend feature)
4. **Phase 4** - Dashboard (MEDIUM - nice to have)
5. **Phase 5** - Content Endpoints (MEDIUM - future features)
6. **Phase 6** - Security (MEDIUM - before production)
