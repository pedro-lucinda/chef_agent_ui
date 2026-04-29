import { RootLayout } from '#/components/layouts/root-layout'
import type { RouterContext } from '#/lib/tanstack-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
})
