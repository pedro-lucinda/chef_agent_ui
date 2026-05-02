import type { ThreadOut } from '#/services/api'
import { create } from 'zustand'
import type { IncomingMessage } from './types'

interface TheadsState {
  activeThead: ThreadOut | null
  setActiveThead: (thead: ThreadOut) => void
  incomingMessage: IncomingMessage | null
  setIncomingMessage: (incomingMessage: IncomingMessage | null) => void
}

export const useTheadsStore = create<TheadsState>((set) => ({
  activeThead: null,
  setActiveThead: (thead: ThreadOut) => {
    set({ activeThead: thead })
  },
  incomingMessage: null,
  setIncomingMessage: (incomingMessage: IncomingMessage | null) => {
    set({ incomingMessage: incomingMessage })
  },
}))
