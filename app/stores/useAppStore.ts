import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createAuthSlice, AuthSlice } from "./slices/authSlice"
import { createClientSlice, ClientSlice } from "./slices/clientSlice"

type StoreState = AuthSlice & ClientSlice

export const useAppStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createClientSlice(...a),
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
