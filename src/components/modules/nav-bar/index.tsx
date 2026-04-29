import { ThemeToggle } from '#/components/elements/theme-toggle'

export function NavBar() {
  return (
    <nav className="flex items-center justify-end border-b border-border px-4 py-2">
      <ThemeToggle />
    </nav>
  )
}
