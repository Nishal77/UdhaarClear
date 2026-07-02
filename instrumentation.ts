// Next.js calls `register()` once when a new server instance starts, before
// it accepts any requests. We use it to load the right Sentry config for
// whichever runtime this instance is (Node.js vs Edge) — see
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Next.js calls this for every server-side error it catches (Server
// Components, Route Handlers, Server Actions). Forwarding it to Sentry is
// what actually gets us visibility into production errors.
export { captureRequestError as onRequestError } from '@sentry/nextjs'
