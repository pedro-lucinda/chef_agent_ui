import { RootLayout } from '#/components/layouts/root-layout'
import { NotFoundPage } from '#/components/pages/not-found-page'
import type { RouterContext } from '#/lib/tanstack-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFoundPage,
  component: () => (
    <RootLayout>
      <Outlet />
    </RootLayout>
  ),
})
