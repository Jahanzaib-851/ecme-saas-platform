import { useSessionUser, useToken } from '@/store/authStore'
import AxiosBase from './AxiosBase'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const unauthorizedCodes = [401, 419, 440]

// Auth endpoints that should NEVER trigger a token refresh
const AUTH_PATHS = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/sign-out',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/verify-otp',
    '/auth/reset-password',
    '/auth/google',
]

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

const isAuthEndpoint = (url?: string) =>
    AUTH_PATHS.some((path) => url?.includes(path))

const AxiosResponseIntrceptorErrorCallback = async (
    error: AxiosError,
): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
    }
    const { response } = error
    const { setToken } = useToken()

    // Only attempt token refresh for protected endpoints, not auth endpoints
    if (
        response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthEndpoint(originalRequest.url)
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
