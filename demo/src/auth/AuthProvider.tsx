import { useRef, useImperativeHandle, useState, useEffect } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import SocketService from '@/services/SocketService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => ({ navigate }), [navigate])
    return <></>
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)

    const { token, setToken } = useToken()
    // Explicitly string — cookiesStorage types getItem as string|Promise<string|null>
    // but we use localStorage strategy, so coerce safely at the boundary.
    const [tokenState, setTokenState] = useState<string>(
        typeof token === 'string' ? token : '',
    )
    const navigate = useNavigate()

    const authenticated = Boolean(tokenState && signedIn)
    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    // Reconnect socket on page reload when already authenticated
    useEffect(() => {
        if (authenticated && tokenState) {
            SocketService.connect(tokenState)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!authenticated) {
            const currentPath = window.location.pathname
            const publicPaths = ['/sign-in', '/sign-up', '/forgot-password', '/otp-verification', '/reset-password']
            if (!publicPaths.includes(currentPath)) {
                navigate('/sign-in')
            }
        }
    }, [authenticated, navigate])

    const redirect = () => {
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)
        const targetPath = redirectUrl ?? appConfig.authenticatedEntryPath

        setTimeout(() => {
            navigate(targetPath)
        }, 200)
    }

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)
        SocketService.connect(tokens.accessToken)

        if (user) {
            // Only set the authority that the backend actually assigned — no role injection
            setUser({
                ...user,
                authority: user.authority ?? [],
            })
        }
    }

    const handleSignOut = () => {
        SocketService.disconnect()
        setToken('')
        setTokenState('')
        setUser({})
        setSessionSignedIn(false)
    }

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const resp = await apiSignIn(values)
            const result = (resp as any)?.data ?? resp

            const accessToken = result?.token ?? result?.accessToken

            if (accessToken) {
                handleSignIn({ accessToken }, result.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'No token received from server.' }
        } catch (errors: any) {
            return {
                status: 'failed',
                message:
                    errors?.response?.data?.message ?? 'Invalid email or password.',
            }
        }
    }

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const resp = await apiSignUp(values)
            const result = (resp as any)?.data ?? resp

            const accessToken = result?.token ?? result?.accessToken

            if (accessToken) {
                handleSignIn({ accessToken }, result.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Account created but login failed.' }
        } catch (errors: any) {
            return {
                status: 'failed',
                message:
                    errors?.response?.data?.message ?? 'Error creating account.',
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigate('/sign-in')
        }
    }

    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({ onSignIn: handleSignIn, redirect })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
