import { TooltipComponent } from '#/components/elements/tooltip'
import { deleteThread, listThreads, type ThreadOut } from '#/services/api'
import { useTheadsStore } from '#/store/theads'
import { SidebarMenuSkeleton } from '@/components/ui/sidebar'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { ThreadItem } from './thread-item'

export function ThreadsList() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const setActiveThead = useTheadsStore((state) => state.setActiveThead)

  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()

  const deleteThreadMutation = useMutation({
    mutationFn: async (threadId: string) => {
      const token = await getAccessTokenSilently()
      await deleteThread(token, threadId)
    },
    onSuccess: (_, threadId) => {
      void queryClient.invalidateQueries({ queryKey: ['threads'] })
      queryClient.removeQueries({ queryKey: ['thread', threadId] })
      if (location.pathname === `/threads/${threadId}`) {
        navigate({ to: '/' })
      }
    },
  })

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
      {isThreadsLoading ? (
        <>
          <SidebarMenuSkeleton />
          <SidebarMenuSkeleton />
          <SidebarMenuSkeleton />
          <SidebarMenuSkeleton />
        </>
      ) : (
        threads?.map((thread) => {
          return (
            <TooltipComponent key={thread.id} content={thread.messages[0]?.content ?? ''}>
              <ThreadItem
                onClick={() => handleSetActiveThead(thread)}
                isActive={location.pathname === `/threads/${thread.id}`}
                title={thread.messages[0]?.content ?? ''}
                onDelete={() => deleteThreadMutation.mutateAsync(thread.id)}
              />
            </TooltipComponent>
          )
        })
      )}
    </>
  )
}
