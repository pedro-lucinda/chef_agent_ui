export function formatRecipeMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return '—'
  if (totalMinutes < 60) return `${totalMinutes} min`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`
}

export function capitalizeRecipeDifficulty(value: string): string {
  if (!value) return '—'
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}
