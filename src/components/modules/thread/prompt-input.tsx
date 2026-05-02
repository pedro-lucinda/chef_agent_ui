import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  type PromptInputMessage,
} from '#/components/ai-elements/prompt-input'
import { Button } from '#/components/ui/button'
import { XIcon } from 'lucide-react'
import type { ChangeEventHandler } from 'react'

interface Props {
  handleSubmit: (message: PromptInputMessage) => Promise<void>
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  value: string
  status: 'streaming' | 'ready'
  onStop?: () => void
}

function PromptInputAttachmentStrip() {
  const { files, remove } = usePromptInputAttachments()
  if (files.length === 0) return null
  return (
    <>
      {files.map((f) => (
        <div
          key={f.id}
          className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/40"
        >
          {f.mediaType?.startsWith('image/') && f.url ? (
            <img src={f.url} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center px-1 text-center text-[10px] text-muted-foreground leading-tight">
              {f.filename ?? 'File'}
            </span>
          )}
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            className="absolute right-0.5 top-0.5 size-5 rounded-full p-0 shadow-sm"
            onClick={() => remove(f.id)}
            aria-label="Remove attachment"
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      ))}
    </>
  )
}

function PromptInputSubmitWithAttachmentsGate({
  value,
  status,
  onStop,
  className,
}: {
  value: string
  status: 'streaming' | 'ready'
  onStop?: () => void
  className?: string
}) {
  const { files } = usePromptInputAttachments()
  const canSubmit = value.trim().length > 0 || files.length > 0
  return (
    <PromptInputSubmit
      status={status === 'streaming' ? 'streaming' : 'ready'}
      disabled={status !== 'streaming' && !canSubmit}
      onStop={onStop}
      className={className}
    />
  )
}

export function PromptInputComponent({ handleSubmit, onChange, value, status, onStop }: Props) {
  return (
    <PromptInput
      accept="image/*"
      multiple
      onSubmit={handleSubmit}
      className="relative mt-4 w-full max-w-7xl mx-auto"
    >
      <PromptInputHeader className="flex flex-wrap gap-2 border-b border-border/50 pb-2">
        <PromptInputAttachmentStrip />
      </PromptInputHeader>
      <PromptInputTextarea
        value={value}
        placeholder="Say something..."
        onChange={onChange}
        className="pr-12 pb-11"
      />
      <PromptInputFooter className="border-t border-border/50 pt-1">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger tooltip="Add images" />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
      </PromptInputFooter>
      <PromptInputSubmitWithAttachmentsGate
        value={value}
        status={status}
        onStop={onStop}
        className="absolute bottom-1 right-1 z-10"
      />
    </PromptInput>
  )
}
