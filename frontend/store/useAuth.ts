import { create } from 'zustand'
import Cookies from 'js-cookie'

type AuthState = {
  token: string | null
  email: string | null
  isAdmin: boolean
  login: (token: string, email: string, isAdmin: boolean) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token: Cookies.get("token") || null,
  email: Cookies.get("email") || null,
  isAdmin: Cookies.get("isAdmin") === "true",

  login: (token, email, isAdmin) => {
    Cookies.set("token", token)
    Cookies.set("email", email)
    Cookies.set("isAdmin", isAdmin.toString())
    set({ token, email, isAdmin })
  },

  logout: () => {
    Cookies.remove("token")
    Cookies.remove("email")
    Cookies.remove("isAdmin")
    set({ token: null, email: null, isAdmin: false })
  },
}))
