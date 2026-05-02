import { ConfirmActionDialog } from '#/components/modules/dialogs/confirm-action-dialog'
import { Button } from '#/components/ui/button'
import { cn } from '#/utils/cn'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'

interface Props {
  title: string
  isActive: boolean
  onClick: () => void
  onDelete: () => Promise<void>
}

export function ThreadItem({ title, isActive, onClick, onDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const displayTitle = title
    ? title.length > 20
      ? `${title.substring(0, 20)}...`
      : title
    : 'Untitled'

  const dialogPreview = title.length > 120 ? `${title.slice(0, 120)}…` : title || 'Untitled'

  const quotedSnippet = title ? dialogPreview : null

  return (
    <div className="min-w-0 w-full">
      <div className="group/thread-row relative ml-2 flex min-h-7 h-7 items-center gap-1 rounded-sm px-3 hover:bg-primary/10">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'min-w-0 flex-1 cursor-pointer truncate text-left text-sm',
            isActive ? 'font-bold border-b border-primary' : '',
          )}
        >
          {displayTitle}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/15 hover:text-destructive md:opacity-0 md:group-hover/thread-row:opacity-100 md:group-focus-within/thread-row:opacity-100"
          aria-label="Delete conversation"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setConfirmOpen(true)
          }}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this conversation?"
        description={
          <>
            This removes the thread and its messages. This action cannot be undone.
            {quotedSnippet ? (
              <>
                {' '}
                <span className="font-medium text-foreground">“{quotedSnippet}”</span>
              </>
            ) : null}
          </>
        }
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        confirmVariant="destructive"
        onConfirm={onDelete}
      />
    </div>
  )
}
