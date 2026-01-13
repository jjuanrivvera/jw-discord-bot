# JW Discord Ecosystem - Development Roadmap

This document outlines the remaining development work for each project in the JW Discord ecosystem.

**Last Updated:** January 2026

## Overview

| Project | Current State | Next Priority |
|---------|---------------|---------------|
| jw-discord-bot | 90% complete | Deploy, Discord.js v14 upgrade |
| jw-discord-api | 40% complete | Dashboard endpoints |
| jw-discord-frontend | 20% complete | Guild config pages |

---

## jw-discord-bot

### Completed Features
- [x] Daily text command with pagination
- [x] News feed from JW.org RSS
- [x] Topic search in WOL
- [x] Random topic generator
- [x] Multi-language support (ES, EN, PT)
- [x] Per-guild language configuration
- [x] Per-guild news channel configuration
- [x] Per-guild daily text scheduling
- [x] Admin commands (setlang, setnews, setdaily)
- [x] Utility commands (help, ping, date, avatar)
- [x] Scheduled news notifications
- [x] Scheduled daily text posting
- [x] Configurable timezone
- [x] Configurable bot status
- [x] Comprehensive documentation

### Pending Development

#### High Priority
| Task | Description | Effort | Documentation |
|------|-------------|--------|---------------|
| Discord.js v14 upgrade | Update from v12 to v14 (breaking changes) | Large | [Upgrade Plan](DISCORD_JS_V14_UPGRADE_PLAN.md) |
| Per-guild prefix | Implement custom prefix per server (model exists, not implemented) | Small | - |
| Error handling | Improve error messages and user feedback | Small | - |

#### Medium Priority
| Task | Description | Effort |
|------|-------------|--------|
| Slash commands | Migrate to Discord slash commands (after v14 upgrade) | Large |
| Daily text import script | CLI tool to import daily texts from JSON/EPUB | Medium |
| Multi-language daily texts | Store texts per language in database | Medium |
| Automated tests | Add Jest tests for helpers and commands | Medium |

#### Low Priority
| Task | Description | Effort |
|------|-------------|--------|
| Meeting reminders | Scheduled meeting time notifications | Medium |
| Bible verse lookup | Command to lookup specific verses | Medium |
| Congregation directory | Store congregation info per guild | Large |
| Voice channel features | Read daily text in voice channel | Large |

#### Technical Debt
| Task | Description |
|------|-------------|
| Remove deprecated Discord.js APIs | Update to non-deprecated methods |
| Add input validation | Validate command arguments |
| Implement rate limiting | Prevent command spam |
| Add logging system | Structured logging with levels |

### Discord.js v14 Migration Summary

**Current Version:** v12.5.3 (deprecated)
**Target Version:** v14.x

**Critical Requirements:**
1. Node.js v18+ (currently v14+)
2. Enable `MessageContent` privileged intent in Discord Developer Portal
3. Update all embed code (MessageEmbed -> EmbedBuilder)
4. Update event names (message -> messageCreate)

**Estimated Effort:** 10-14 hours

See [DISCORD_JS_V14_UPGRADE_PLAN.md](DISCORD_JS_V14_UPGRADE_PLAN.md) for detailed step-by-step guide.

---

## jw-discord-api

### Status: 40% Complete

See [API_DEVELOPMENT_PLAN.md](API_DEVELOPMENT_PLAN.md) for detailed implementation guide.

### Completed Features
- [x] Express server setup with middleware stack
- [x] Awilix dependency injection container
- [x] Discord OAuth2 authentication flow
- [x] JWT token management
- [x] User CRUD endpoints
- [x] Guild list endpoint (via Discord API)
- [x] Base repository pattern
- [x] Error handling middleware

### Critical Issues

**Models Out of Sync:** The API models do NOT match the bot's updated models:
- `Guild.newsNotificationChannel` should be `newsNotificationChannelId`
- `Guild` missing `language` field
- `Schedule.channel` should be `channelId`
- `New` missing `language` field

### Development Phases

| Phase | Description | Effort | Priority |
|-------|-------------|--------|----------|
| 1 | Model Synchronization | 2-3 hours | CRITICAL |
| 2 | Guild Configuration Endpoints | 4-6 hours | HIGH |
| 3 | Schedule Management Endpoints | 4-6 hours | HIGH |
| 4 | Dashboard & Statistics | 3-4 hours | MEDIUM |
| 5 | Content Endpoints (texts, news, topics) | 4-6 hours | MEDIUM |
| 6 | Security & Polish | 3-4 hours | MEDIUM |

**Total Estimated Effort:** 20-29 hours

### Endpoints to Implement

