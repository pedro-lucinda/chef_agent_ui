import type { ThreadOut } from '#/services/api'
import { create } from 'zustand'

interface TheadsState {
  activeThead: ThreadOut | null
  setActiveThead: (thead: ThreadOut) => void
}

export const useTheadsStore = create<TheadsState>((set) => ({
  activeThead: null,
  setActiveThead: (thead: ThreadOut) => {
    set({ activeThead: thead })
  },
}))
