import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { ClientStatus, User, mapUser } from "@/lib/types"
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
      
      await axios.get("/sanctum/csrf-cookie")

      const response = await axios.post("/api/login", { username:user, password:password })
      console.log(response)
      
      const token = response.data?.token?.toString()
      const userInfo = mapUser(response.data.user)
      
      if (token) {
        set({ token, isLogged: true })
      }

      if (token && userInfo.isAdmin) {
        set({ currentLoginInfoUser: userInfo });
        router.push("/admin/dashboard")
      }

      if(token && !userInfo.isAdmin){
        const response = await axios.get("/api/user") 
        set({currentLoginInfoUser:response.data})
        router.push("/client/dashboard")
      }

    } catch (err) {
      console.error("Login error", err)
    }finally{
        set({isLoading:false})
    }
  },

logout: async (router) => {
  axios.post("/api/logout").then(()=>{
    
  }).finally(()=>{
  set({
    token: null,
    currentLoginInfoUser: null,
    isLogged: false,
    requests: [],
    clients: [],
    clientStatus: ClientStatus.ShowAll
  })

    useAppStore.persist.clearStorage()
    router.replace("/")
  })

}
})
