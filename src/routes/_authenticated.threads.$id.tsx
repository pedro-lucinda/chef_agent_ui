import { ThreadPage } from '#/components/pages/thread-page'
import { createFileRoute, useParams } from '@tanstack/react-router'
export const Route = createFileRoute('/_authenticated/threads/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/_authenticated/threads/$id' })
  return  <ThreadPage id={id} />
}
