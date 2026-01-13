# JW Discord Ecosystem - Development Roadmap

This document outlines the development status for each project in the JW Discord ecosystem.

**Last Updated:** January 2026

## Overview

| Project | Current State | Status |
|---------|---------------|--------|
| jw-discord-bot | 100% complete | Feature complete, 173 tests passing |
| jw-discord-api | 100% complete | Feature complete, 46 tests passing |
| jw-discord-frontend | 100% complete | Feature complete, 45 tests passing |

**Total Tests:** 264 passing across all projects

---

## jw-discord-bot

### Status: 100% Complete

### Completed Features
- [x] Daily text command with pagination
- [x] News feed from JW.org RSS
- [x] Topic search in WOL
- [x] Random topic generator
- [x] Multi-language support (ES, EN, PT)
- [x] Per-guild language configuration
- [x] Per-guild news channel configuration
- [x] Per-guild daily text scheduling
- [x] **Per-guild custom prefix support**
- [x] Admin commands (setlang, setnews, setdaily, setprefix)
- [x] Utility commands (help, ping, date, avatar)
- [x] Scheduled news notifications
- [x] Scheduled daily text posting
- [x] Configurable timezone
- [x] Configurable bot status
- [x] Comprehensive documentation
- [x] **Discord.js v14 upgrade completed**
- [x] **Unit tests with Jest (173 tests passing)**
- [x] **CI/CD GitHub workflows**
- [x] **Pre-commit hooks with Husky**

### Technical Stack
- **Discord.js:** v14 (current stable)
- **Node.js:** v18+
- **Database:** MongoDB with Mongoose
- **Testing:** Jest (173 tests, 98% coverage)

---

## jw-discord-api

### Status: 100% Complete

### Completed Features
- [x] Express server setup with middleware stack
- [x] Awilix dependency injection container
- [x] Discord OAuth2 authentication flow
- [x] JWT token management
- [x] User CRUD endpoints
- [x] Guild list and configuration endpoints
- [x] Guild channels endpoint
- [x] Schedule CRUD endpoints
- [x] Dashboard statistics endpoints
- [x] Daily text endpoints
- [x] News endpoints
- [x] Topic CRUD endpoints
- [x] Base repository pattern
- [x] Error handling middleware
- [x] **Rate limiting (100 req/15min)**
- [x] **Security headers (Helmet)**
- [x] **CORS configuration**
- [x] **Unit and integration tests (46 tests passing)**
- [x] **CI/CD GitHub workflows**
- [x] **Pre-commit hooks with Husky**

### API Endpoints

```
# Authentication
POST /api/v1/auth/discord      # Discord OAuth callback
POST /api/v1/auth/login        # Exchange code for token

# Guild Management
GET  /api/v1/guilds            # List user's guilds
GET  /api/v1/guilds/:id        # Get guild details
GET  /api/v1/guilds/:id/config # Get guild configuration
PUT  /api/v1/guilds/:id/config # Update guild configuration
GET  /api/v1/guilds/:id/channels # Get guild text channels

# Schedules
GET    /api/v1/schedules/guild/:id  # Get guild schedules
POST   /api/v1/schedules/guild/:id  # Create schedule
PUT    /api/v1/schedules/:id        # Update schedule
DELETE /api/v1/schedules/:id        # Delete schedule

# Dashboard
GET /api/v1/dashboard/stats    # Overall statistics
GET /api/v1/dashboard/guilds   # User's guilds with stats

# Content
GET  /api/v1/texts             # List daily texts
GET  /api/v1/texts/today       # Get today's text
GET  /api/v1/texts/:date       # Get by date
POST /api/v1/texts/import      # Bulk import texts

GET  /api/v1/news              # List news
GET  /api/v1/news/latest       # Get latest news

GET    /api/v1/topics          # List topics
GET    /api/v1/topics/random   # Get random topic
GET    /api/v1/topics/search   # Search topics
GET    /api/v1/topics/:id      # Get topic by ID
POST   /api/v1/topics          # Create topic
PUT    /api/v1/topics/:id      # Update topic
DELETE /api/v1/topics/:id      # Delete topic

# Users
GET    /api/v1/users           # List users
GET    /api/v1/users/me        # Get current user
GET    /api/v1/users/:id       # Get user by ID
PATCH  /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user

# Health
GET /api/v1/health             # Health check
```

### Technical Stack
- **Framework:** Express.js
- **DI Container:** Awilix
- **Database:** MongoDB with Mongoose
- **Testing:** Jest + Supertest (46 tests)

---

## jw-discord-frontend

### Status: 100% Complete

### Completed Features
- [x] Vue.js 2 + Vuetify setup
- [x] Metronic template integration
- [x] Full routing structure
- [x] Discord OAuth authentication flow
- [x] JWT token management
- [x] API service configured
- [x] Guild list with admin filtering
- [x] **Dashboard with loading/error/empty states**
- [x] **Server overview page**
- [x] **Server settings page (language, prefix, news channel)**
- [x] **Schedule management page (CRUD)**
- [x] **Daily texts viewer page**
- [x] **News list page**
- [x] **Topics list page**
- [x] **Vuex guild module (complete)**
- [x] **Vuex content module (complete)**
- [x] **Common components (LoadingSpinner, ErrorAlert, EmptyState, GuildCard, ConfirmDialog)**
- [x] **Form validators utility**
- [x] **Unit tests (45 tests passing)**
- [x] **CI/CD GitHub workflows**
- [x] **Pre-commit hooks with Husky**
- [x] Netlify deployment config

