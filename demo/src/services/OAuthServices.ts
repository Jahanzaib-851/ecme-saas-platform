import { signInWithFirebaseGoogle } from './firebase/FirebaseGoogleAuth'
import { signInWithFirebaseGithub } from './firebase/FirebaseGithubAuth'
import { apiGoogleAuth } from './AuthService'

type BackendAuthResponse = {
    status: string
    token: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export async function apiGoogleOauthSignIn() {
    // Step 1: Firebase Google popup → get Firebase ID token
    const { token: firebaseIdToken } = await signInWithFirebaseGoogle()

    // Step 2: Exchange Firebase ID token for our app JWT
    const resp = await apiGoogleAuth<BackendAuthResponse>(firebaseIdToken)
    const result = (resp as any)?.data ?? resp

    return {
        token: result.token,
        user: result.user,
    }
}

export async function apiGithubOauthSignIn() {
    return await signInWithFirebaseGithub()
}
