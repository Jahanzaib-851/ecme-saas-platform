import { useSessionUser, useToken } from '@/store/authStore'
import AxiosBase from './AxiosBase'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const unauthorizedCodes = [401, 419, 440]

let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token)
        } else {
            prom.reject(error)
        }
    })
    failedQueue = []
}

const AxiosResponseIntrceptorErrorCallback = async (
    error: AxiosError,
): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
    }
    const { response } = error
    const { setToken } = useToken()

    if (
        response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
    ) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            }).then((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token
                return AxiosBase(originalRequest)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            // Correct endpoint: /api/auth/refresh-token
            const { data } = await AxiosBase.post('/auth/refresh-token')
            const newToken = data.token

            setToken(newToken)
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken
            processQueue(null, newToken)
            return AxiosBase(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null)
            setToken('')
            useSessionUser.getState().setUser({})
            useSessionUser.getState().setSessionSignedIn(false)
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    }

    if (response && unauthorizedCodes.includes(response.status)) {
        setToken('')
        useSessionUser.getState().setUser({})
        useSessionUser.getState().setSessionSignedIn(false)
    }

    return Promise.reject(error)
}

export default AxiosResponseIntrceptorErrorCallback
