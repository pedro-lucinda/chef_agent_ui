import { cn } from '#/lib/utils'
import type { Recipe } from '#/services/api'
import { ChefHat, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../ui/button'
import { StepTimer } from './step-timer'

interface Props {
  recipe: Recipe
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipeCookingMode({ recipe, open, onOpenChange }: Props) {
  const steps = useMemo(
    () => [...recipe.instructions].sort((a, b) => a.step_number - b.step_number),
    [recipe.instructions],
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    setIndex(0)
  }, [open, recipe.id])

  const step = steps[index]
  const total = steps.length
  const isFirst = index <= 0
  const isLast = index >= total - 1

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1))
  }, [total])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, goPrev, goNext, onOpenChange])

  if (!open) return null

  if (total === 0 || !step) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background p-6"
        role="dialog"
        aria-modal="true"
      >
        <p className="text-center text-muted-foreground">No steps for this recipe.</p>
        <Button type="button" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cooking-mode-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0 flex-1">
          <p id="cooking-mode-title" className="truncate text-sm font-medium text-foreground">
            {recipe.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Step {index + 1} of {total} · Esc to exit
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => onOpenChange(false)}
          aria-label="Exit cooking mode"
        >
          <X className="size-5" />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary md:size-20"
          aria-hidden
        >
          <ChefHat className="size-8 md:size-10" />
        </div>
        <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Step {step.step_number}
        </p>
        <p className="mt-3 max-w-2xl text-center text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl md:leading-tight">
          {step.description}
        </p>
        {step.chef_tip ? (
          <p className="mt-6 max-w-xl border-l-2 border-primary/40 pl-4 text-left text-base italic leading-relaxed text-muted-foreground md:text-lg">
            <span className="font-medium not-italic text-foreground">Chef tip: </span>
            {step.chef_tip}
          </p>
        ) : null}
        {step.time_minutes > 0 ? (
          <div className="mt-8 w-full max-w-sm px-2">
            <StepTimer
              durationMinutes={step.time_minutes}
              stepKey={`${recipe.id}-${step.step_number}-${index}`}
              size="lg"
              className="w-full justify-between bg-card"
            />
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-4 border-t bg-muted/20 px-4 py-4">
        <div className="flex justify-center gap-1.5" role="tablist" aria-label="Step progress">
          {steps.map((s, i) => (
            <button
              key={`${s.step_number}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to step ${i + 1}`}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                i === index
                  ? 'w-6 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="min-w-28"
            disabled={isFirst}
            onClick={goPrev}
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          {isLast ? (
            <Button
              type="button"
              size="lg"
              className="min-w-28"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          ) : (
            <Button type="button" size="lg" className="min-w-28" onClick={goNext}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
