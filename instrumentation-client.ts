// Client-side Sentry setup. Next.js runs this file in the browser before
// React hydrates — see
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  // NEXT_PUBLIC_ prefix required — this value gets bundled into client JS.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})

// Lets Sentry record a span for every client-side route change, so slow
// navigations show up in Sentry's performance view.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
