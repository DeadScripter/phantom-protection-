import { create } from 'zustand'
import { auth } from '../utils/api'

interface AuthState {
  user: any | null
  loading: boolean
  login: (e: string, p: string) => Promise<void>
  signup: (e: string, p: string, cf: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  async login(email, password) {
    await auth.login(email, password)
    await useAuth.getState().fetchMe()
  },

  async signup(email, password, cfToken) {
    await auth.signup(email, password, cfToken)
    await useAuth.getState().fetchMe()
  },

  async logout() {
    await auth.logout()
    set({ user: null })
  },

  async fetchMe() {
    try {
      const { data } = await auth.me()
      set({ user: data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  }
}))
