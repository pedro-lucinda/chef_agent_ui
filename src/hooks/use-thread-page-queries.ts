import { getThreadTitleFromMessages } from '#/lib/thread-display-messages'
import { createRecipe, getThread, listRecipes } from '#/services/api'
import type { RecipeCreate, RecipeFromStream } from '#/services/api/types'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

export function useThreadPageQueries(threadId: string) {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const { data: thread, isLoading: isThreadLoading } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getThread(accessToken, threadId)
    },
    enabled: !!threadId,
  })

  const { data: savedRecipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return listRecipes(accessToken)
    },
  })

  const savedRecipeNames = useMemo(
    () => new Set(savedRecipes?.map((r) => r.name) ?? []),
    [savedRecipes],
  )

  const threadTitle = useMemo(
    () => getThreadTitleFromMessages(thread?.messages),
    [thread?.messages],
  )

  const handleSaveRecipe = useCallback(
    async (recipe: RecipeFromStream) => {
      const accessToken = await getAccessTokenSilently()
      const body: RecipeCreate = {
        name: recipe.name,
        description: recipe.description ?? '',
        prep_time: recipe.prep_time ?? 0,
        cook_time: recipe.cook_time ?? 0,
        total_time: recipe.total_time ?? (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0),
        servings: recipe.servings ?? 1,
        difficulty: recipe.difficulty ?? 'medium',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags ?? [],
        image_url: recipe.image_url,
      }
      await createRecipe(accessToken, body)
      await queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
    [getAccessTokenSilently, queryClient],
  )

  return {
    thread,
    isThreadLoading,
    savedRecipeNames,
    threadTitle,
    handleSaveRecipe,
    queryClient,
    getAccessTokenSilently,
  }
}
