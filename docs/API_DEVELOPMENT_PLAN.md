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

### Step 1.4: Verify Other Models

Check these models match the bot:
- `text.model.js` - Daily texts
- `topic.model.js` - Discussion topics
- `user.model.js` - User profiles

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

### Daily Texts Endpoints

```javascript
// Routes: src/routes/text.routes.js
GET  /texts              // List texts (paginated)
GET  /texts/:date        // Get by date (YYYY-MM-DD)
POST /texts/import       // Bulk import (admin only)

// Query params for list:
// ?page=1&limit=20&language=es
```

### News Endpoints

```javascript
// Routes: src/routes/news.routes.js
GET /news                // List news (paginated)
GET /news/latest         // Get latest by language

// Query params:
// ?page=1&limit=20&language=es
```

### Topics Endpoints

```javascript
// Routes: src/routes/topic.routes.js
GET    /topics           // List topics (paginated)
GET    /topics/random    // Get random topic
POST   /topics           // Create topic (admin)
PUT    /topics/:id       // Update topic (admin)
DELETE /topics/:id       // Delete topic (admin)
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

### Unit Tests

```javascript
// tests/services/guild.service.test.js
describe('GuildService', () => {
    describe('userHasAdminAccess', () => {
        it('should return true for guild owner', async () => {
            // ...
        });

        it('should return true for admin permission', async () => {
            // ...
        });

        it('should return false for regular member', async () => {
            // ...
        });
    });
});
```

### Integration Tests

```javascript
// tests/routes/guild.routes.test.js
describe('GET /api/v1/guilds/:id/config', () => {
    it('should return guild config for authorized user', async () => {
        const res = await request(app)
            .get('/api/v1/guilds/123/config')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('language');
    });

    it('should return 403 for unauthorized user', async () => {
        // ...
    });
});
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
