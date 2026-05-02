import { listRecipes } from '#/services/api'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { RecipeCard } from './recipe-card'

export function RecipesList() {
  const { getAccessTokenSilently } = useAuth0()
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      if (!token) {
        throw new Error('No access token')
      }
      return listRecipes(token)
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!recipes) {
    return <div>No recipes found</div>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} {...recipe} />
      ))}
    </div>
  )
}
