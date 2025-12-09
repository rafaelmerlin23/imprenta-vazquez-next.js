import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { Client, ClientStatus, ClientData,FormState } from "@/lib/types"
import { AuthSlice } from "./authSlice"

export interface ClientSlice {
  clients: Client[] 
  client: ClientData | null
  clientStatus: ClientStatus
  clientIdSelected: number
  isLoading: boolean
  detailsOfViewedCustomers: ClientData[]
  formClientState: FormState
  selectedTab:string
  setSelectedTab:(selectedTab:string)=> void
  setClientStatus: (status: ClientStatus) => void
  setClientIdSelected: (id: number) => void
  setClient: (client: ClientData) => void,
  setClients:(clients:Client[])=> void
  setFormClientState: (clientFormState:FormState)=> void
  getClients: () => Promise<void>
  getClient: () => Promise<void>
  deleteClient:(client:Client)=> void
  updateClient:(id:number, data: any)=> Promise<void>
}

export const createClientSlice: StateCreator<
  ClientSlice & AuthSlice,
  [],
  [],
  ClientSlice
> = (set, get) => ({
  clients:[],
  client: null,
  clientStatus: ClientStatus.ShowAll,
  clientIdSelected: 0,
  isLoading: false,
  formClientState:FormState.Show,
  detailsOfViewedCustomers: [],
  selectedTab:"Address",

  setSelectedTab:(selectedTab)=>set({selectedTab}),
  setClients:(clients)=>set({clients}),
  setClientStatus: (status) => set({ clientStatus: status }),
  setClientIdSelected: (id) => set({ clientIdSelected: id }),
  setClient: (client) => set({ client }),
  setFormClientState:(clientFormState)=>set({formClientState:clientFormState}),

  getClients: async () => {
    try {
      const {clients}= get()
      if(clients?.length >0){
        return
      }
      const token = get().token
      const res = await axios.get("/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ clients: res.data.data })
      console.log("hizo algo")
    } catch (err) {
      console.error("Error loading clients", err)
    }
  },
  deleteClient: (client: Client) => {
  const { clients } = get()
  
  const updatedClients = clients.filter(c => c.id !== client.id)
  
  set({ clients: updatedClients })
},



  getClient: async () => {
    const { clientIdSelected, detailsOfViewedCustomers, token } = get()
    set({ isLoading: true })

    if (!clientIdSelected || clientIdSelected === 0) {
      set({ isLoading: false, client: null });
      return;
    }

    const safeDetails = detailsOfViewedCustomers.filter(
      (d) => d && typeof d === "object" && "id" in d
    )

    set({ detailsOfViewedCustomers: safeDetails })

    const cached = safeDetails.find((d) => d.id === clientIdSelected)
    if (cached) {
      set({ client: cached, isLoading: false })
      return
    }

    try {
      const res = await axios.get(`/api/customers/${clientIdSelected}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = res.data.data

      set({
        client: data,
        detailsOfViewedCustomers: [...detailsOfViewedCustomers, data],
      })
    } catch (err) {
      console.error("Error loading client", err)
    } finally {
      set({ isLoading: false })
    }
  },

  updateClient: async (id: number, data: any) => {
    try {
      const token = get().token
      
      await axios.put(`/api/customers/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const refreshed = await axios.get(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedClient = refreshed.data.data

      const { clients, detailsOfViewedCustomers } = get()

      const newClients = clients.map((c) =>
        c.id === id ? updatedClient : c
      )

      const newDetails = detailsOfViewedCustomers.map((d) =>
        d?.id === id ? updatedClient : d
      )

      set({ clients: newClients, detailsOfViewedCustomers: newDetails, client: updatedClient })
      return updatedClient
      /*
      const updatedClients = clients.map(c => 
        c.id === id ? { ...c, ...updatedClient } : c
      )
      set({ clients: updatedClients })

      set({ client: updatedClient })

      const { detailsOfViewedCustomers } = get()
      const updatedDetails = detailsOfViewedCustomers.map(d =>
        d.id === id ? updatedClient : d
      )
      set({ detailsOfViewedCustomers: updatedDetails })

      return updatedClient
      */
    } catch (err) {
      console.error("Error updating client", err)
      throw err
    }
  },
})
