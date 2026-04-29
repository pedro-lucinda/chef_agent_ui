import { TooltipComponent } from "#/components/elements/tooltip"
import { listThreads, type ThreadOut } from "#/services/api"
import { useTheadsStore } from "#/store/theads"
import {
  SidebarMenuButton,
  SidebarMenuSkeleton
} from "@/components/ui/sidebar"
import { useAuth0 } from "@auth0/auth0-react"
import { useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate } from "@tanstack/react-router"


export function ThreadsList() {
  const navigate = useNavigate()
  const location = useLocation()
  const setActiveThead = useTheadsStore((state) => state.setActiveThead)
  
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

  const { data: threads, isLoading: isThreadsLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return listThreads(token)
    },
    enabled: isAuthenticated && !isLoading,
  })


  function handleSetActiveThead(thead: ThreadOut) {
    setActiveThead(thead)
    navigate({ to: '/threads/$id', params: { id: thead.id } })
  }

  return (
   <>
    { isThreadsLoading ? <SidebarMenuSkeleton /> :
      threads?.map((thread) => {
      return (
        <TooltipComponent key={thread.id} content={thread.messages[0].content}>
          <SidebarMenuButton
          className="cursor-pointer" key={thread.id} 
          onClick={() => handleSetActiveThead(thread)} 
          isActive={
            location.pathname === `/threads/${thread.id}`
          }>
            <span className="text-sm font-bold">{thread.messages[0].content.substring(0, 20)}...</span>
          </SidebarMenuButton>
        </TooltipComponent>
      )
    })}
   </>
  )
}