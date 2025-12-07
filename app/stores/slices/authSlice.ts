import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { User, mapUser } from "@/lib/types"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

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

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
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
      
      const response = await axios.post("/api/login", { 
        username: user, 
        password: password 
      })
      
      const token = response.data?.token?.toString()
      const userInfo = mapUser(response.data.user)
      
      if (token) {
        set({ token, isLogged: true })
      }

      if (token && userInfo.isAdmin) {
        set({ currentLoginInfoUser: userInfo, isLoading: false })
        router.push("/admin/dashboard")
      }

      if (token && !userInfo.isAdmin) {
        const response = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        set({ currentLoginInfoUser: response.data, isLoading: false })
        router.push("/client/dashboard")
      }

    } catch (err: any) {
      let errorMessage = "Error desconocido al iniciar sesión"
      
      if (err.response) {
        // El servidor respondió con un código de error
        switch (err.response.status) {
          case 401:
            errorMessage = "Credenciales incorrectas"
            break
          case 403:
            errorMessage = "El usuario no está asociado a ningún cliente"
            break
          case 404:
            errorMessage = "Usuario no encontrado"
            break
          case 422:
            errorMessage = "Por favor verifica los datos ingresados"
            break
          default:
            errorMessage = err.response.data?.message || "Error al iniciar sesión"
        }
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión."
      }
      
      set({ 
        error: errorMessage, 
        isLoading: false,
        isLogged: false,
        token: null 
      })
      
      console.error("Login error:", err)
    }
  },

  logout: async (router) => {
    set({
      currentLoginInfoUser: null,
      token: null,
      isLogged: false,
      error: null,
      user: "",
      password: ""
    })
    localStorage.removeItem("app-storage")
    router.push("/")
  }
})