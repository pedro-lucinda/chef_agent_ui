import { RecipePage } from '#/components/pages/recipe-page'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/recipe/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/_authenticated/recipe/$id' })
  return <RecipePage id={id} />
}
