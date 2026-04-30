import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { cn } from '#/lib/utils'
import type { ComponentProps } from 'react'
import { useState } from 'react'

type ButtonVariant = NonNullable<ComponentProps<typeof Button>['variant']>

export interface ConfirmActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description: React.ReactNode
  onConfirm: () => Promise<void>
  cancelLabel?: string
  confirmLabel?: string
  /** Shown on the confirm button while `onConfirm` is in flight (default: `{confirmLabel}…`). */
  pendingLabel?: string
  confirmVariant?: ButtonVariant
  contentClassName?: string
  showCloseButton?: boolean
}

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  pendingLabel,
  confirmVariant = 'default',
  contentClassName,
  showCloseButton = false,
}: ConfirmActionDialogProps) {
  const [isPending, setIsPending] = useState(false)

  const confirmButtonLabel = isPending
    ? (pendingLabel ?? `${confirmLabel}…`)
    : confirmLabel

  function handleOpenChange(next: boolean): void {
    if (!next && isPending) return
    onOpenChange(next)
  }

  async function handleConfirm(): Promise<void> {
    setIsPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn('sm:max-w-md', contentClassName)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            disabled={isPending}
            onClick={() => void handleConfirm()}
          >
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
