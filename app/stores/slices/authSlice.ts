import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { User } from "@/lib/types"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export interface AuthSlice {
  token: string | null
  currentLoginInfoUser: User | null
  isLogged: boolean
  password:string
  user:string
  setUser: (user: string) => void
  setPassword: (password: string) => void
  login: (router: AppRouterInstance) => Promise<void>
  logout: (router: AppRouterInstance) => Promise<void>
}

export const createAuthSlice: StateCreator<AuthSlice> = (set,get) => ({
  token: null,
  currentLoginInfoUser: null,
  isLogged: false,
  user: "henryyv",
  password: "password",
  setUser: (user) => set({ user }),
  setPassword: (password) => set({ password }),

  login: async (router) => {
    try {
      const { user, password } = get()     
      await axios.get("/sanctum/csrf-cookie")
      console.log(user,password)
      
      const response = await axios.post("/api/login", { username:user, password:password })
      console.log(response)
      
      const token = response.data?.token?.toString()
      const userInfo: User = response?.data?.user
      
      if (token) {
        set({ token, isLogged: true })
        
      }

      if (token && userInfo.isAdmin) {
        set({ currentLoginInfoUser: userInfo });
        router.push("/admin/dashboard")
      }

      if(token && !userInfo.isAdmin){
        const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        }) 
        set({currentLoginInfoUser:response.data})
        router.push("/client/dashboard")
      }

    } catch (err) {
      console.error("Login error", err)
    }
  },

logout: async (router) => {
  set({currentLoginInfoUser:null})
  set({token:null})
  set({isLogged:false})
  localStorage.removeItem("app-storage");
}
})
