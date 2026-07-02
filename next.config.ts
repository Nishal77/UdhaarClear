import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  devIndicators: false,
};

// withSentryConfig adds build-time instrumentation and uploads source maps
// so stack traces in Sentry point at real source lines instead of minified
// code. org/project/authToken are read from SENTRY_ORG / SENTRY_PROJECT /
// SENTRY_AUTH_TOKEN env vars automatically — only needed in CI for source
// map upload, not for local dev.
export default withSentryConfig(nextConfig, {
  silent: true, // suppress Sentry's build logs unless something fails
});
