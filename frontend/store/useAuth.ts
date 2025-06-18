import { create } from 'zustand'
import Cookies from 'js-cookie'

type AuthState = {
  token: string | null
  email: string | null
  login: (token: string, email: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: Cookies.get("token") || null,
  email: Cookies.get("email") || null,

  login: (token, email) => {
    Cookies.set("token", token, { expires: 7 }) // 7일간 유지
    Cookies.set("email", email, { expires: 7 })
    set({ token, email })
  },

  logout: () => {
    Cookies.remove("token")
    Cookies.remove("email")
    set({ token: null, email: null })
  },
}))
