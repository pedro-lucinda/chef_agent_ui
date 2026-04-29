import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '#/components/ui/button'

const ORDER = ['light', 'dark', 'system'] as const

type ThemeName = (typeof ORDER)[number]

const LABEL: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const current =
    (mounted ? (theme as ThemeName | undefined) : undefined) ?? 'dark'

  function cycle() {
    const idx = ORDER.indexOf(current)
    const next = ORDER[(idx + 1) % ORDER.length]
    setTheme(next)
  }

  const Icon = current === 'light' ? Sun : current === 'dark' ? Moon : Monitor

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycle}
      aria-label={`Switch theme (current: ${LABEL[current]})`}
      title={`Theme: ${LABEL[current]}`}
    >
      <Icon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
