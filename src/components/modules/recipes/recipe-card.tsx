import { Button } from '#/components/ui/button'
import type { Recipe } from '#/services/api'
import { useNavigate } from '@tanstack/react-router'

interface Props extends Recipe {}

export function RecipeCard({ ...recipe }: Props) {
  const navigate = useNavigate()

  function handleViewRecipe() {
    navigate({ to: '/recipe/$id', params: { id: recipe.id } })
  }

  return (
    <div className="flex w-102 border bg-card rounded-lg p-4 flex-col gap-2">
      <div>
        <h2 className="text-lg font-bold">{recipe.name}</h2>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Ingredients</p>
        <p className="line-clamp-8 overflow-hidden text-sm leading-snug">
          {recipe.ingredients.map((ingredient, index) => (
            <span key={index}>
              {index > 0 ? <span className="text-muted-foreground"> · </span> : null}
              {ingredient.name}
            </span>
          ))}
        </p>
      </div>
      <Button variant="outline" className="w-full mt-auto" onClick={handleViewRecipe}>
        View Recipe
      </Button>
    </div>
  )
}
