import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { PrintRequest} from "@/lib/types"
import { AuthSlice } from "./authSlice"
import { ClientSlice } from "./clientSlice"

export interface RequestSlice {
    requests: PrintRequest[] | any,
    isLoadRequests: boolean,
    getRequests: (setIsLoading: Function) => Promise<void>
}

export const CreateRequestSlice: StateCreator<
    AuthSlice & ClientSlice & RequestSlice,
    [],
    [],
    RequestSlice
> = (set, get) => ({
    requests: [],
    isLoadRequests: false,

    getRequests: async (setIsLoading) => {
        try {
            const { token } = get()

            // Verificar solo el token, no isLogged
            if (!token) {
                console.log("No hay token disponible")
                setIsLoading(false)
                return
            }

            console.log("Cargando solicitudes...")

            const response = await axios.get("/api/print-jobs", {
                headers: { Authorization: `Bearer ${token}` }
            })

            set({
                requests: response.data,
                isLoadRequests: true
            })

            setIsLoading(false)
            console.log("Solicitudes cargadas:", response.data.length)

        } catch (error) {
            console.error("ERROR GET PRINT JOBS:", error)
            setIsLoading(false)
            set({ isLoadRequests: false })
        }
    }
})