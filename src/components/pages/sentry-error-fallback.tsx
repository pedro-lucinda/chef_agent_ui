import type { FallbackRender } from '@sentry/react'
import { Link } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

export const sentryErrorFallback: FallbackRender = ({
  error,
  resetError,
  eventId,
}) => (
  <div
    className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center"
    role="alert"
  >
    <div className="max-w-md space-y-2">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        {error instanceof Error
          ? error.message
          : 'An unexpected error occurred.'}
      </p>
      {eventId ? (
        <p className="text-muted-foreground text-xs">Reference: {eventId}</p>
      ) : null}
    </div>
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button type="button" variant="default" onClick={() => resetError()}>
        Try again
      </Button>
      <Button type="button" variant="outline" asChild>
        <Link to="/">Home</Link>
      </Button>
    </div>
  </div>
)
