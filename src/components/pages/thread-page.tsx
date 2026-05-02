import { useThreadPageQueries } from '#/hooks/use-thread-page-queries'
import { useThreadStreamChat } from '#/hooks/use-thread-stream-chat'
import { SidebarLayout } from '../layouts/sidebar-layout'
import { PromptInputComponent } from '../modules/thread/prompt-input'
import { ThreadConversation } from '../modules/thread/thread-conversation'
import { Skeleton } from '../ui/skeleton'

interface Props {
  id: string
}

export function ThreadPage({ id }: Props) {
  const {
    thread,
    isThreadLoading,
    savedRecipeNames,
    threadTitle,
    handleSaveRecipe,
    queryClient,
    getAccessTokenSilently,
  } = useThreadPageQueries(id)

  const {
    input,
    setInput,
    displayMessages,
    isStreaming,
    streamError,
    streamStatus,
    handleSubmit,
    handleStopStreaming,
  } = useThreadStreamChat({
    threadId: id,
    thread,
    queryClient,
    getAccessTokenSilently,
  })

  return (
    <SidebarLayout title={threadTitle} isTitleLoading={isThreadLoading}>
      {isThreadLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <div className="flex flex-1 min-h-0 flex-col w-full  mx-auto overflow-hidden">
          <ThreadConversation
            displayMessages={displayMessages}
            savedRecipeNames={savedRecipeNames}
            isStreaming={isStreaming}
            streamStatus={streamStatus}
            streamError={streamError}
            onSaveRecipe={handleSaveRecipe}
          />
          <PromptInputComponent
            handleSubmit={handleSubmit}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            status={isStreaming ? 'streaming' : 'ready'}
            onStop={handleStopStreaming}
          />
        </div>
      )}
    </SidebarLayout>
  )
}
