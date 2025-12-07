import Axios from 'axios'
import {getToken} from "@/app/stores/useAppStore"

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withCredentials: true,
})

axios.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = document.cookie
            ?.split("; ")
            ?.find(row => row.startsWith("XSRF-TOKEN="))
            ?.split("=")[1]

        const bearerToken = getToken()

        if (bearerToken) {
            config.headers["Authorization"] = `Bearer ${bearerToken}`
        }
        if (token) {
            config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token)
        }
    }

    return config
})

export default axios
