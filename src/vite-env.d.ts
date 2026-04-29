/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Auth0 API identifier (must match backend `aud` / Auth0 API settings) */
  readonly VITE_AUTH0_AUDIENCE?: string
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string
  readonly VITE_SENTRY_TRACE_PROPAGATION_ORIGINS?: string
  readonly VITE_SENTRY_DISABLED?: string
  
  /** Chef Agent API base including `/api/v1` */
  readonly VITE_BACKEND_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
