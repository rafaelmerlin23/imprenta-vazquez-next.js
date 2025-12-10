import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { ClientStatus, User } from "@/lib/types"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useAppStore } from "@/app/stores/useAppStore"
import { ClientSlice } from "./clientSlice"
import { RequestSlice } from "./requestSlice"

export interface AuthSlice {
  token: string | null
  currentLoginInfoUser: User | null
  isLogged: boolean
  password: string
  user: string
  error: string | null
  isLoading: boolean
  setUser: (user: string) => void
  setPassword: (password: string) => void
  setError: (error: string | null) => void
  login: (router: AppRouterInstance) => Promise<void>
  logout: (router: AppRouterInstance) => Promise<void>
}

export const createAuthSlice: StateCreator<
  AuthSlice 
  & ClientSlice 
  & RequestSlice,
  [],
  [],AuthSlice> = (set, get) => ({
  token: null,
  currentLoginInfoUser: null,
  isLogged: false,
  user: "",
  password: "",
  error: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),

  login: async (router) => {
    try {
      set({ isLoading: true, error: null })
      const { user, password } = get()
      
      // Always fetch a fresh CSRF cookie before login
      await axios.get("/sanctum/csrf-cookie")

      const response = await axios.post("/api/login", { username:user, password:password })
      console.log(response)
      
      const token = response.data?.token?.toString()
      const userInfo = response.data.user
      
      if (token) {
        set({ token, isLogged: true })
      }

      if (token && userInfo.is_admin) {
        set({ currentLoginInfoUser: userInfo });
        router.push("/admin/dashboard")
      }

      if(token && !userInfo.is_admin){
        const response = await axios.get("/api/user") 
        set({currentLoginInfoUser:response.data})
        router.push("/client/dashboard")
      }

    } catch (err) {
      console.error("Login error", err)
      set({ error: "Error al iniciar sesión. Por favor intenta de nuevo." })
    }finally{
        set({isLoading:false})
    }
  },

logout: async (router) => {
  axios.post("/api/logout").then(()=>{
    set({currentLoginInfoUser:null})
    set({token:null})
    set({isLogged:false})
    localStorage.removeItem("app-storage");
    router.replace("/")
  })
 
}
})
