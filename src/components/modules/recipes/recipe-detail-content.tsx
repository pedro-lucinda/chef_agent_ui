import { capitalizeRecipeDifficulty, formatRecipeMinutes } from '#/utils/recipe-format'
import type { InstructionStep, Recipe } from '#/services/api/types'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Clock, Users, UtensilsCrossed } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '../../ui/button'
import { RecipeHeroBanner } from './recipe-hero-banner'
import { StepTimer } from './step-timer'

interface Props {
  recipe: Recipe
  sortedInstructions: InstructionStep[]
  onOpenCookingMode: () => void
}

export function RecipeDetailContent({ recipe, sortedInstructions, onOpenCookingMode }: Props) {
  const canCook = sortedInstructions.length > 0

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-y-contain pb-8 [-webkit-overflow-scrolling:touch]">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1 text-muted-foreground" asChild>
          <Link to="/recipes">
            <ArrowLeft className="size-4" />
            Recipes
          </Link>
        </Button>
      </div>

      <RecipeHeroBanner
        name={recipe.name}
        imageUrl={recipe.image_url}
        tags={
          recipe.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <MetaChip
            icon={<Clock className="size-4" />}
            label="Prep"
            value={formatRecipeMinutes(recipe.prep_time)}
          />
          <MetaChip
            icon={<Clock className="size-4" />}
            label="Cook"
            value={formatRecipeMinutes(recipe.cook_time)}
          />
          <MetaChip
            icon={<Clock className="size-4" />}
            label="Total"
            value={formatRecipeMinutes(recipe.total_time)}
          />
          <MetaChip
            icon={<Users className="size-4" />}
            label="Servings"
            value={String(recipe.servings)}
          />
          <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 text-sm">
            <span className="text-muted-foreground">Difficulty</span>
            <span className="font-medium">{capitalizeRecipeDifficulty(recipe.difficulty)}</span>
          </span>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full shrink-0 gap-2 sm:w-auto"
          disabled={!canCook}
          onClick={onOpenCookingMode}
        >
          <UtensilsCrossed className="size-4" />
          Cooking mode
        </Button>
      </div>

      {recipe.description ? (
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UtensilsCrossed className="size-4" aria-hidden />
            </span>
            Ingredients
          </h2>
          <ul className="mt-4 divide-y divide-border/60">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={`${ingredient.name}-${i}`} className="flex gap-3 py-3 first:pt-0">
                <span className="w-16 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                  {ingredient.quantity || '—'}
                </span>
                <span className="min-w-0 text-sm leading-snug text-foreground">
                  {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Instructions</h2>
          <ol className="mt-4 space-y-4">
            {sortedInstructions.map((instruction) => (
              <li
                key={instruction.step_number}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                    aria-hidden
                  >
                    {instruction.step_number}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-base leading-relaxed text-foreground">
                      {instruction.description}
                    </p>
                    {instruction.chef_tip ? (
                      <p className="border-l-2 border-primary/35 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                        <span className="font-medium not-italic text-foreground">Tip: </span>
                        {instruction.chef_tip}
                      </p>
                    ) : null}
                    {instruction.time_minutes > 0 ? (
                      <StepTimer
                        durationMinutes={instruction.time_minutes}
                        stepKey={`${recipe.id}-${instruction.step_number}`}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

function MetaChip({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 text-sm">
      <span className="text-muted-foreground [&_svg]:text-muted-foreground" aria-hidden>
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-foreground">{value}</span>
    </span>
  )
}
