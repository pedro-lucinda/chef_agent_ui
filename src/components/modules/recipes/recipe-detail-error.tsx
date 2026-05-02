import { Link } from '@tanstack/react-router'
import { ChefHat } from 'lucide-react'
import { Button } from '../../ui/button'

interface Props {
  error: unknown
}

export function RecipeDetailError({ error }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <ChefHat className="size-12 text-muted-foreground" aria-hidden />
      <div className="max-w-sm space-y-1">
        <p className="text-lg font-medium text-foreground">Could not load recipe</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : 'It may have been removed or the link is invalid.'}
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link to="/recipes">Back to my recipes</Link>
      </Button>
    </div>
  )
}
