# JW Discord Frontend - Development Plan

This document provides a detailed development plan for completing the jw-discord-frontend project.

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

| Aspect | Current | Target |
|--------|---------|--------|
| Completion | 20% | 100% |
| Pages | 2 working | 10+ |
| Components | ~5 | 20+ |
| Vuex Modules | 2 (partial) | 4 (complete) |

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

### Daily Text Viewer

```
/texts                    # Calendar view of daily texts
/texts/:date              # View specific date

Features:
- Calendar date picker
- Display scripture and commentary
- Language filter
- Share button
```

### News Viewer

```
/news                     # List of news articles

Features:
- Paginated list
- Language filter
- Click to open on JW.org
```

### Topic Management

```
/topics                   # Admin: manage topics

Features:
- List with search
- Create/Edit/Delete
- Export to JSON
```

---

## Phase 5: User Experience

**Priority:** MEDIUM
**Estimated Time:** 3-4 hours

### Toast Notifications

Use Vuetify snackbars for feedback:
- Success messages (green)
- Error messages (red)
- Info messages (blue)

### Confirmation Dialogs

For destructive actions:
- Delete schedule
- Delete topic
- Reset settings

### Responsive Design

Ensure all pages work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

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
