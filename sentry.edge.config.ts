// Sentry setup for the Edge runtime (middleware, edge API routes, if any are
// added later). Loaded by instrumentation.ts — never import this file directly.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})