### Pages Implemented

| Route | Status | Description |
|-------|--------|-------------|
| `/login` | Complete | Discord OAuth login |
| `/dashboard` | Complete | Guild list with filters |
| `/server/:id` | Complete | Server overview |
| `/server/:id/settings` | Complete | Language, prefix, channel settings |
| `/server/:id/schedules` | Complete | Schedule management |
| `/content/texts` | Complete | Daily text browser |
| `/content/news` | Complete | News list viewer |
| `/content/topics` | Complete | Topic browser |
| `/404` | Complete | Not found page |

### Components

```
components/common/
├── LoadingSpinner.vue    # Loading indicator
├── ErrorAlert.vue        # Error display with retry
├── EmptyState.vue        # Empty state placeholder
├── GuildCard.vue         # Server card with avatar
└── ConfirmDialog.vue     # Reusable confirmation dialog

pages/
├── Dashboard.vue         # Main dashboard
├── server/
│   ├── ServerOverview.vue    # Server overview
│   ├── ServerSettings.vue    # Server configuration
│   └── ServerSchedules.vue   # Schedule management
└── content/
    ├── DailyTexts.vue    # Daily text browser
    ├── NewsList.vue      # News list viewer
    └── TopicsList.vue    # Topic browser

utils/
└── validators.js         # Form validation rules
```

### Vuex Modules

**guild.module.js:**
- `GET_GUILDS_ACTION` - Fetch user's guilds
- `GET_GUILD_ACTION` - Get guild with config
- `GET_GUILD_CHANNELS_ACTION` - Get text channels
- `UPDATE_GUILD_CONFIG_ACTION` - Update settings
- `GET_GUILD_SCHEDULES_ACTION` - Get schedules
- `CREATE_SCHEDULE_ACTION` - Create schedule
- `UPDATE_SCHEDULE_ACTION` - Update schedule
- `DELETE_SCHEDULE_ACTION` - Delete schedule

**content.module.js:**
- `GET_DAILY_TEXT_ACTION` - Get daily text
- `GET_NEWS_ACTION` - Get news list
- `GET_TOPICS_ACTION` - Get topics
- `SEARCH_TOPICS_ACTION` - Search topics

### Technical Stack
- **Framework:** Vue.js 2.6
- **UI Library:** Vuetify 2
- **Template:** Metronic
- **State:** Vuex
- **Testing:** Jest + Vue Test Utils (45 tests)

---

## Testing Summary

| Project | Test Count | Coverage | Status |
|---------|------------|----------|--------|
| Bot | 173 | 98% | Passing |
| API | 46 | 65% | Passing |
| Frontend | 45 | - | Passing |
| **Total** | **264** | - | **All Passing** |

---

## CI/CD & Quality

### GitHub Workflows
All three projects have CI/CD workflows configured:
- Automated testing on push/PR
- Linting validation
- Build verification (frontend)

### Pre-commit Hooks
All projects use Husky + lint-staged for:
- ESLint auto-fix
- Prettier formatting
- Preventing commits with failing lints

---

## Deployment

### Recommended Setup

| Service | Bot | API | Frontend |
|---------|-----|-----|----------|
| Railway | Yes | Yes | - |
| Netlify | - | - | Yes |

### Environment Variables

**Bot (.env):**
- `DISCORD_TOKEN` - Bot token
- `DISCORD_BOT_ID` - Bot application ID
- `MONGO_DSN` - MongoDB connection
- `PREFIX` - Default command prefix
- `DEFAULT_LANG` - Default language

**API (.env):**
- `MONGO_URI` - MongoDB connection
- `JWT_SECRET` - JWT signing key
- `DISCORD_CLIENT_ID` - OAuth client ID
- `DISCORD_CLIENT_SECRET` - OAuth secret
- `DISCORD_BOT_TOKEN` - Bot token for API calls

**Frontend (.env):**
- `VUE_APP_JW_DISCORD_API` - API URL
- `VUE_APP_DISCORD_CLIENT_ID` - OAuth client ID

---

## Documentation

| Document | Description |
|----------|-------------|
| [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | This file - overall status |
| [DISCORD_JS_V14_UPGRADE_PLAN.md](DISCORD_JS_V14_UPGRADE_PLAN.md) | Bot upgrade guide (completed) |
| [API_DEVELOPMENT_PLAN.md](API_DEVELOPMENT_PLAN.md) | API implementation guide (completed) |
| [FRONTEND_DEVELOPMENT_PLAN.md](FRONTEND_DEVELOPMENT_PLAN.md) | Frontend guide (completed) |
| [USER_GUIDE.md](USER_GUIDE.md) | Bot commands for users |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | Server configuration |
| [CONFIGURATION.md](CONFIGURATION.md) | Environment variables |

---

## Future Enhancements (Optional)

These features are not required but could be added in the future:

### Bot
- [ ] Slash commands migration
- [ ] Daily text import CLI tool
- [ ] Multi-language daily texts in database
- [ ] Meeting reminders
- [ ] Bible verse lookup
- [ ] Voice channel features

### API
- [ ] Swagger/OpenAPI documentation
- [ ] GraphQL endpoint
- [ ] WebSocket support for real-time updates
- [ ] Activity logging

### Frontend
- [ ] Dark mode
- [ ] Mobile responsive improvements
- [ ] PWA support
- [ ] Real-time notifications

---

## Notes

- Bot can run standalone without API/frontend
- API and frontend are for web-based management
- Discord commands remain the primary interface
- All three projects share the same MongoDB database
- Models are synchronized across projects
