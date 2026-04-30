import type { PromptInputMessage } from '#/components/ai-elements/prompt-input'
import {
  fileUIPartsToFiles,
  fileUIPartsToMessageAttachments,
  imageFileUIParts,
} from '#/lib/file-ui-part'
import { buildThreadDisplayMessages } from '#/lib/thread-display-messages'
import { streamChatSse } from '#/services/api'
import type { ChatSseEvent, MessageOut, RecipeFromStream, ThreadOut } from '#/services/api/types'
import { useTheadsStore } from '#/store/theads'
import type { QueryClient } from '@tanstack/react-query'
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

function applyStreamChatEvent(
  event: ChatSseEvent,
  setters: {
    setStreamStatus: (s: string) => void
    setStreamRecipes: Dispatch<SetStateAction<RecipeFromStream[]>>
    setStreamAssistantText: Dispatch<SetStateAction<string>>
  },
): void {
  const { setStreamStatus, setStreamRecipes, setStreamAssistantText } = setters
  if (event.type === 'status' && 'status' in event && typeof event.status === 'string') {
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
}

export interface UseThreadStreamChatArgs {
  threadId: string
  thread: ThreadOut | undefined
  queryClient: QueryClient
  getAccessTokenSilently: () => Promise<string>
}

export function useThreadStreamChat({
  threadId,
  thread,
  queryClient,
  getAccessTokenSilently,
}: UseThreadStreamChatArgs) {
  const streamAbortRef = useRef<AbortController | null>(null)
  const invalidateThreadsAfterStreamRef = useRef(false)
  const incomingMessage = useTheadsStore((state) => state.incomingMessage)

  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [streamUserText, setStreamUserText] = useState('')
  const [streamUserAttachments, setStreamUserAttachments] =
    useState<MessageOut['attachments']>(undefined)
  const [streamAssistantText, setStreamAssistantText] = useState('')
  const [streamRecipes, setStreamRecipes] = useState<RecipeFromStream[]>([])
  const [streamStatus, setStreamStatus] = useState<string | null>(null)

  const displayMessages = useMemo(
    () =>
      buildThreadDisplayMessages({
        serverMessages: thread?.messages ?? [],
        threadId: thread?.id ?? threadId,
        isStreaming,
        streamUserText,
        streamUserAttachments,
        streamAssistantText,
        streamRecipes,
      }),
    [
      thread?.messages,
      thread?.id,
      threadId,
      isStreaming,
      streamUserText,
      streamUserAttachments,
      streamAssistantText,
      streamRecipes,
    ],
  )

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const text = message.text.trim()
      const files = message.files ?? []
      if ((!text && files.length === 0) || isStreaming) return

      const pendingHandoff = useTheadsStore.getState().incomingMessage
      if (pendingHandoff?.threadId === threadId) {
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
            thread_id: threadId,
            message: text,
            ...(imageFiles.length > 0 ? { images: imageFiles } : {}),
          },
          {
            signal: abortController.signal,
            onEvent: (event) => {
              applyStreamChatEvent(event, {
                setStreamStatus,
                setStreamRecipes,
                setStreamAssistantText,
              })
            },
          },
        )

        await queryClient.invalidateQueries({ queryKey: ['thread', threadId] })
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
    [getAccessTokenSilently, threadId, isStreaming, queryClient],
  )

  const handleStopStreaming = useCallback(() => {
    streamAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (!incomingMessage || incomingMessage.threadId !== threadId) return
    void handleSubmit({
      text: incomingMessage.message,
      files: incomingMessage.files ?? [],
    })
  }, [incomingMessage, threadId, handleSubmit])

  return {
    input,
    setInput,
    displayMessages,
    isStreaming,
    streamError,
    streamStatus,
    handleSubmit,
    handleStopStreaming,
  }
}
