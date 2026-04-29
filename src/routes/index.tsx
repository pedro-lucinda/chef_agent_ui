import { HomePage } from '#/components/pages/home-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => {
    return <HomePage />
  },
})
