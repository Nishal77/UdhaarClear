// Sentry setup for the Node.js server runtime (API routes, server components,
// the cron reminder engine). Loaded by instrumentation.ts — never import this
// file directly anywhere else.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Fraction of transactions sent for performance tracing. 1.0 = capture
  // everything. Lower this once traffic grows to control Sentry costs.
  tracesSampleRate: 1.0,

  // Sentry's own debug logging — keep off in production, it's noisy.
  debug: false,
})
