import { RecipesPage } from '#/components/pages/recipes-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/recipes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecipesPage />
}
