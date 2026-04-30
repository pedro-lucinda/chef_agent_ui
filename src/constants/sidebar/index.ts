
interface ISidebarItem {
  id: number
  name: string
  path?: string
}

export const SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    id: 1,
    name: 'My Recipes',
    path: '/my-recipes',
  }
]
