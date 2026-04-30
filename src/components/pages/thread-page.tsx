import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation'
import type { PromptInputMessage } from '#/components/ai-elements/prompt-input'
import {
  fileUIPartsToFiles,
  fileUIPartsToMessageAttachments,
  imageFileUIParts,
} from '#/lib/file-ui-part'
import { createRecipe, getThread, listRecipes, streamChatSse } from '#/services/api'
import type { MessageOut, RecipeCreate, RecipeFromStream } from '#/services/api/types'
import { useTheadsStore } from '#/store/theads'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Message, MessageContent } from '../ai-elements/message'
import { SidebarLayout } from '../layouts/sidebar-layout'
import { RecipeComponent } from '../modules/recipes/recipe'
import { AiStatus } from '../modules/thread/ai-status'
import { PromptInputComponent } from '../modules/thread/prompt-input'
import { Skeleton } from '../ui/skeleton'

const STREAMING_ASSISTANT_ID = '__streaming-assistant__'
const OPTIMISTIC_USER_ID = '__optimistic-user__'

interface Props {
  id: string
}

export function ThreadPage({ id }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const streamAbortRef = useRef<AbortController | null>(null)
  const invalidateThreadsAfterStreamRef = useRef(false)
  const incomingMessage = useTheadsStore((state) => state.incomingMessage)

  const { data: thread, isLoading: isThreadLoading } = useQuery({
    queryKey: ['thread', id],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getThread(accessToken, id)
    },
    enabled: !!id,
  })

  const { data: savedRecipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return listRecipes(accessToken)
    },
  })

  const savedRecipeNames = useMemo(
    () => new Set(savedRecipes?.map((r) => r.name) ?? []),
    [savedRecipes],
  )

  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [streamUserText, setStreamUserText] = useState('')
  const [streamUserAttachments, setStreamUserAttachments] =
    useState<MessageOut['attachments']>(undefined)
  const [streamAssistantText, setStreamAssistantText] = useState('')
  const [streamRecipes, setStreamRecipes] = useState<RecipeFromStream[]>([])
  const [streamStatus, setStreamStatus] = useState<string | null>(null)

  const displayMessages = useMemo((): MessageOut[] => {
    const server = thread?.messages ?? []
    if (!isStreaming) return server

    let next = [...server]
    if (streamUserText || (streamUserAttachments?.length ?? 0) > 0) {
      next = [
        ...next,
        {
          id: OPTIMISTIC_USER_ID,
          role: 'user',
          content: streamUserText,
          thread_id: thread?.id ?? id,
          created_at: '',
          updated_at: '',
          attachments:
            streamUserAttachments && streamUserAttachments.length > 0
              ? streamUserAttachments
              : undefined,
        },
      ]
    }

    next = next.filter((m) => m.id !== STREAMING_ASSISTANT_ID)
    next.push({
      id: STREAMING_ASSISTANT_ID,
      role: 'assistant',
      content: streamAssistantText,
      thread_id: thread?.id ?? id,
      created_at: '',
      updated_at: '',
      recipes: streamRecipes.length > 0 ? streamRecipes : undefined,
    })
    return next
  }, [
    thread?.messages,
    thread?.id,
    id,
    isStreaming,
    streamUserText,
    streamUserAttachments,
    streamAssistantText,
    streamRecipes,
  ])

  const threadTitle = useMemo(() => {
    const first = thread?.messages[0]
    const label =
      first?.content?.trim() || first?.attachments?.[0]?.filename || first?.attachments?.[0]?.url
    if (!label) return 'Thread'
    return label.length > 80 ? `${label.slice(0, 80)}…` : label
  }, [thread?.messages])

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const text = message.text.trim()
      const files = message.files ?? []
      if ((!text && files.length === 0) || isStreaming) return

      const pendingHandoff = useTheadsStore.getState().incomingMessage
      if (pendingHandoff?.threadId === id) {
        invalidateThreadsAfterStreamRef.current = true
        useTheadsStore.getState().setIncomingMessage(null)
      } else {
        invalidateThreadsAfterStreamRef.current = false
      }

      setInput('')
      setStreamUserText(text)
      setStreamUserAttachments(fileUIPartsToMessageAttachments(files))
      setStreamAssistantText('')
      setStreamRecipes([])
      setStreamStatus(null)
      setStreamError(null)
      setIsStreaming(true)

      try {
        const abortController = new AbortController()
        streamAbortRef.current = abortController
        const accessToken = await getAccessTokenSilently()
        const imageFiles = await fileUIPartsToFiles(imageFileUIParts(files))
        await streamChatSse(
          accessToken,
          {
            thread_id: id,
            message: text,
            ...(imageFiles.length > 0 ? { images: imageFiles } : {}),
          },
          {
            signal: abortController.signal,
            onEvent: (event) => {
              if (
                event.type === 'status' &&
                'status' in event &&
                typeof event.status === 'string'
              ) {
                setStreamStatus(event.status)
                return
              }
              if (event.type === 'data' && 'data' in event && typeof event.data === 'string') {
                const token = event.data
                try {
                  const parsed = JSON.parse(token) as unknown
                  if (parsed !== null && typeof parsed === 'object') {
                    const obj = parsed as Record<string, unknown>
                    if (Array.isArray(obj.recipes)) {
                      setStreamRecipes(obj.recipes as RecipeFromStream[])
                    }
                    return
                  }
                } catch {
                  // not JSON — safe to render as text
                }
                setStreamAssistantText((prev) => prev + token)
                return
              }
              if (event.type === 'recipe' && 'recipes' in event && Array.isArray(event.recipes)) {
                setStreamRecipes(event.recipes as RecipeFromStream[])
              }
            },
          },
        )

        await queryClient.invalidateQueries({ queryKey: ['thread', id] })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setStreamError('Something went wrong. Please try again.')
          console.error(err)
        }
      } finally {
        streamAbortRef.current = null
        setIsStreaming(false)
        setStreamUserText('')
        setStreamUserAttachments(undefined)
        setStreamAssistantText('')
        setStreamRecipes([])
        setStreamStatus(null)
        if (invalidateThreadsAfterStreamRef.current) {
          queryClient.invalidateQueries({ queryKey: ['threads'] })
          invalidateThreadsAfterStreamRef.current = false
        }
      }
    },
    [getAccessTokenSilently, id, isStreaming, queryClient],
  )

  const handleStopStreaming = useCallback(() => {
    streamAbortRef.current?.abort()
  }, [])

  const handleSaveRecipe = useCallback(
    async (recipe: RecipeFromStream) => {
      const accessToken = await getAccessTokenSilently()
      const body: RecipeCreate = {
        name: recipe.name,
        description: recipe.description ?? '',
        prep_time: recipe.prep_time ?? 0,
        cook_time: recipe.cook_time ?? 0,
        total_time: recipe.total_time ?? (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0),
        servings: recipe.servings ?? 1,
        difficulty: recipe.difficulty ?? 'medium',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags ?? [],
        image_url: recipe.image_url,
      }
      await createRecipe(accessToken, body)
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    [getAccessTokenSilently, queryClient],
  )

  useEffect(() => {
    if (!incomingMessage || incomingMessage.threadId !== id) return
    void handleSubmit({
      text: incomingMessage.message,
      files: incomingMessage.files ?? [],
    })
  }, [incomingMessage, id, handleSubmit])

  return (
    <SidebarLayout title={threadTitle} isTitleLoading={isThreadLoading}>
      {isThreadLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <div className="flex flex-1 min-h-0 flex-col w-full  mx-auto overflow-hidden">
          <Conversation>
            <ConversationContent>
              {displayMessages.length === 0 ? (
                <ConversationEmptyState
                  icon={<MessageSquare className="size-12" />}
                  title="Start a conversation"
                  description="Type a message below to begin chatting"
                />
              ) : (
                displayMessages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    {(message.content ||
                      (message.attachments && message.attachments.length > 0)) && (
                      <MessageContent>
                        {message.content ? (
                          <span className="whitespace-pre-wrap">{message.content}</span>
                        ) : null}
                        {message.role === 'user' &&
                          message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {message.attachments.map((att, idx) =>
                                att.mediaType?.startsWith('image/') ? (
                                  <img
                                    key={`${message.id}-att-${idx}`}
                                    src={att.url}
                                    alt={att.filename ?? 'Attachment'}
                                    className="max-h-48 max-w-full rounded-md border border-border/60 object-contain"
                                    loading="lazy"
                                  />
                                ) : (
                                  <a
                                    key={`${message.id}-att-${idx}`}
                                    href={att.url}
                                    download={att.filename}
                                    className="text-xs text-primary underline-offset-2 hover:underline"
                                  >
                                    {att.filename ?? 'File'}
                                  </a>
                                ),
                              )}
                            </div>
                          )}
                      </MessageContent>
                    )}
                    {message.recipes && message.recipes.length > 0 && (
                      <div className="flex flex-col gap-3 w-full">
                        {message.recipes.map((recipe) => (
                          <RecipeComponent
                            key={recipe.name}
                            {...recipe}
                            initialSaved={savedRecipeNames.has(recipe.name)}
                            onSave={() => handleSaveRecipe(recipe)}
                          />
                        ))}
                      </div>
                    )}
                  </Message>
                ))
              )}
              {isStreaming && <AiStatus message={streamStatus ?? undefined} />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          {streamError && (
            <p className="text-center text-sm text-destructive pb-1">{streamError}</p>
          )}
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
