import { SidebarLayout } from '../layouts/sidebar-layout'

export function HomePage() {
  return (
    <SidebarLayout>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Welcome to the Chef App</h1>
        <p className="text-sm text-gray-500">
          You can start by asking for a recipe or a meal plan
        </p>
      </div>
   
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Recent Recipes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-gray-200 p-4">
            <h3 className="text-lg font-bold">Recipe 1</h3>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
