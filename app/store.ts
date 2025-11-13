import { create } from "zustand"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import {Client,ClientStatus,ClientData} from "@/lib/types"

interface AppStore {
  username: string
  password: string
  clients: Client[]| null
  token: string | null
  clientStatus:ClientStatus
  clientIdSelected: Number
  isLoading:Boolean
  detailsOfViewedCustomers:ClientData[],
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  AddDetailsOfCostumer:(clientData:ClientData)=> void
  login: () => Promise<void>
  logout: () => void
  getClients:()=> Promise<void>,
  setClientStatus:(clientStatus:ClientStatus)=> void,
  setClientIdSelected:(ClientIdSelected:Number)=> void
  client:ClientData|null
  getClient:()=> Promise<void>
  setClient:(clientData:ClientData)=> void

}

export const useAppStore = create<AppStore>((set, get) => ({
  username: "henryyv",
  password: "password",
  token: null,
  clients:null,
  clientStatus:ClientStatus.ShowAll,
  clientIdSelected:0,
  client:null,
  isLoading:false,
  detailsOfViewedCustomers:[],
  AddDetailsOfCostumer:(clientData)=>{
    set((state) => ({
    ...state,
    detailsOfViewedCustomers: [
        ...(state.detailsOfViewedCustomers || []),
        clientData
    ]
    }))

  },
  setClient:(clientData)=>set({client:clientData}) ,
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setClientIdSelected:(clientIdSelected)=>set({clientIdSelected}),
  getClients:async ()=>{
        axios.get("/api/customers", {
    headers: {
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    }
    })
    .then(response => {
      set({clients:response.data.data})
    
    })
    .catch(error => {
      console.error('Error:', error);
    });
  },
// const [client,setClient] = useState<ClientData | null>(null);
//     const [isLoading,setIsloading] = useState(false);

  setClientStatus:(clientStatus)=> set({clientStatus}),
  getClient:async ()=>{
        set({isLoading:true})
        const {clientIdSelected} = get()
        axios.get(`/api/customers/${clientIdSelected}`, {
        headers: {
        'Authorization':`Bearer ${localStorage.getItem("token")}`
        }
        })
        .then(response => {
            const {detailsOfViewedCustomers} = get()
            let result = response.data;
            set({client:result.data})
            set({isLoading:false})
            if(!detailsOfViewedCustomers.some(detail=> detail.id ==result.data.id)){
                set((state) => ({
                ...state,
                detailsOfViewedCustomers: [
                    ...(state.detailsOfViewedCustomers || []),
                    result.data
                ]
                }))
            }
              
        })
        .catch(error => {
            set({isLoading:false})
        console.error('Error:', error);});
  },
  login: async () => {
    const { username, password } = get()
    try {
      await axios.get("/sanctum/csrf-cookie")
      const response = await axios.post("/api/login", { username, password })
      const token = response.data?.token?.toString()
      if (token) {
        localStorage.setItem("token", token)
        set({ token })
      }
    } catch (err) {
      console.error("Error en login:", err)
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null })
  },
}))