```
# Guild Management (Phase 2)
GET    /api/v1/guilds/:id/config      # Get guild configuration
PUT    /api/v1/guilds/:id/config      # Update guild configuration
GET    /api/v1/guilds/:id/channels    # Get guild text channels

# Schedules (Phase 3)
GET    /api/v1/schedules/guild/:id    # Get guild schedules
POST   /api/v1/schedules/guild/:id    # Create schedule
PUT    /api/v1/schedules/:id          # Update schedule
DELETE /api/v1/schedules/:id          # Delete schedule

# Dashboard (Phase 4)
GET    /api/v1/dashboard/stats        # Overall statistics
GET    /api/v1/dashboard/guilds       # User's guilds with stats

# Content (Phase 5)
GET    /api/v1/texts                  # List daily texts
GET    /api/v1/texts/:date            # Get by date
GET    /api/v1/news                   # List news
GET    /api/v1/topics                 # List topics
```

---

## jw-discord-frontend

### Status: 20% Complete (Confirmed January 2026)

See [FRONTEND_DEVELOPMENT_PLAN.md](FRONTEND_DEVELOPMENT_PLAN.md) for detailed implementation guide.

### Completed Features
- [x] Vue.js 2 + Vuetify setup
- [x] Metronic template integration
- [x] Basic routing structure (`/auth`, `/dashboard`, `/login`, `/register`, `/404`)
- [x] Discord OAuth authentication flow (EXCHANGE_CODE action)
- [x] JWT token management (JwtService save/destroy)
- [x] API service configured (`VUE_APP_JW_DISCORD_API`)
- [x] Guild list fetching with admin filtering
- [x] Basic Dashboard.vue showing guild avatars
- [x] Netlify deployment config

### Detailed Code Analysis

#### Auth Module (`auth.module.js`)
- **Working:** `EXCHANGE_CODE` - Calls API's `/api/v1/auth/login` with Discord OAuth code
- **Working:** `SET_AUTH` - Saves JWT token, sets `isAuthenticated`
- **Working:** `PURGE_AUTH` - Clears token on logout
- **Working:** `VERIFY_AUTH` - Token verification via API
- **Missing:** Error handling UI, loading states

#### Guild Module (`guild.module.js`)
- **Working:** `GET_GUILDS_ACTION` - Fetches user's guilds from API
- **Working:** Filters to guilds where user is owner or admin (`permissions & 0x20`)
- **Missing:** Update guild config actions
- **Missing:** Schedule management actions
- **Missing:** Language/channel configuration actions

#### Dashboard.vue
- **Working:** Displays guild avatars in a grid
- **Working:** Links to guild pages
- **Missing:** Guild configuration UI
- **Missing:** Loading/error states

### Pending Development

#### High Priority
| Task | Description | Effort | Status |
|------|-------------|--------|--------|
| Guild config page | `/servers/:id` overview and settings | Medium | Not started |
| Language selector | UI to change server language | Small | Not started |
| Error handling UI | Toast notifications, error states | Small | Not started |
| Loading states | Skeleton loaders, spinners | Small | Not started |

#### Medium Priority
| Task | Description | Effort |
|------|-------------|--------|
| News channel config | UI to set news notification channel | Small |
| Daily text schedule | UI to configure daily text posting | Medium |
| Schedule management | List/create/delete schedules | Medium |
| Daily text viewer | View daily texts by date | Medium |

#### Low Priority
| Task | Description | Effort |
|------|-------------|--------|
| News viewer | Browse news articles | Small |
| Topic management | CRUD interface for topics | Medium |
| Daily text import | Upload JSON to import texts | Medium |
| User settings | User preferences and profile | Small |
| Activity log | View bot activity in server | Medium |

### Vuex Actions Needed

```javascript
// guild.module.js - Actions to implement
GET_GUILD_CONFIG     // Get single guild configuration
UPDATE_GUILD_LANG    // Update guild language
UPDATE_NEWS_CHANNEL  // Set news notification channel
GET_GUILD_SCHEDULES  // List schedules for guild
CREATE_SCHEDULE      // Create new schedule
DELETE_SCHEDULE      // Remove schedule
```

### Pages to Implement

| Route | Status | Description |
|-------|--------|-------------|
| `/login` | Partial | Redirects to Discord OAuth |
| `/callback` | Working | Handles OAuth callback |
| `/dashboard` | Basic | Shows guild list, needs polish |
| `/servers/:id` | Not started | Server overview |
| `/servers/:id/settings` | Not started | Language, prefix settings |
| `/servers/:id/news` | Not started | News channel config |
| `/servers/:id/schedule` | Not started | Daily text schedule |
| `/texts` | Not started | Daily text browser |
| `/topics` | Not started | Topic management |

### Components to Build

```
components/
├── auth/
│   ├── LoginButton.vue      # Redirect to Discord OAuth
│   └── UserMenu.vue         # User dropdown with logout
├── servers/
│   ├── ServerCard.vue       # Guild card with icon/name
│   ├── ServerSelector.vue   # Guild dropdown/list
│   └── ServerSettings.vue   # Language, prefix forms
├── schedule/
│   ├── ScheduleList.vue     # Table of schedules
│   ├── ScheduleForm.vue     # Create/edit schedule
│   └── ChannelSelector.vue  # Discord channel picker
├── texts/
│   ├── DailyTextCard.vue    # Display single text
│   ├── TextCalendar.vue     # Calendar date picker
│   └── ImportForm.vue       # JSON upload form
└── common/
    ├── LanguageSelector.vue # ES/EN/PT dropdown
    ├── TimezonePicker.vue   # Timezone selector
    ├── ConfirmDialog.vue    # Delete confirmation
    ├── LoadingSpinner.vue   # Loading indicator
    └── ErrorAlert.vue       # Error display
```

