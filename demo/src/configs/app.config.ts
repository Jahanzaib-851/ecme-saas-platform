export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    locale: string
    accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies'
    enableMock: boolean
    activeNavTranslation: boolean
}

const appConfig: AppConfig = {
    // Dev: '/api' (Vite proxy) | Prod: set VITE_API_BASE_URL=https://ecme-saas-platform.onrender.com/api
    apiPrefix: (import.meta.env.VITE_API_BASE_URL as string) || '/api',

    // Dashboard ka asli path. 
    // AGAR REDIRECT NA HO, TOH ISAY '/home' KARKE DEKHEIN
    authenticatedEntryPath: '/dashboards/ecommerce',

    unAuthenticatedEntryPath: '/sign-in',
    locale: 'en',
    accessTokenPersistStrategy: 'sessionStorage',
    enableMock: false,
    activeNavTranslation: true,
}

export default appConfig