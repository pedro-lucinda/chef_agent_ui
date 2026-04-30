import {
  OPTIMISTIC_USER_ID,
  STREAMING_ASSISTANT_ID,
  THREAD_DEFAULT_TITLE,
  THREAD_TITLE_MAX_LENGTH,
} from '#/constants/thread'
import type { MessageOut, RecipeFromStream } from '#/services/api/types'

export interface BuildThreadDisplayMessagesArgs {
  serverMessages: MessageOut[]
  threadId: string
  isStreaming: boolean
  streamUserText: string
  streamUserAttachments: MessageOut['attachments']
  streamAssistantText: string
  streamRecipes: RecipeFromStream[]
}

export function buildThreadDisplayMessages({
  serverMessages,
  threadId,
  isStreaming,
  streamUserText,
  streamUserAttachments,
  streamAssistantText,
  streamRecipes,
}: BuildThreadDisplayMessagesArgs): MessageOut[] {
  if (!isStreaming) return serverMessages

  let next = [...serverMessages]
  if (streamUserText || (streamUserAttachments?.length ?? 0) > 0) {
    next = [
      ...next,
      {
        id: OPTIMISTIC_USER_ID,
        role: 'user',
        content: streamUserText,
        thread_id: threadId,
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
    thread_id: threadId,
    created_at: '',
    updated_at: '',
    recipes: streamRecipes.length > 0 ? streamRecipes : undefined,
  })
  return next
}

export function getThreadTitleFromMessages(messages: MessageOut[] | undefined): string {
  const first = messages?.[0]
  const label =
    first?.content?.trim() || first?.attachments?.[0]?.filename || first?.attachments?.[0]?.url
  if (!label) return THREAD_DEFAULT_TITLE
  return label.length > THREAD_TITLE_MAX_LENGTH
    ? `${label.slice(0, THREAD_TITLE_MAX_LENGTH)}…`
    : label
}
