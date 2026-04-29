import { create } from 'zustand'

interface UserState {
  name: string
  age: number
  isLoggedIn: boolean
}

export const useUserStore = create<UserState>(() => ({
  name: '',
  age: 0,
  isLoggedIn: false,
}))
