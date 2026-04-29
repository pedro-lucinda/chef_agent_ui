import * as Sentry from '@sentry/react'

function buildTracePropagationTargets(): (string | RegExp)[] {
  const targets: (string | RegExp)[] = [
    'localhost',
    /^https?:\/\/localhost(?::\d+)?/,
  ]
  const extra = import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_ORIGINS
  if (extra) {
    for (const origin of extra
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)) {
      targets.push(origin)
    }
  }
  return targets
}

type TanStackRouterInstance = Parameters<
  typeof Sentry.tanstackRouterBrowserTracingIntegration
>[0]

export function initSentry(router: TanStackRouterInstance): void {
  if (import.meta.env.VITE_SENTRY_DISABLED === 'true') {
    return
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    tracesSampleRate: Number(
      import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 1,
    ),
    tracePropagationTargets: buildTracePropagationTargets(),
    enableLogs: true,
  })
}
