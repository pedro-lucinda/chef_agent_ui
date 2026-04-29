import { getThread } from "#/services/api"
import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import { SidebarLayout } from "../layouts/sidebar-layout"
import { Skeleton } from "../ui/skeleton"

interface Props {
  id: string
}
export function ThreadPage({ id }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const { data: thread, isLoading: isThreadLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getThread(accessToken, id)
    },
    enabled: !!id,
  })
  
  return (
    <SidebarLayout title={`${thread?.messages[0].content}`} isTitleLoading={isThreadLoading}>
      {isThreadLoading ? <Skeleton className="h-10 w-full" /> :
      <div>
        <h1>Thread Page</h1>
      </div>
      }
    </SidebarLayout>
  )
}