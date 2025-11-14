import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios from "@/lib/axios"
import {User, Client, ClientStatus, ClientData } from "@/lib/types"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"


interface AppStore {
  username: string
  password: string
  clients: Client[] | null
  token: string | null
  clientStatus: ClientStatus
  clientIdSelected: number
  isLoading: boolean
  detailsOfViewedCustomers: ClientData[]
  client: ClientData | null
  currentLoginInfoUser: User |null
  thereIstoken:Boolean

  // setters
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setClientIdSelected: (id: number) => void
  setClientStatus: (status: ClientStatus) => void
  setClient: (client: ClientData) => void

  // data methods
  AddDetailsOfCostumer: (clientData: ClientData) => void
  getClients: () => Promise<void>
  getClient: () => Promise<void>

  // auth
  login: (router: AppRouterInstance) => Promise<void>
  logout: () => void  
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      username: "henryyv",
      password: "password",
      token: null,
      clients: null,
      clientStatus: ClientStatus.ShowAll,
      clientIdSelected: 0,
      client: null,
      isLoading: false,
      detailsOfViewedCustomers: [],
      currentLoginInfoUser: null,
      thereIstoken:false,

      // ------------------------------
      // SETTERS
      // ------------------------------
      setUsername: (username) => set({ username }),
      setPassword: (password) => set({ password }),
      setClient: (client) => set({ client }),
      setClientIdSelected: (id) => set({ clientIdSelected: id }),
      setClientStatus: (status) => set({ clientStatus: status }),

      AddDetailsOfCostumer: (clientData) => {
        set((state) => ({
          detailsOfViewedCustomers: [
            ...state.detailsOfViewedCustomers,
            clientData,
          ],
        }))
      },

      // ------------------------------
      // GET CLIENTS
      // ------------------------------
      getClients: async () => {
        try {
          const {token} = get()
          const res = await axios.get("/api/customers", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          set({ clients: res.data.data })
          console.log(res)
        } catch (error) {
          console.error("Error loading clients", error)
        }
      },

      // ------------------------------
      // GET CLIENT 
      // ------------------------------
      getClient: async () => {
        const { clientIdSelected, detailsOfViewedCustomers,token } = get()

        set({ isLoading: true })

        const cached = detailsOfViewedCustomers.find(
          (d) => d.id === clientIdSelected
        )

        if (cached) {
          set({ client: cached, isLoading: false })
          return
        }

        try {
          const res = await axios.get(`/api/customers/${clientIdSelected}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const data = res.data.data

          set({ client: data })

          set((state) => ({
            detailsOfViewedCustomers: [...state.detailsOfViewedCustomers, data],
          }))
        } catch (err) {
          console.error("Error loading client", err)
        } finally {
          set({ isLoading: false })
        }
      },

      // ------------------------------
      // LOGIN
      // ------------------------------
      login: async (router) => {
        const { username, password } = get()
        try {
          await axios.get("/sanctum/csrf-cookie")
          const response = await axios.post("/api/login", {
            username,
            password,
          })
          console.log(response)
          const token:string = response.data?.token?.toString()
          const userInfo:User = response?.data?.user
          
          if (token) {
            set({ token })
            set({thereIstoken:true})
          }

          if(userInfo){
            set({currentLoginInfoUser:userInfo})
            if(userInfo.isAdmin){
              router.push("/admin/dashboard")
            }else if(!userInfo.isAdmin){
              router.push("/client/dashboard")
            }
          }

        } catch (err) {
          console.error("Error en login:", err)
        }
      },

      // ------------------------------
      // LOGOUT
      // ------------------------------
      logout: () => {
        set({
          token: null,
          client: null,
          clients: null,
          currentLoginInfoUser:null,
          detailsOfViewedCustomers: [],
          thereIstoken:false,
        })
      },
    }),

    // ------------------------------
    // PERSIST CONFIG
    // ------------------------------
    {
      name: "app-storage", 

      partialize: (state) => ({
        currentLoginInfoUser:state.currentLoginInfoUser,
        token: state.token,
        clients: state.clients,
        client: state.client,
        detailsOfViewedCustomers: state.detailsOfViewedCustomers,
        clientIdSelected: state.clientIdSelected,
        clientStatus: state.clientStatus,
      }),
    }
  )
)
