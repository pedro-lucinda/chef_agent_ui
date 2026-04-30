import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '#/components/ai-elements/conversation'
import { Message, MessageContent } from '#/components/ai-elements/message'
import type { MessageOut, RecipeFromStream } from '#/services/api/types'
import { MessageSquare } from 'lucide-react'
import { RecipeComponent } from '../recipes/recipe'
import { AiStatus } from './ai-status'

interface Props {
  displayMessages: MessageOut[]
  savedRecipeNames: Set<string>
  isStreaming: boolean
  streamStatus: string | null
  streamError: string | null
  onSaveRecipe: (recipe: RecipeFromStream) => Promise<void>
}

export function ThreadConversation({
  displayMessages,
  savedRecipeNames,
  isStreaming,
  streamStatus,
  streamError,
  onSaveRecipe,
}: Props) {
  return (
    <>
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
                {(message.content || (message.attachments && message.attachments.length > 0)) && (
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
                        onSave={() => onSaveRecipe(recipe)}
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
    </>
  )
}
