import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={60}
                />
            </div>
            <div className="mb-10">
                <h2 className="mb-2">Welcome back!</h2>
                <p className="font-semibold heading-text">
                    Please enter your credentials to sign in!
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Forgot password
                        </ActionLink>
                    </div>
                }
            />

            <div className="mt-4">
                <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-600" />
                    <span className="text-sm text-gray-400">or continue with</span>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-600" />
                </div>
                <OauthSignIn setMessage={setMessage} disableSubmit={disableSubmit} />
            </div>

            <div>
                <div className="mt-6 text-center">
                    <span>{`Don't have an account yet?`} </span>
                    <ActionLink
                        to={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        Sign up
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
