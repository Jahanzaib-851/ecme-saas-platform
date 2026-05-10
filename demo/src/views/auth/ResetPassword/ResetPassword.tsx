import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './components/ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate, useLocation } from 'react-router'

type ResetPasswordProps = {
    signInUrl?: string
}

export const ResetPasswordBase = ({
    signInUrl = '/sign-in',
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const navigate = useNavigate()
    const location = useLocation()

    // Received from OTP verification via router state
    const resetToken: string | undefined = (location.state as any)?.resetToken

    const handleContinue = () => {
        navigate(signInUrl)
    }

    return (
        <div>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">Password Reset Complete</h3>
                        <p className="font-semibold heading-text">
                            Your password has been successfully updated. You can now sign in.
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Set New Password</h3>
                        <p className="font-semibold heading-text">
                            Your new password must be different from your previous one.
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ResetPasswordForm
                resetComplete={resetComplete}
                setMessage={setMessage}
                setResetComplete={setResetComplete}
                resetToken={resetToken}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={handleContinue}
                >
                    Go to Sign In
                </Button>
            </ResetPasswordForm>
            <div className="mt-4 text-center">
                <span>Back to </span>
                <ActionLink
                    to={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Sign in
                </ActionLink>
            </div>
        </div>
    )
}

const ResetPassword = () => {
    return <ResetPasswordBase />
}

export default ResetPassword