### API Dependencies

The frontend requires these API endpoints (many not yet implemented):

| Endpoint | API Status | Frontend Needs |
|----------|------------|----------------|
| `POST /auth/login` | Working | OAuth exchange |
| `GET /guilds` | Working | Guild list |
| `GET /guilds/:id/config` | Not implemented | Guild settings page |
| `PUT /guilds/:id/config` | Not implemented | Save settings |
| `GET /guilds/:id/schedules` | Not implemented | Schedule list |
| `POST /guilds/:id/schedules` | Not implemented | Create schedule |
| `DELETE /guilds/:id/schedules/:id` | Not implemented | Delete schedule |

### Development Phases

| Phase | Description | Effort | Dependencies |
|-------|-------------|--------|--------------|
| 1 | Foundation & Polish (loading, errors, components) | 4-6 hours | None |
| 2 | Guild Configuration Pages | 6-8 hours | API Phase 2 |
| 3 | Schedule Management | 4-6 hours | API Phase 3 |
| 4 | Content Viewers (texts, news, topics) | 4-6 hours | API Phase 5 |
| 5 | User Experience (toasts, dialogs, responsive) | 3-4 hours | None |

**Total Estimated Effort:** 21-30 hours

---

## Development Order Recommendation

### Phase 1: Bot Deployment (Ready Now)
1. Commit current bot changes
2. Deploy bot to server (Railway, Heroku, VPS)
3. Test in production Discord servers

### Phase 2: Discord.js v14 Upgrade
1. Follow [DISCORD_JS_V14_UPGRADE_PLAN.md](DISCORD_JS_V14_UPGRADE_PLAN.md)
2. Update Node.js to v18+
3. Enable MessageContent intent
4. Update all code patterns
5. Test thoroughly

### Phase 3: API Completion
1. Follow [API_DEVELOPMENT_PLAN.md](API_DEVELOPMENT_PLAN.md)
2. Sync models (CRITICAL)
3. Implement guild config endpoints
4. Implement schedule endpoints
5. Deploy API

### Phase 4: Frontend MVP
1. Follow [FRONTEND_DEVELOPMENT_PLAN.md](FRONTEND_DEVELOPMENT_PLAN.md)
2. Build foundation components
3. Build server settings page
4. Build schedule management
5. Deploy frontend

### Phase 5: Enhancements
1. Daily text import feature
2. Topic management
3. Activity logging
4. Bot slash commands migration

---

## Effort Summary

| Project | Current | Remaining Effort |
|---------|---------|------------------|
| Bot (v14 upgrade) | 90% | 10-14 hours |
| API | 40% | 20-29 hours |
| Frontend | 20% | 21-30 hours |
| **Total** | | **51-73 hours** |

---

## Technical Considerations

### Model Sync (Critical)
When bot models change, API models MUST be updated:
- `Guild` - Added `newsNotificationChannelId`, `language`
- `Schedule` - Changed `channel` to `channelId`
- `New` - Added `language` field

### Discord.js Migration
See [DISCORD_JS_V14_UPGRADE_PLAN.md](DISCORD_JS_V14_UPGRADE_PLAN.md)

Current: v12 (deprecated)
Target: v14 (current stable)

Critical requirements:
- Node.js v18+
- MessageContent privileged intent
- Updated embed builders
- Event name changes

### Deployment Options

| Service | Bot | API | Frontend | Cost |
|---------|-----|-----|----------|------|
| Railway | ✅ | ✅ | ✅ | Free tier available |
| Heroku | ✅ | ✅ | ❌ | Paid only |
| Netlify | ❌ | ❌ | ✅ | Free tier |
| Vercel | ❌ | ✅ | ✅ | Free tier |
| VPS | ✅ | ✅ | ✅ | ~$5/month |

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | This file - overall status |
| [DISCORD_JS_V14_UPGRADE_PLAN.md](DISCORD_JS_V14_UPGRADE_PLAN.md) | Bot upgrade guide |
| [API_DEVELOPMENT_PLAN.md](API_DEVELOPMENT_PLAN.md) | API implementation guide |
| [FRONTEND_DEVELOPMENT_PLAN.md](FRONTEND_DEVELOPMENT_PLAN.md) | Frontend implementation guide |
| [USER_GUIDE.md](USER_GUIDE.md) | Bot commands for users |
| [ADMIN_GUIDE.md](ADMIN_GUIDE.md) | Server configuration |
| [CONFIGURATION.md](CONFIGURATION.md) | Environment variables |

---

## Notes

- Bot can run standalone without API/frontend
- API and frontend are for web-based management
- Discord commands remain the primary interface
- Focus on bot stability before dashboard features
- Frontend is blocked by API endpoint development
