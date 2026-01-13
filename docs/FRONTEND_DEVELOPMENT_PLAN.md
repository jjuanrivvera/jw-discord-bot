# JW Discord Frontend - Development Plan

> **STATUS: ✅ COMPLETED** - All frontend features implemented and tested in January 2026.

This document provides a detailed development plan for completing the jw-discord-frontend project.

## Implementation Summary

| Aspect | Original | Completed |
|--------|----------|-----------|
| Completion | 20% | **100%** ✅ |
| Pages | 2 working | **10+** ✅ |
| Components | ~5 | **20+** ✅ |
| Vuex Modules | 2 (partial) | **4 (complete)** ✅ |
| Tests | None | **45 tests** ✅ |
| CI/CD | None | **GitHub Actions** ✅ |
| Pre-commit hooks | None | **Husky + lint-staged** ✅ |

### Completed Features
- ✅ Vue.js 2 + Vuetify setup
- ✅ Metronic template integration
- ✅ Full routing structure
- ✅ Discord OAuth authentication flow
- ✅ JWT token management
- ✅ API service configured
- ✅ Guild list with admin filtering
- ✅ Dashboard with loading/error/empty states
- ✅ Server overview page
- ✅ Server settings page (language, prefix, news channel)
- ✅ Schedule management page (CRUD)
- ✅ Daily texts viewer page
- ✅ News list page
- ✅ Topics list page
- ✅ Vuex guild module (complete)
- ✅ Vuex content module (complete)
- ✅ Common components (LoadingSpinner, ErrorAlert, EmptyState, GuildCard, ConfirmDialog)
- ✅ Form validators utility
- ✅ Comprehensive test suite
- ✅ Netlify deployment config

---

## Table of Contents

