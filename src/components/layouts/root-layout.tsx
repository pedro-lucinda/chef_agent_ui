import { NavBar } from '#/components/modules/nav-bar'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="px-4 py-6">{children}</div>
    </main>
  )
}
