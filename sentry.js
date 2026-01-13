const Sentry = require('@sentry/node');

// Sentry v7+ no longer requires @sentry/tracing as a separate import
// Tracing is now built into @sentry/node

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console while setting up Sentry
    debug: false
});

module.exports = Sentry;
