import { Button } from '#/components/ui/button'
import type { RecipeFromStream } from '#/services/api/types'
import { BookmarkCheck, BookmarkPlus, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface Props extends RecipeFromStream {
  onSave?: () => Promise<void>
  initialSaved?: boolean
}

export function RecipeChatComponent({ onSave, initialSaved = false, ...recipe }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(initialSaved)

  async function handleSave() {
    if (!onSave || isSaving || isSaved) return
    setIsSaving(true)
    try {
      await onSave()
      setIsSaved(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold">{recipe.name}</h3>
          {recipe.description && (
            <p className="mt-1 text-sm text-muted-foreground">{recipe.description}</p>
          )}
          {(recipe.prep_time != null || recipe.cook_time != null || recipe.servings != null) && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {recipe.prep_time != null && <span>Prep: {recipe.prep_time} min</span>}
              {recipe.cook_time != null && <span>Cook: {recipe.cook_time} min</span>}
              {recipe.servings != null && <span>Serves: {recipe.servings}</span>}
              {recipe.difficulty && <span>Difficulty: {recipe.difficulty}</span>}
            </div>
          )}
        </div>

        {onSave && (
          <Button
            size="sm"
            variant={isSaved ? 'secondary' : 'outline'}
            disabled={isSaving || isSaved}
            onClick={handleSave}
            className="shrink-0"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isSaved ? (
              <>
                <BookmarkCheck className="size-4" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="size-4" />
                Save
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Ingredients</h4>
        <ul className="list-inside list-disc space-y-0.5 text-sm">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.name}>
              {ingredient.quantity} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">Instructions</h4>
        <ol className="list-inside list-decimal space-y-1 text-sm">
          {recipe.instructions.map((step) => (
            <li key={step.step_number}>
              {step.description}
              {step.chef_tip && (
                <span className="ml-1 text-xs text-muted-foreground italic">
                  Tip: {step.chef_tip}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
