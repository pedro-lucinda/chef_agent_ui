/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string
  readonly VITE_SENTRY_TRACE_PROPAGATION_ORIGINS?: string
  readonly VITE_SENTRY_DISABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
