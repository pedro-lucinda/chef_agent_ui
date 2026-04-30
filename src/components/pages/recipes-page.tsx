import { SidebarLayout } from '../layouts/sidebar-layout'
import { RecipesList } from '../modules/recipes/recipes-list'

export function RecipesPage() {
  return (
    <SidebarLayout title="Recipes">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">My Recipes</h1>
          <p className="text-sm text-muted-foreground">Here you can manage your recipes</p>
        </div>
        <RecipesList />
      </div>
    </SidebarLayout>
  )
}
