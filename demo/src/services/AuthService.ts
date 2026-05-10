import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: endpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiVerifyOtp<T>(data: { email: string; otp: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.verifyOtp,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword & { resetToken?: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}

export async function apiGetProfile<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.profile,
        method: 'get',
    })
}

export type ProfileUpdatePayload = {
    userName?: string
    avatar?: string
    firstName?: string
    lastName?: string
    dialCode?: string
    phoneNumber?: string
    country?: string
    address?: string
    postcode?: string
    city?: string
}

export async function apiUpdateProfile<T>(data: ProfileUpdatePayload) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.profile,
        method: 'put',
        data,
    })
}

export async function apiChangePassword<T>(data: {
    currentPassword: string
    newPassword: string
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.changePassword,
        method: 'put',
        data,
    })
}

export async function apiGoogleAuth<T>(idToken: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/auth/google',
        method: 'post',
        data: { idToken },
    })
}
