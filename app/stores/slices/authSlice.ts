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
  logout: () => void
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
      
      if(!token) {
        const response = await axios.get('/api/user')
        const userdata:User = response.data
        console.log(userdata)
        set({currentLoginInfoUser:userdata})
        router.push(userdata.isAdmin ? "/admin/dashboard" : "/client/dashboard")
      }
      
      if (token) set({ token, isLogged: true })
      if (userInfo) {
        set({ currentLoginInfoUser: userInfo });
        router.push(userInfo.isAdmin ? "/admin/dashboard" : "/client/dashboard")
      }
    } catch (err) {
      console.error("Login error", err)
    }
  },

logout: async () => {
  axios.defaults.withCredentials = true;
  await axios.get('/sanctum/csrf-cookie'); 

  localStorage.removeItem("app-storage");
}
})
