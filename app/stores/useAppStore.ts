import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createAuthSlice, AuthSlice } from "./slices/authSlice"
import { createClientSlice, ClientSlice } from "./slices/clientSlice"
import { CreateRequestSlice,RequestSlice} from "./slices/requestSlice"

type StoreState = AuthSlice & ClientSlice & RequestSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createClientSlice(...a),
      ...CreateRequestSlice(...a),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        token: state.token,
        currentLoginInfoUser: state.currentLoginInfoUser,
        detailsOfViewedCustomers: state.detailsOfViewedCustomers,
      }),
    }
  )
)

export const getToken = () => useAppStore.getState().token;