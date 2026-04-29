
interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {children}
    </main>
  )
}