- [Overview](#overview)
- [Current State Analysis](#current-state-analysis)
- [Phase 1: Foundation & Polish](#phase-1-foundation--polish)
- [Phase 2: Guild Configuration Pages](#phase-2-guild-configuration-pages)
- [Phase 3: Schedule Management](#phase-3-schedule-management)
- [Phase 4: Content Viewers](#phase-4-content-viewers)
- [Phase 5: User Experience](#phase-5-user-experience)
- [Component Library](#component-library)
- [API Integration Guide](#api-integration-guide)
- [Deployment](#deployment)

---

## Overview

| Aspect | Original | Final |
|--------|----------|-------|
| Completion | 20% | **100%** ✅ |
| Pages | 2 working | **10+** ✅ |
| Components | ~5 | **20+** ✅ |
| Vuex Modules | 2 (partial) | **4 (complete)** ✅ |

**Tech Stack:**
- Vue.js 2.x
- Vuetify 2.x
- Vuex (state management)
- Metronic Template
- Vue Router

**Related Projects:**
- `jw-discord-api` - Backend API (must be completed first for some features)
- `jw-discord-bot` - Discord bot

---

## Current State Analysis

### What's Working

| Feature | Status | File |
|---------|--------|------|
| Vue + Vuetify setup | Working | `main.js` |
| Metronic template | Working | Layout components |
| Discord OAuth flow | Working | `auth.module.js` |
| JWT storage | Working | `jwt.service.js` |
| API service | Working | `api.service.js` |
| Guild list fetch | Working | `guild.module.js` |
| Dashboard (basic) | Working | `Dashboard.vue` |

### What's Missing

| Feature | Priority | Blocked By |
|---------|----------|------------|
| Guild config pages | High | API endpoints |
| Language selector | High | API endpoints |
| Schedule management | High | API endpoints |
| Loading states | High | Nothing |
| Error handling | High | Nothing |
| News channel config | Medium | API endpoints |
| Daily text viewer | Medium | API endpoints |
| Topic management | Low | API endpoints |

### Current File Structure

```
src/
├── assets/                      # Images, fonts
├── core/
│   ├── config/                  # App configuration
│   ├── plugins/                 # Vue plugins
│   └── services/
│       ├── api.service.js       # Axios wrapper
│       ├── jwt.service.js       # Token storage
│       └── store/
│           ├── auth.module.js   # Auth state
│           ├── guild.module.js  # Guild state (partial)
│           ├── profile.module.js
│           └── config.module.js
├── router.js                    # Vue Router config
├── view/
│   ├── layout/                  # Metronic layouts
│   └── pages/
│       ├── Dashboard.vue        # Guild list (working)
│       └── auth/                # Auth pages (Metronic)
└── main.js                      # App entry
```

### Vuex Store Analysis

#### auth.module.js (Working)
```javascript
// Actions implemented:
LOGIN              // Standard login (unused)
LOGOUT             // Clear auth state
REGISTER           // Standard register (unused)
VERIFY_AUTH        // Verify token with API
EXCHANGE_CODE      // Discord OAuth exchange (main flow)

// State:
{ user: {}, isAuthenticated: boolean, errors: null }
```

#### guild.module.js (Partial)
```javascript
// Actions implemented:
GET_GUILDS_ACTION  // Fetch user's guilds

// Missing actions:
GET_GUILD_CONFIG
UPDATE_GUILD_CONFIG
GET_GUILD_CHANNELS
GET_GUILD_SCHEDULES
CREATE_SCHEDULE
UPDATE_SCHEDULE
DELETE_SCHEDULE
```

---

## Phase 1: Foundation & Polish

**Priority:** HIGH
**Estimated Time:** 4-6 hours
**Dependencies:** None

### Step 1.1: Create Common Components

**Loading Spinner Component**

**File:** `src/components/common/LoadingSpinner.vue`

```vue
<template>
  <div class="d-flex justify-center align-center" :style="{ height: height }">
    <v-progress-circular
      :size="size"
      :width="width"
      color="primary"
      indeterminate
    />
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: { type: Number, default: 50 },
    width: { type: Number, default: 5 },
    height: { type: String, default: '200px' }
  }
};
</script>
```

**Error Alert Component**

**File:** `src/components/common/ErrorAlert.vue`

```vue
<template>
  <v-alert
    v-if="error"
    type="error"
    dismissible
    @input="$emit('dismiss')"
  >
    {{ error }}
  </v-alert>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    error: { type: String, default: null }
  }
};
</script>
```

**Empty State Component**

**File:** `src/components/common/EmptyState.vue`

```vue
<template>
  <v-card class="text-center pa-8" flat>
    <v-icon size="64" color="grey lighten-1">{{ icon }}</v-icon>
    <h3 class="mt-4 text-h6 grey--text">{{ title }}</h3>
    <p class="grey--text text--darken-1">{{ description }}</p>
    <v-btn
      v-if="actionText"
      color="primary"
      @click="$emit('action')"
    >
      {{ actionText }}
    </v-btn>
  </v-card>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: { type: String, default: 'mdi-inbox' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    actionText: { type: String, default: null }
  }
};
</script>
```

### Step 1.2: Update Dashboard with Loading/Error States

**File:** `src/view/pages/Dashboard.vue`

```vue
<template>
  <div>
    <h1 class="mb-4">Your Servers</h1>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <ErrorAlert
      v-else-if="error"
      :error="error"
      @dismiss="error = null"
    />

    <!-- Empty State -->
    <EmptyState
      v-else-if="guilds.length === 0"
      icon="mdi-server-off"
      title="No servers found"
      description="You don't have admin access to any servers with the bot installed."
    />

    <!-- Guild List -->
    <v-row v-else>
      <v-col
        v-for="guild in guilds"
        :key="guild.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <GuildCard :guild="guild" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_GUILDS_ACTION } from '@/core/services/store/guild.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import GuildCard from '@/components/servers/GuildCard.vue';

export default {
  name: 'Dashboard',
  components: {
    LoadingSpinner,
    ErrorAlert,
    EmptyState,
    GuildCard
  },
  data() {
    return {
      loading: true,
      error: null
    };
  },
  computed: {
    ...mapGetters(['guilds'])
  },
  async mounted() {
    try {
      await this.$store.dispatch(GET_GUILDS_ACTION);
    } catch (err) {
      this.error = 'Failed to load servers. Please try again.';
    } finally {
      this.loading = false;
    }
  }
};
</script>
```

### Step 1.3: Create Guild Card Component

**File:** `src/components/servers/GuildCard.vue`

```vue
<template>
  <v-card
    class="guild-card"
    :to="guild.hasBot ? `/servers/${guild.id}` : null"
    :href="!guild.hasBot ? guild.redirect : null"
    hover
  >
    <v-card-text class="text-center">
      <v-avatar size="80" class="mb-3">
        <img :src="guildIcon" :alt="guild.name" />
      </v-avatar>
      <h4 class="text-truncate">{{ guild.name }}</h4>
      <v-chip
        small
        :color="guild.hasBot ? 'success' : 'grey'"
        class="mt-2"
      >
        {{ guild.hasBot ? 'Bot Installed' : 'Add Bot' }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GuildCard',
  props: {
    guild: { type: Object, required: true }
  },
  computed: {
    guildIcon() {
      if (this.guild.icon) {
        return this.guild.icon;
      }
      const name = encodeURIComponent(this.guild.name.replace(/\s+/g, '+'));
      return `https://ui-avatars.com/api/?name=${name}&size=80&background=5865F2&color=fff`;
    }
  }
};
</script>

<style scoped>
.guild-card {
  transition: transform 0.2s;
}
.guild-card:hover {
  transform: translateY(-4px);
}
</style>
```

---

## Phase 2: Guild Configuration Pages

**Priority:** HIGH
**Estimated Time:** 6-8 hours
**Dependencies:** API endpoints (Phase 2 of API plan)

### Step 2.1: Add Routes

**File:** `src/router.js`

Add these routes:

```javascript
{
  path: '/servers/:id',
  name: 'server-overview',
  component: () => import('@/view/pages/servers/ServerOverview.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/servers/:id/settings',
  name: 'server-settings',
  component: () => import('@/view/pages/servers/ServerSettings.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/servers/:id/schedule',
  name: 'server-schedule',
  component: () => import('@/view/pages/servers/ServerSchedule.vue'),
  meta: { requiresAuth: true }
}
```

### Step 2.2: Update Vuex Guild Module

**File:** `src/core/services/store/guild.module.js`

```javascript
import JwtService from '@/core/services/jwt.service';

const API_URL = process.env.VUE_APP_JW_DISCORD_API;

// Action types
export const GET_GUILDS_ACTION = 'getGuilds';
export const GET_GUILD_CONFIG = 'getGuildConfig';
export const UPDATE_GUILD_CONFIG = 'updateGuildConfig';
export const GET_GUILD_CHANNELS = 'getGuildChannels';
export const GET_GUILD_SCHEDULES = 'getGuildSchedules';
export const CREATE_SCHEDULE = 'createSchedule';
export const DELETE_SCHEDULE = 'deleteSchedule';

// Mutation types
export const SET_GUILDS = 'setGuilds';
export const SET_CURRENT_GUILD = 'setCurrentGuild';
export const SET_GUILD_CONFIG = 'setGuildConfig';
export const SET_GUILD_CHANNELS = 'setGuildChannels';
export const SET_GUILD_SCHEDULES = 'setGuildSchedules';
export const ADD_SCHEDULE = 'addSchedule';
export const REMOVE_SCHEDULE = 'removeSchedule';

const state = {
  guilds: [],
  currentGuild: null,
  guildConfig: null,
  guildChannels: [],
  guildSchedules: []
};

const getters = {
  guilds: state => state.guilds,
  currentGuild: state => state.currentGuild,
  guildConfig: state => state.guildConfig,
  guildChannels: state => state.guildChannels,
  guildSchedules: state => state.guildSchedules
};

const actions = {
  async [GET_GUILDS_ACTION](context) {
    const response = await fetch(`${API_URL}/api/v1/guilds`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      let guilds = await response.json();
      guilds = guilds.filter(
        g => g.owner || (g.permissions & 0x20) !== 0
      );
      context.commit(SET_GUILDS, guilds);
    }
  },

  async [GET_GUILD_CONFIG](context, guildId) {
    const response = await fetch(`${API_URL}/api/v1/guilds/${guildId}/config`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const config = await response.json();
      context.commit(SET_GUILD_CONFIG, config);
      return config;
    }
    throw new Error('Failed to fetch guild config');
  },

  async [UPDATE_GUILD_CONFIG](context, { guildId, config }) {
    const response = await fetch(`${API_URL}/api/v1/guilds/${guildId}/config`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (response.ok) {
      const updated = await response.json();
      context.commit(SET_GUILD_CONFIG, updated);
      return updated;
    }
    throw new Error('Failed to update guild config');
  },

  async [GET_GUILD_CHANNELS](context, guildId) {
    const response = await fetch(`${API_URL}/api/v1/guilds/${guildId}/channels`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const channels = await response.json();
      context.commit(SET_GUILD_CHANNELS, channels);
      return channels;
    }
    throw new Error('Failed to fetch channels');
  },

  async [GET_GUILD_SCHEDULES](context, guildId) {
    const response = await fetch(`${API_URL}/api/v1/schedules/guild/${guildId}`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const schedules = await response.json();
      context.commit(SET_GUILD_SCHEDULES, schedules);
      return schedules;
    }
    throw new Error('Failed to fetch schedules');
  },

  async [CREATE_SCHEDULE](context, { guildId, schedule }) {
    const response = await fetch(`${API_URL}/api/v1/schedules/guild/${guildId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schedule)
    });

    if (response.ok) {
      const created = await response.json();
      context.commit(ADD_SCHEDULE, created);
      return created;
    }
    throw new Error('Failed to create schedule');
  },

  async [DELETE_SCHEDULE](context, scheduleId) {
    const response = await fetch(`${API_URL}/api/v1/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`
      }
    });

    if (response.ok) {
      context.commit(REMOVE_SCHEDULE, scheduleId);
      return true;
    }
    throw new Error('Failed to delete schedule');
  }
};

const mutations = {
  [SET_GUILDS](state, guilds) {
    state.guilds = guilds;
  },
  [SET_CURRENT_GUILD](state, guild) {
    state.currentGuild = guild;
  },
  [SET_GUILD_CONFIG](state, config) {
    state.guildConfig = config;
  },
  [SET_GUILD_CHANNELS](state, channels) {
    state.guildChannels = channels;
  },
  [SET_GUILD_SCHEDULES](state, schedules) {
    state.guildSchedules = schedules;
  },
  [ADD_SCHEDULE](state, schedule) {
    state.guildSchedules.push(schedule);
  },
  [REMOVE_SCHEDULE](state, scheduleId) {
    state.guildSchedules = state.guildSchedules.filter(s => s._id !== scheduleId);
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
```

### Step 2.3: Create Server Overview Page

**File:** `src/view/pages/servers/ServerOverview.vue`

```vue
<template>
  <div>
    <!-- Breadcrumb -->
    <v-breadcrumbs :items="breadcrumbs" class="px-0" />

    <LoadingSpinner v-if="loading" />

    <ErrorAlert v-else-if="error" :error="error" />

    <template v-else>
      <!-- Server Header -->
      <v-card class="mb-4">
        <v-card-text class="d-flex align-center">
          <v-avatar size="64" class="mr-4">
            <img :src="guildIcon" :alt="guild.name" />
          </v-avatar>
          <div>
            <h2>{{ guild.name }}</h2>
            <v-chip small :color="languageColor" class="mt-1">
              {{ languageLabel }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>

      <!-- Quick Actions -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card
            :to="`/servers/${guildId}/settings`"
            hover
            class="text-center pa-4"
          >
            <v-icon size="48" color="primary">mdi-cog</v-icon>
            <h4 class="mt-2">Settings</h4>
            <p class="grey--text">Language, prefix, channels</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            :to="`/servers/${guildId}/schedule`"
            hover
            class="text-center pa-4"
          >
            <v-icon size="48" color="success">mdi-clock</v-icon>
            <h4 class="mt-2">Schedules</h4>
            <p class="grey--text">{{ scheduleCount }} active schedules</p>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            hover
            class="text-center pa-4"
            disabled
          >
            <v-icon size="48" color="grey">mdi-history</v-icon>
            <h4 class="mt-2">Activity</h4>
            <p class="grey--text">Coming soon</p>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GET_GUILD_CONFIG,
  GET_GUILD_SCHEDULES
} from '@/core/services/store/guild.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

export default {
  name: 'ServerOverview',
  components: { LoadingSpinner, ErrorAlert },
  data() {
    return {
      loading: true,
      error: null,
      guild: null
    };
  },
  computed: {
    ...mapGetters(['guilds', 'guildConfig', 'guildSchedules']),
    guildId() {
      return this.$route.params.id;
    },
    breadcrumbs() {
      return [
        { text: 'Dashboard', to: '/dashboard', exact: true },
        { text: this.guild?.name || 'Server', disabled: true }
      ];
    },
    guildIcon() {
      if (!this.guild) return '';
      if (this.guild.icon) return this.guild.icon;
      const name = encodeURIComponent(this.guild.name.replace(/\s+/g, '+'));
      return `https://ui-avatars.com/api/?name=${name}`;
    },
    languageLabel() {
      const labels = { es: 'Español', en: 'English', pt: 'Português' };
      return labels[this.guildConfig?.language] || 'Default';
    },
    languageColor() {
      return this.guildConfig?.language ? 'primary' : 'grey';
    },
    scheduleCount() {
      return this.guildSchedules?.length || 0;
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.guild = this.guilds.find(g => g.id === this.guildId);
        if (!this.guild) {
          this.error = 'Server not found';
          return;
        }

        await Promise.all([
          this.$store.dispatch(GET_GUILD_CONFIG, this.guildId),
          this.$store.dispatch(GET_GUILD_SCHEDULES, this.guildId)
        ]);
      } catch (err) {
        this.error = 'Failed to load server data';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

### Step 2.4: Create Server Settings Page

**File:** `src/view/pages/servers/ServerSettings.vue`

```vue
<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" class="px-0" />

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-else-if="error" :error="error" @dismiss="error = null" />

    <v-card v-else>
      <v-card-title>Server Settings</v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="saveSettings">
          <!-- Language -->
          <v-select
            v-model="form.language"
            :items="languages"
            label="Language"
            hint="Bot responses and content language"
            persistent-hint
            outlined
            class="mb-4"
          />

          <!-- News Channel -->
          <v-select
            v-model="form.newsNotificationChannelId"
            :items="channelOptions"
            label="News Notification Channel"
            hint="Channel for automatic news posts"
            persistent-hint
            clearable
            outlined
            class="mb-4"
          />

          <!-- Prefix -->
          <v-text-field
            v-model="form.prefix"
            label="Command Prefix"
            hint="Custom command prefix (leave empty for default: jw!)"
            persistent-hint
            outlined
            class="mb-4"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="resetForm">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="saving"
          @click="saveSettings"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      Settings saved successfully!
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GET_GUILD_CONFIG,
  UPDATE_GUILD_CONFIG,
  GET_GUILD_CHANNELS
} from '@/core/services/store/guild.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';

export default {
  name: 'ServerSettings',
  components: { LoadingSpinner, ErrorAlert },
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      showSuccess: false,
      form: {
        language: null,
        newsNotificationChannelId: null,
        prefix: null
      },
      languages: [
        { text: 'Default (Spanish)', value: null },
        { text: 'Español', value: 'es' },
        { text: 'English', value: 'en' },
        { text: 'Português', value: 'pt' }
      ]
    };
  },
  computed: {
    ...mapGetters(['guilds', 'guildConfig', 'guildChannels']),
    guildId() {
      return this.$route.params.id;
    },
    guild() {
      return this.guilds.find(g => g.id === this.guildId);
    },
    breadcrumbs() {
      return [
        { text: 'Dashboard', to: '/dashboard', exact: true },
        { text: this.guild?.name || 'Server', to: `/servers/${this.guildId}`, exact: true },
        { text: 'Settings', disabled: true }
      ];
    },
    channelOptions() {
      return this.guildChannels.map(ch => ({
        text: `#${ch.name}`,
        value: ch.id
      }));
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.$store.dispatch(GET_GUILD_CONFIG, this.guildId),
          this.$store.dispatch(GET_GUILD_CHANNELS, this.guildId)
        ]);

        this.form = {
          language: this.guildConfig?.language || null,
          newsNotificationChannelId: this.guildConfig?.newsNotificationChannelId || null,
          prefix: this.guildConfig?.prefix || null
        };
      } catch (err) {
        this.error = 'Failed to load settings';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        language: this.guildConfig?.language || null,
        newsNotificationChannelId: this.guildConfig?.newsNotificationChannelId || null,
        prefix: this.guildConfig?.prefix || null
      };
    },
    async saveSettings() {
      this.saving = true;
      this.error = null;

      try {
        await this.$store.dispatch(UPDATE_GUILD_CONFIG, {
          guildId: this.guildId,
          config: this.form
        });
        this.showSuccess = true;
      } catch (err) {
        this.error = 'Failed to save settings';
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
```

---

## Phase 3: Schedule Management

**Priority:** HIGH
**Estimated Time:** 4-6 hours
**Dependencies:** API Schedule endpoints

### Step 3.1: Create Schedule Page

**File:** `src/view/pages/servers/ServerSchedule.vue`

```vue
<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" class="px-0" />

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-else-if="error" :error="error" @dismiss="error = null" />

    <template v-else>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h2>Scheduled Tasks</h2>
        <v-btn color="primary" @click="showDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add Schedule
        </v-btn>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-if="guildSchedules.length === 0"
        icon="mdi-calendar-blank"
        title="No schedules"
        description="Create a schedule to automatically post daily texts or topics."
        action-text="Add Schedule"
        @action="showDialog = true"
      />

      <!-- Schedule List -->
      <v-card v-else>
        <v-list>
          <v-list-item
            v-for="schedule in guildSchedules"
            :key="schedule._id"
          >
            <v-list-item-avatar>
              <v-icon :color="actionColor(schedule.action)">
                {{ actionIcon(schedule.action) }}
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ actionLabel(schedule.action) }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatTime(schedule.time) }} • #{{ getChannelName(schedule.channelId) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon color="error" @click="confirmDelete(schedule)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </template>

    <!-- Create Dialog -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title>Add Schedule</v-card-title>
        <v-card-text>
          <v-select
            v-model="newSchedule.action"
            :items="actions"
            label="Action"
            outlined
          />
          <v-select
            v-model="newSchedule.channelId"
            :items="channelOptions"
            label="Channel"
            outlined
          />
          <v-select
            v-model="newSchedule.time"
            :items="hours"
            label="Time (Hour)"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="creating"
            @click="createSchedule"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Schedule?</v-card-title>
        <v-card-text>
          This schedule will be permanently deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteSchedule"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GET_GUILD_SCHEDULES,
  GET_GUILD_CHANNELS,
  CREATE_SCHEDULE,
  DELETE_SCHEDULE
} from '@/core/services/store/guild.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'ServerSchedule',
  components: { LoadingSpinner, ErrorAlert, EmptyState },
  data() {
    return {
      loading: true,
      creating: false,
      deleting: false,
      error: null,
      showDialog: false,
      showDeleteDialog: false,
      scheduleToDelete: null,
      newSchedule: {
        action: 'sendDailyText',
        channelId: null,
        time: '7'
      },
      actions: [
        { text: 'Send Daily Text', value: 'sendDailyText' },
        { text: 'Send Random Topic', value: 'sendRandomTopic' }
      ],
      hours: Array.from({ length: 24 }, (_, i) => ({
        text: `${i.toString().padStart(2, '0')}:00`,
        value: i.toString()
      }))
    };
  },
  computed: {
    ...mapGetters(['guilds', 'guildSchedules', 'guildChannels']),
    guildId() {
      return this.$route.params.id;
    },
    guild() {
      return this.guilds.find(g => g.id === this.guildId);
    },
    breadcrumbs() {
      return [
        { text: 'Dashboard', to: '/dashboard', exact: true },
        { text: this.guild?.name || 'Server', to: `/servers/${this.guildId}`, exact: true },
        { text: 'Schedules', disabled: true }
      ];
    },
    channelOptions() {
      return this.guildChannels.map(ch => ({
        text: `#${ch.name}`,
        value: ch.id
      }));
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.$store.dispatch(GET_GUILD_SCHEDULES, this.guildId),
          this.$store.dispatch(GET_GUILD_CHANNELS, this.guildId)
        ]);
      } catch (err) {
        this.error = 'Failed to load schedules';
      } finally {
        this.loading = false;
      }
    },
    actionIcon(action) {
      return action === 'sendDailyText' ? 'mdi-book-open-page-variant' : 'mdi-comment-question';
    },
    actionColor(action) {
      return action === 'sendDailyText' ? 'primary' : 'success';
    },
    actionLabel(action) {
      return action === 'sendDailyText' ? 'Daily Text' : 'Random Topic';
    },
    formatTime(time) {
      return `${time.padStart(2, '0')}:00`;
    },
    getChannelName(channelId) {
      const channel = this.guildChannels.find(ch => ch.id === channelId);
      return channel?.name || channelId;
    },
    async createSchedule() {
      this.creating = true;
      try {
        await this.$store.dispatch(CREATE_SCHEDULE, {
          guildId: this.guildId,
          schedule: this.newSchedule
        });
        this.showDialog = false;
        this.newSchedule = { action: 'sendDailyText', channelId: null, time: '7' };
      } catch (err) {
        this.error = 'Failed to create schedule';
      } finally {
        this.creating = false;
      }
    },
    confirmDelete(schedule) {
      this.scheduleToDelete = schedule;
      this.showDeleteDialog = true;
    },
    async deleteSchedule() {
      this.deleting = true;
      try {
        await this.$store.dispatch(DELETE_SCHEDULE, this.scheduleToDelete._id);
        this.showDeleteDialog = false;
        this.scheduleToDelete = null;
      } catch (err) {
        this.error = 'Failed to delete schedule';
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>
```

---

## Phase 4: Content Viewers

**Priority:** MEDIUM
**Estimated Time:** 4-6 hours
**Dependencies:** API Phase 5 (Content Endpoints)

### Step 4.1: Add Content Routes

**File:** `src/router.js` (additions)

```javascript
{
  path: '/texts',
  name: 'texts',
  component: () => import('@/view/pages/content/DailyTexts.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/texts/:date',
  name: 'text-detail',
  component: () => import('@/view/pages/content/DailyTextDetail.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/news',
  name: 'news',
  component: () => import('@/view/pages/content/NewsList.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/topics',
  name: 'topics',
  component: () => import('@/view/pages/content/TopicManagement.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

### Step 4.2: Create Content Vuex Module

**File:** `src/core/services/store/content.module.js` (NEW)

```javascript
import JwtService from '@/core/services/jwt.service';

const API_URL = process.env.VUE_APP_JW_DISCORD_API;

// Action types
export const GET_TEXTS = 'getTexts';
export const GET_TEXT_BY_DATE = 'getTextByDate';
export const GET_NEWS = 'getNews';
export const GET_LATEST_NEWS = 'getLatestNews';
export const GET_TOPICS = 'getTopics';
export const GET_RANDOM_TOPIC = 'getRandomTopic';
export const CREATE_TOPIC = 'createTopic';
export const UPDATE_TOPIC = 'updateTopic';
export const DELETE_TOPIC = 'deleteTopic';

// Mutation types
export const SET_TEXTS = 'setTexts';
export const SET_CURRENT_TEXT = 'setCurrentText';
export const SET_NEWS = 'setNews';
export const SET_TOPICS = 'setTopics';
export const ADD_TOPIC = 'addTopic';
export const MODIFY_TOPIC = 'modifyTopic';
export const REMOVE_TOPIC = 'removeTopic';
export const SET_PAGINATION = 'setPagination';

const state = {
  texts: [],
  currentText: null,
  news: [],
  topics: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

const getters = {
  texts: state => state.texts,
  currentText: state => state.currentText,
  news: state => state.news,
  topics: state => state.topics,
  pagination: state => state.pagination
};

const actions = {
  async [GET_TEXTS](context, { page = 1, limit = 20 } = {}) {
    const response = await fetch(
      `${API_URL}/api/v1/texts?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${JwtService.getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const result = await response.json();
      context.commit(SET_TEXTS, result.data);
      context.commit(SET_PAGINATION, result.pagination);
      return result;
    }
    throw new Error('Failed to fetch texts');
  },

  async [GET_TEXT_BY_DATE](context, date) {
    const response = await fetch(`${API_URL}/api/v1/texts/${date}`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const text = await response.json();
      context.commit(SET_CURRENT_TEXT, text);
      return text;
    }
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch text');
  },

  async [GET_NEWS](context, { page = 1, limit = 20, language = 'es' } = {}) {
    const response = await fetch(
      `${API_URL}/api/v1/news?page=${page}&limit=${limit}&language=${language}`,
      {
        headers: {
          'Authorization': `Bearer ${JwtService.getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const result = await response.json();
      context.commit(SET_NEWS, result.data);
      context.commit(SET_PAGINATION, result.pagination);
      return result;
    }
    throw new Error('Failed to fetch news');
  },

  async [GET_TOPICS](context, { page = 1, limit = 20 } = {}) {
    const response = await fetch(
      `${API_URL}/api/v1/topics?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${JwtService.getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.ok) {
      const result = await response.json();
      context.commit(SET_TOPICS, result.data);
      context.commit(SET_PAGINATION, result.pagination);
      return result;
    }
    throw new Error('Failed to fetch topics');
  },

  async [CREATE_TOPIC](context, topic) {
    const response = await fetch(`${API_URL}/api/v1/topics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topic)
    });

    if (response.ok) {
      const created = await response.json();
      context.commit(ADD_TOPIC, created);
      return created;
    }
    throw new Error('Failed to create topic');
  },

  async [UPDATE_TOPIC](context, { id, topic }) {
    const response = await fetch(`${API_URL}/api/v1/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(topic)
    });

    if (response.ok) {
      const updated = await response.json();
      context.commit(MODIFY_TOPIC, updated);
      return updated;
    }
    throw new Error('Failed to update topic');
  },

  async [DELETE_TOPIC](context, id) {
    const response = await fetch(`${API_URL}/api/v1/topics/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`
      }
    });

    if (response.ok) {
      context.commit(REMOVE_TOPIC, id);
      return true;
    }
    throw new Error('Failed to delete topic');
  }
};

const mutations = {
  [SET_TEXTS](state, texts) {
    state.texts = texts;
  },
  [SET_CURRENT_TEXT](state, text) {
    state.currentText = text;
  },
  [SET_NEWS](state, news) {
    state.news = news;
  },
  [SET_TOPICS](state, topics) {
    state.topics = topics;
  },
  [ADD_TOPIC](state, topic) {
    state.topics.unshift(topic);
  },
  [MODIFY_TOPIC](state, topic) {
    const index = state.topics.findIndex(t => t._id === topic._id);
    if (index !== -1) {
      state.topics.splice(index, 1, topic);
    }
  },
  [REMOVE_TOPIC](state, id) {
    state.topics = state.topics.filter(t => t._id !== id);
  },
  [SET_PAGINATION](state, pagination) {
    state.pagination = pagination;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
```

### Step 4.3: Daily Texts Calendar Page

**File:** `src/view/pages/content/DailyTexts.vue`

```vue
<template>
  <div>
    <h1 class="mb-4">Daily Texts</h1>

    <!-- Date Picker -->
    <v-row>
      <v-col cols="12" md="4">
        <v-date-picker
          v-model="selectedDate"
          full-width
          color="primary"
          @input="loadTextForDate"
        />
      </v-col>

      <v-col cols="12" md="8">
        <LoadingSpinner v-if="loading" height="300px" />

        <EmptyState
          v-else-if="!currentText"
          icon="mdi-book-open-page-variant"
          title="No text available"
          description="Select a date from the calendar to view the daily text."
        />

        <v-card v-else>
          <v-card-title class="primary white--text">
            {{ formatDate(selectedDate) }}
          </v-card-title>
          <v-card-subtitle class="primary white--text pb-2">
            {{ currentText.text }}
          </v-card-subtitle>
          <v-card-text class="pt-4">
            <blockquote class="text-h6 font-italic mb-4">
              "{{ currentText.textContent }}"
            </blockquote>
            <v-divider class="my-4" />
            <div class="explanation" v-html="formatExplanation(currentText.explanation)" />
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="primary"
              @click="shareText"
            >
              <v-icon left>mdi-share</v-icon>
              Share
            </v-btn>
            <v-spacer />
            <v-btn
              text
              :disabled="!hasPreviousDay"
              @click="previousDay"
            >
              <v-icon left>mdi-chevron-left</v-icon>
              Previous
            </v-btn>
            <v-btn
              text
              :disabled="!hasNextDay"
              @click="nextDay"
            >
              Next
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Share Snackbar -->
    <v-snackbar v-model="showCopied" color="success" timeout="2000">
      Link copied to clipboard!
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_TEXT_BY_DATE } from '@/core/services/store/content.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'DailyTexts',
  components: { LoadingSpinner, EmptyState },
  data() {
    return {
      selectedDate: new Date().toISOString().substr(0, 10),
      loading: false,
      showCopied: false
    };
  },
  computed: {
    ...mapGetters(['currentText']),
    hasPreviousDay() {
      return true; // Can always go back
    },
    hasNextDay() {
      const today = new Date().toISOString().substr(0, 10);
      return this.selectedDate < today;
    }
  },
  mounted() {
    this.loadTextForDate();
  },
  methods: {
    async loadTextForDate() {
      this.loading = true;
      try {
        await this.$store.dispatch(GET_TEXT_BY_DATE, this.selectedDate);
      } catch (err) {
        // Text not found is ok
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr + 'T12:00:00');
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formatExplanation(text) {
      // Convert line breaks to paragraphs
      return text.split('\n\n').map(p => `<p>${p}</p>`).join('');
    },
    previousDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() - 1);
      this.selectedDate = date.toISOString().substr(0, 10);
      this.loadTextForDate();
    },
    nextDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      this.selectedDate = date.toISOString().substr(0, 10);
      this.loadTextForDate();
    },
    shareText() {
      const url = `${window.location.origin}/texts/${this.selectedDate}`;
      navigator.clipboard.writeText(url);
      this.showCopied = true;
    }
  }
};
</script>

<style scoped>
.explanation {
  line-height: 1.8;
}
blockquote {
  border-left: 4px solid var(--v-primary-base);
  padding-left: 16px;
  margin-left: 0;
}
</style>
```

### Step 4.4: Daily Text Detail Page

**File:** `src/view/pages/content/DailyTextDetail.vue`

```vue
<template>
  <div>
    <v-btn text :to="{ name: 'texts' }" class="mb-4">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Calendar
    </v-btn>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="!currentText"
      icon="mdi-calendar-remove"
      title="Text not found"
      description="No daily text available for this date."
      action-text="Go to Calendar"
      @action="$router.push({ name: 'texts' })"
    />

    <v-card v-else>
      <v-card-title class="primary white--text">
        {{ formatDate(date) }}
      </v-card-title>
      <v-card-subtitle class="primary white--text pb-2">
        {{ currentText.text }}
      </v-card-subtitle>
      <v-card-text class="pt-4">
        <blockquote class="text-h6 font-italic mb-4">
          "{{ currentText.textContent }}"
        </blockquote>
        <v-divider class="my-4" />
        <div class="explanation" v-html="formatExplanation(currentText.explanation)" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_TEXT_BY_DATE } from '@/core/services/store/content.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'DailyTextDetail',
  components: { LoadingSpinner, EmptyState },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapGetters(['currentText']),
    date() {
      return this.$route.params.date;
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch(GET_TEXT_BY_DATE, this.date);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr + 'T12:00:00');
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formatExplanation(text) {
      return text.split('\n\n').map(p => `<p>${p}</p>`).join('');
    }
  }
};
</script>
```

### Step 4.5: News List Page

**File:** `src/view/pages/content/NewsList.vue`

```vue
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>News</h1>
      <v-select
        v-model="language"
        :items="languages"
        label="Language"
        dense
        outlined
        hide-details
        style="max-width: 200px"
        @change="loadNews"
      />
    </div>

    <LoadingSpinner v-if="loading" />

    <ErrorAlert v-else-if="error" :error="error" />

    <EmptyState
      v-else-if="news.length === 0"
      icon="mdi-newspaper"
      title="No news available"
      description="No news articles found for the selected language."
    />

    <template v-else>
      <v-card>
        <v-list three-line>
          <template v-for="(item, index) in news">
            <v-list-item :key="item._id" :href="item.link" target="_blank">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(item.pubDate) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-open-in-new</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index < news.length - 1" :key="'d-' + item._id" />
          </template>
        </v-list>
      </v-card>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-4">
        <v-pagination
          v-model="page"
          :length="pagination.pages"
          :total-visible="7"
          @input="loadNews"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_NEWS } from '@/core/services/store/content.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'NewsList',
  components: { LoadingSpinner, ErrorAlert, EmptyState },
  data() {
    return {
      loading: true,
      error: null,
      page: 1,
      language: 'es',
      languages: [
        { text: 'Español', value: 'es' },
        { text: 'English', value: 'en' },
        { text: 'Português', value: 'pt' }
      ]
    };
  },
  computed: {
    ...mapGetters(['news', 'pagination'])
  },
  mounted() {
    this.loadNews();
  },
  methods: {
    async loadNews() {
      this.loading = true;
      this.error = null;
      try {
        await this.$store.dispatch(GET_NEWS, {
          page: this.page,
          language: this.language
        });
      } catch (err) {
        this.error = 'Failed to load news';
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>
```

### Step 4.6: Topic Management Page (Admin)

**File:** `src/view/pages/content/TopicManagement.vue`

```vue
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1>Topic Management</h1>
      <div>
        <v-btn text class="mr-2" @click="exportTopics">
          <v-icon left>mdi-download</v-icon>
          Export JSON
        </v-btn>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          Add Topic
        </v-btn>
      </div>
    </div>

    <!-- Search -->
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search topics..."
      outlined
      dense
      clearable
      class="mb-4"
    />

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-else-if="error" :error="error" @dismiss="error = null" />

    <EmptyState
      v-else-if="filteredTopics.length === 0"
      icon="mdi-comment-question"
      title="No topics found"
      :description="search ? 'No topics match your search.' : 'Create your first topic.'"
      :action-text="!search ? 'Add Topic' : null"
      @action="openCreateDialog"
    />

    <v-card v-else>
      <v-data-table
        :headers="headers"
        :items="filteredTopics"
        :items-per-page="10"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-btn icon small @click="openEditDialog(item)">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small color="error" @click="confirmDelete(item)">
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ editingTopic ? 'Edit Topic' : 'Create Topic' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="form.name"
              label="Topic Name"
              :rules="[v => !!v || 'Name is required']"
              outlined
              class="mb-3"
            />
            <v-textarea
              v-model="form.discussion"
              label="Discussion Question"
              :rules="[v => !!v || 'Discussion is required']"
              outlined
              rows="3"
              class="mb-3"
            />
            <v-text-field
              v-model="form.query"
              label="WOL Search Query (optional)"
              hint="Search term for Watchtower Online Library"
              persistent-hint
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            :loading="saving"
            @click="saveTopic"
          >
            {{ editingTopic ? 'Save' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Topic?</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ topicToDelete?.name }}"?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" :loading="deleting" @click="deleteTopic">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccess" color="success" timeout="3000">
      {{ successMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  GET_TOPICS,
  CREATE_TOPIC,
  UPDATE_TOPIC,
  DELETE_TOPIC
} from '@/core/services/store/content.module';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'TopicManagement',
  components: { LoadingSpinner, ErrorAlert, EmptyState },
  data() {
    return {
      loading: true,
      saving: false,
      deleting: false,
      error: null,
      search: '',
      showDialog: false,
      showDeleteDialog: false,
      showSuccess: false,
      successMessage: '',
      formValid: false,
      editingTopic: null,
      topicToDelete: null,
      form: {
        name: '',
        discussion: '',
        query: ''
      },
      headers: [
        { text: 'Name', value: 'name', width: '25%' },
        { text: 'Discussion', value: 'discussion' },
        { text: 'Actions', value: 'actions', sortable: false, width: '100px' }
      ]
    };
  },
  computed: {
    ...mapGetters(['topics']),
    filteredTopics() {
      if (!this.search) return this.topics;
      const search = this.search.toLowerCase();
      return this.topics.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.discussion.toLowerCase().includes(search)
      );
    }
  },
  mounted() {
    this.loadTopics();
  },
  methods: {
    async loadTopics() {
      try {
        await this.$store.dispatch(GET_TOPICS, { limit: 100 });
      } catch (err) {
        this.error = 'Failed to load topics';
      } finally {
        this.loading = false;
      }
    },
    openCreateDialog() {
      this.editingTopic = null;
      this.form = { name: '', discussion: '', query: '' };
      this.showDialog = true;
    },
    openEditDialog(topic) {
      this.editingTopic = topic;
      this.form = {
        name: topic.name,
        discussion: topic.discussion,
        query: topic.query || ''
      };
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
      this.editingTopic = null;
      this.$refs.form?.reset();
    },
    async saveTopic() {
      if (!this.formValid) return;
      this.saving = true;

      try {
        if (this.editingTopic) {
          await this.$store.dispatch(UPDATE_TOPIC, {
            id: this.editingTopic._id,
            topic: this.form
          });
          this.successMessage = 'Topic updated successfully';
        } else {
          await this.$store.dispatch(CREATE_TOPIC, this.form);
          this.successMessage = 'Topic created successfully';
        }
        this.showSuccess = true;
        this.closeDialog();
      } catch (err) {
        this.error = 'Failed to save topic';
      } finally {
        this.saving = false;
      }
    },
    confirmDelete(topic) {
      this.topicToDelete = topic;
      this.showDeleteDialog = true;
    },
    async deleteTopic() {
      this.deleting = true;
      try {
        await this.$store.dispatch(DELETE_TOPIC, this.topicToDelete._id);
        this.successMessage = 'Topic deleted successfully';
        this.showSuccess = true;
        this.showDeleteDialog = false;
        this.topicToDelete = null;
      } catch (err) {
        this.error = 'Failed to delete topic';
      } finally {
        this.deleting = false;
      }
    },
    exportTopics() {
      const dataStr = JSON.stringify(this.topics, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'topics.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>
```

---

## Phase 5: User Experience

**Priority:** MEDIUM
**Estimated Time:** 3-4 hours
**Dependencies:** None (can start immediately)

### Step 5.1: Global Toast Notification System

**File:** `src/plugins/toast.js` (NEW)

```javascript
/**
 * Global toast notification plugin
 * Usage: this.$toast.success('Message'), this.$toast.error('Message')
 */
const ToastPlugin = {
  install(Vue) {
    // Create event bus for toasts
    Vue.prototype.$toast = new Vue({
      data: () => ({
        snackbar: false,
        message: '',
        color: 'info',
        timeout: 3000
      }),
      methods: {
        show({ message, color = 'info', timeout = 3000 }) {
          this.message = message;
          this.color = color;
          this.timeout = timeout;
          this.snackbar = true;
        },
        success(message, timeout = 3000) {
          this.show({ message, color: 'success', timeout });
        },
        error(message, timeout = 5000) {
          this.show({ message, color: 'error', timeout });
        },
        info(message, timeout = 3000) {
          this.show({ message, color: 'info', timeout });
        },
        warning(message, timeout = 4000) {
          this.show({ message, color: 'warning', timeout });
        }
      }
    });
  }
};

export default ToastPlugin;
```

**File:** `src/components/common/GlobalToast.vue`

```vue
<template>
  <v-snackbar
    v-model="$toast.snackbar"
    :color="$toast.color"
    :timeout="$toast.timeout"
    top
    right
  >
    {{ $toast.message }}
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="$toast.snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'GlobalToast'
};
</script>
```

**File:** `src/main.js` (additions)

```javascript
import ToastPlugin from './plugins/toast';
import GlobalToast from './components/common/GlobalToast.vue';

Vue.use(ToastPlugin);

// In App.vue template, add:
// <GlobalToast />
```

### Step 5.2: Reusable Confirmation Dialog Component

**File:** `src/components/common/ConfirmDialog.vue`

```vue
<template>
  <v-dialog
    v-model="dialog"
    :max-width="maxWidth"
    persistent
  >
    <v-card>
      <v-card-title :class="titleClass">
        <v-icon v-if="icon" left :color="iconColor">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="pt-4">
        <slot>{{ message }}</slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="cancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          :loading="loading"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: 'Confirm Action' },
    message: { type: String, default: 'Are you sure you want to proceed?' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
    confirmColor: { type: String, default: 'primary' },
    icon: { type: String, default: null },
    iconColor: { type: String, default: null },
    maxWidth: { type: [String, Number], default: 400 },
    loading: { type: Boolean, default: false }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    titleClass() {
      if (this.confirmColor === 'error') return 'red--text';
      if (this.confirmColor === 'warning') return 'orange--text';
      return '';
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
      this.dialog = false;
    }
  }
};
</script>
```

**Usage Example:**

```vue
<template>
  <div>
    <v-btn color="error" @click="showDeleteDialog = true">
      Delete Item
    </v-btn>

    <ConfirmDialog
      v-model="showDeleteDialog"
      title="Delete Item?"
      message="This action cannot be undone. Are you sure?"
      confirm-text="Delete"
      confirm-color="error"
      icon="mdi-delete"
      icon-color="error"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

export default {
  components: { ConfirmDialog },
  data: () => ({
    showDeleteDialog: false,
    deleting: false
  }),
  methods: {
    async handleDelete() {
      this.deleting = true;
      try {
        await this.deleteItem();
        this.showDeleteDialog = false;
        this.$toast.success('Item deleted successfully');
      } catch (err) {
        this.$toast.error('Failed to delete item');
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>
```

### Step 5.3: Responsive Layout Mixin

**File:** `src/mixins/responsive.js`

```javascript
/**
 * Responsive layout mixin
 * Provides computed properties for screen size detection
 */
export default {
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isTablet() {
      return this.$vuetify.breakpoint.md;
    },
    isDesktop() {
      return this.$vuetify.breakpoint.lgAndUp;
    },
    currentBreakpoint() {
      return this.$vuetify.breakpoint.name;
    },
    // Dynamic column sizes
    colSizes() {
      return {
        full: 12,
        half: this.isMobile ? 12 : 6,
        third: this.isMobile ? 12 : this.isTablet ? 6 : 4,
        quarter: this.isMobile ? 12 : this.isTablet ? 6 : 3
      };
    }
  }
};
```

**Usage Example:**

```vue
<template>
  <v-row>
    <v-col :cols="colSizes.third" v-for="item in items" :key="item.id">
      <ItemCard :item="item" />
    </v-col>
  </v-row>
</template>

<script>
import responsiveMixin from '@/mixins/responsive';

export default {
  mixins: [responsiveMixin]
};
</script>
```

### Step 5.4: Loading State HOC (Higher Order Component)

**File:** `src/components/common/WithLoading.vue`

```vue
<template>
  <div class="with-loading">
    <!-- Loading Overlay -->
    <v-overlay
      v-if="loading && overlay"
      :value="loading"
      absolute
      color="white"
      opacity="0.8"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        :size="50"
      />
    </v-overlay>

    <!-- Inline Loading -->
    <div v-else-if="loading && !overlay" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="size"
      />
      <p v-if="loadingText" class="mt-4 grey--text">{{ loadingText }}</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      dismissible
      @input="$emit('dismiss-error')"
    >
      {{ error }}
      <template #actions v-if="retryable">
        <v-btn text small @click="$emit('retry')">
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Content -->
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'WithLoading',
  props: {
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
    loadingText: { type: String, default: null },
    overlay: { type: Boolean, default: false },
    size: { type: Number, default: 50 },
    retryable: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.with-loading {
  position: relative;
  min-height: 100px;
}
</style>
```

**Usage Example:**

```vue
<template>
  <WithLoading
    :loading="loading"
    :error="error"
    loading-text="Loading your data..."
    retryable
    @retry="loadData"
    @dismiss-error="error = null"
  >
    <YourContent />
  </WithLoading>
</template>
```

### Step 5.5: Add UPDATE_SCHEDULE Action to Guild Module

**File:** `src/core/services/store/guild.module.js` (additions)

```javascript
// Add to action types
export const UPDATE_SCHEDULE = 'updateSchedule';

// Add to mutation types
export const MODIFY_SCHEDULE = 'modifySchedule';

// Add to actions object
async [UPDATE_SCHEDULE](context, { scheduleId, schedule }) {
  const response = await fetch(`${API_URL}/api/v1/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${JwtService.getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(schedule)
  });

  if (response.ok) {
    const updated = await response.json();
    context.commit(MODIFY_SCHEDULE, updated);
    return updated;
  }
  throw new Error('Failed to update schedule');
},

// Add to mutations object
[MODIFY_SCHEDULE](state, schedule) {
  const index = state.guildSchedules.findIndex(s => s._id === schedule._id);
  if (index !== -1) {
    state.guildSchedules.splice(index, 1, schedule);
  }
}
```

### Step 5.6: Keyboard Navigation Mixin

**File:** `src/mixins/keyboard-nav.js`

```javascript
/**
 * Keyboard navigation mixin
 * Adds keyboard shortcuts to components
 */
export default {
  data: () => ({
    keyboardShortcuts: []
  }),
  mounted() {
    this.setupKeyboardNav();
  },
  beforeDestroy() {
    this.cleanupKeyboardNav();
  },
  methods: {
    setupKeyboardNav() {
      this._keydownHandler = (e) => {
        // Check if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }

        this.keyboardShortcuts.forEach(({ key, ctrl, shift, action }) => {
          const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : true;
          const shiftMatch = shift ? e.shiftKey : true;

          if (e.key.toLowerCase() === key.toLowerCase() && ctrlMatch && shiftMatch) {
            e.preventDefault();
            action();
          }
        });
      };

      document.addEventListener('keydown', this._keydownHandler);
    },
    cleanupKeyboardNav() {
      if (this._keydownHandler) {
        document.removeEventListener('keydown', this._keydownHandler);
      }
    },
    registerShortcut(key, action, { ctrl = false, shift = false } = {}) {
      this.keyboardShortcuts.push({ key, ctrl, shift, action });
    }
  }
};
```

**Usage Example:**

```vue
<script>
import keyboardNavMixin from '@/mixins/keyboard-nav';

export default {
  mixins: [keyboardNavMixin],
  mounted() {
    // Register shortcuts
    this.registerShortcut('n', this.openCreateDialog, { ctrl: true });
    this.registerShortcut('s', this.saveChanges, { ctrl: true });
    this.registerShortcut('Escape', this.closeDialog);
  }
};
</script>
```

### Step 5.7: Form Validation Utilities

**File:** `src/utils/validators.js`

```javascript
/**
 * Common validation rules for Vuetify forms
 */
export const rules = {
  required: v => !!v || 'This field is required',

  email: v => !v || /.+@.+\..+/.test(v) || 'Invalid email address',

  minLength: min => v => !v || v.length >= min || `Minimum ${min} characters`,

  maxLength: max => v => !v || v.length <= max || `Maximum ${max} characters`,

  numeric: v => !v || /^\d+$/.test(v) || 'Must be a number',

  alphanumeric: v => !v || /^[a-zA-Z0-9]+$/.test(v) || 'Only letters and numbers',

  url: v => !v || /^https?:\/\/.+/.test(v) || 'Invalid URL',

  hour: v => {
    const num = parseInt(v);
    return (!isNaN(num) && num >= 0 && num <= 23) || 'Must be 0-23';
  },

  language: v => !v || ['es', 'en', 'pt'].includes(v) || 'Invalid language',

  // Prefix validation (optional, max 10 chars, no spaces)
  prefix: v => {
    if (!v) return true;
    if (v.length > 10) return 'Maximum 10 characters';
    if (/\s/.test(v)) return 'No spaces allowed';
    return true;
  }
};

/**
 * Combine multiple rules
 */
export function combine(...rules) {
  return v => {
    for (const rule of rules) {
      const result = rule(v);
      if (result !== true) return result;
    }
    return true;
  };
}
```

**Usage Example:**

```vue
<template>
  <v-form v-model="formValid">
    <v-text-field
      v-model="form.name"
      label="Name"
      :rules="[rules.required, rules.maxLength(50)]"
    />
    <v-text-field
      v-model="form.email"
      label="Email"
      :rules="[rules.required, rules.email]"
    />
    <v-text-field
      v-model="form.prefix"
      label="Prefix"
      :rules="[rules.prefix]"
    />
  </v-form>
</template>

<script>
import { rules } from '@/utils/validators';

export default {
  data: () => ({
    rules,
    formValid: false,
    form: { name: '', email: '', prefix: '' }
  })
};
</script>
```

### Step 5.8: Accessibility Improvements

**File:** `src/directives/focus-trap.js`

```javascript
/**
 * Focus trap directive for modals/dialogs
 * Usage: v-focus-trap
 */
export default {
  bind(el) {
    const focusableElements = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    el._focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    el.addEventListener('keydown', el._focusTrapHandler);

    // Focus first element
    setTimeout(() => firstEl.focus(), 0);
  },
  unbind(el) {
    if (el._focusTrapHandler) {
      el.removeEventListener('keydown', el._focusTrapHandler);
    }
  }
};
```

**Register directive in main.js:**

```javascript
import focusTrap from './directives/focus-trap';
Vue.directive('focus-trap', focusTrap);
```

---

## Component Library

### Common Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `LoadingSpinner.vue` | Loading states | To build |
| `ErrorAlert.vue` | Error display | To build |
| `EmptyState.vue` | Empty lists | To build |
| `ConfirmDialog.vue` | Delete confirmations | To build |

### Server Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `GuildCard.vue` | Guild in dashboard | To build |
| `LanguageSelector.vue` | Language dropdown | To build |
| `ChannelSelector.vue` | Channel dropdown | To build |

### Schedule Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `ScheduleList.vue` | List schedules | To build |
| `ScheduleForm.vue` | Create/edit form | To build |
| `ScheduleCard.vue` | Single schedule | To build |

---

## API Integration Guide

### Environment Configuration

**File:** `.env`

```env
VUE_APP_JW_DISCORD_API=http://localhost:3000
```

### API Service Pattern

All API calls should:
1. Include JWT token in Authorization header
2. Handle errors gracefully
3. Update Vuex state on success

```javascript
// Example action
async fetchData({ commit }, params) {
  try {
    const response = await fetch(`${API_URL}/endpoint`, {
      headers: {
        'Authorization': `Bearer ${JwtService.getToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    commit(SET_DATA, data);
    return data;
  } catch (error) {
    throw error; // Let component handle UI
  }
}
```

---

## Deployment

### Build Command

```bash
npm run build
```

### Environment Variables (Production)

```env
VUE_APP_JW_DISCORD_API=https://api.your-domain.com
```

### Netlify Configuration

**File:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deployment Platforms

| Platform | Notes |
|----------|-------|
| Netlify | Recommended - free tier, easy setup |
| Vercel | Alternative - free tier |
| GitHub Pages | Free but no SPA support without config |

---

## Summary

| Phase | Tasks | Effort | Dependencies |
|-------|-------|--------|--------------|
| 1 | Foundation & Polish | 4-6 hours | None |
| 2 | Guild Config Pages | 6-8 hours | API Phase 2 |
| 3 | Schedule Management | 4-6 hours | API Phase 3 |
| 4 | Content Viewers | 4-6 hours | API Phase 5 |
| 5 | User Experience | 3-4 hours | None |
| **Total** | | **21-30 hours** | |

### Development Order

1. **Phase 1** - Foundation (can start immediately)
2. **Phase 2** - Guild Config (after API Phase 2)
3. **Phase 3** - Schedules (after API Phase 3)
4. **Phase 5** - UX Polish (anytime)
5. **Phase 4** - Content Viewers (lower priority)

### Critical Path

```
API Phase 1 (Model Sync) → API Phase 2 (Guild Config) → Frontend Phase 2
                        → API Phase 3 (Schedules)     → Frontend Phase 3
```

The frontend development is largely blocked by API endpoint completion. Phase 1 (Foundation) can begin immediately, but Phases 2-4 require corresponding API work.
