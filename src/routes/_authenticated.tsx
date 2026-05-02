import { LoginPage } from '#/components/pages/login-page'
import { useAuth0 } from '@auth0/auth0-react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Spinner } from '../components/elements/spinner'

export const Route = createFileRoute('/_authenticated')({
  component: () => {
    const { isAuthenticated, isLoading } = useAuth0()

    if (isLoading) {
      return <Spinner />
    }
    if (!isAuthenticated) {
      return <LoginPage />
    }

    return <Outlet />
  },
})
