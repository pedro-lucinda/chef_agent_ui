import * as Sentry from '@sentry/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { sentryErrorFallback } from '#/components/pages/sentry-error-fallback'
import { router } from '#/lib/router'
import { queryClient } from '#/lib/tanstack-query'
import { ThemeProvider } from '#/lib/theme-provider'
import './styles.css'

function App() {
  return (
    <Sentry.ErrorBoundary fallback={sentryErrorFallback}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </Sentry.ErrorBoundary>
  )
}

export default App
