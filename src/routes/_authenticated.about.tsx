import { AboutPage } from '#/components/pages/about-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/about')({
  component: () => {
    return <AboutPage />
  },
})
