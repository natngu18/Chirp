import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true, // To utilize cookie containing refresh token
}

export const axiosInstance = axios.create(config)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error: AxiosError) => {
        return Promise.reject(error)
        if (error.response) {
            // Backend returned "customized" error response
            // if (error.response.data) {
            //     return Promise.reject(error.response.data as ApiError)
            // }

            return Promise.reject(error.response)
        } else if (error.request) {
            // Request was made but no response received
        } else {
            return Promise.reject(error)
        }
    }
)
