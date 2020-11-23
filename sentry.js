const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://531d88bb22fc4efdbed0cf0d339f3847@o481159.ingest.sentry.io/5529288",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

module.exports = Sentry;