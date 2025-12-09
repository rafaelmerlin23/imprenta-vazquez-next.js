// const getRequest = async () => {
//         const response = await axios.get("/api/print-jobs", {
//         })
        
//       }

import axios from "@/lib/axios"
import type { StateCreator } from "zustand"
import { PrintRequest, User } from "@/lib/types"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { AuthSlice } from "./authSlice"
import { ClientSlice } from "./clientSlice"

export interface RequestSlice{
    requests: PrintRequest[] | any,
    getRequests:(setIsLoading:Function)=> Promise<void> 
}

export const CreateRequestSlice: StateCreator<
  AuthSlice & ClientSlice & RequestSlice,
  [],
  [],
  RequestSlice
> = (set, get) => ({
    requests: [],

    getRequests: async (isLoading) => {
    try {
        const response = await axios.get("/api/print-jobs")

        set({requests: response.data})
        isLoading(false);
    } catch (error) {
        console.error("ERROR GET PRINT JOBS:", error)
    }
}

})
