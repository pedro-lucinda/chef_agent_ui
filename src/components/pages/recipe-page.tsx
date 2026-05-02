import { getRecipe } from '#/services/api'
import type { InstructionStep } from '#/services/api/types'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { SidebarLayout } from '../layouts/sidebar-layout'
import { RecipeCookingMode } from '../modules/recipes/recipe-cooking-mode'
import { RecipeDetailContent } from '../modules/recipes/recipe-detail-content'
import { RecipeDetailError } from '../modules/recipes/recipe-detail-error'
import { RecipeDetailSkeleton } from '../modules/recipes/recipe-detail-skeleton'

interface Props {
  id: string
}

export function RecipePage({ id }: Props) {
  const { getAccessTokenSilently } = useAuth0()
  const [cookingOpen, setCookingOpen] = useState(false)

  const {
    data: recipe,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getRecipe(token, id)
    },
    enabled: !!id,
  })

  const sortedInstructions = useMemo<InstructionStep[]>(() => {
    if (!recipe) return []
    return [...recipe.instructions].sort((a, b) => a.step_number - b.step_number)
  }, [recipe])

  if (isPending) {
    return (
      <SidebarLayout title="Recipe" isTitleLoading>
        <RecipeDetailSkeleton />
      </SidebarLayout>
    )
  }

  if (isError || !recipe) {
    return (
      <SidebarLayout title="Recipe">
        <RecipeDetailError error={error} />
      </SidebarLayout>
    )
  }

  return (
    <>
      <SidebarLayout title={recipe.name}>
        <RecipeDetailContent
          recipe={recipe}
          sortedInstructions={sortedInstructions}
          onOpenCookingMode={() => setCookingOpen(true)}
        />
      </SidebarLayout>
      <RecipeCookingMode recipe={recipe} open={cookingOpen} onOpenChange={setCookingOpen} />
    </>
  )
}
