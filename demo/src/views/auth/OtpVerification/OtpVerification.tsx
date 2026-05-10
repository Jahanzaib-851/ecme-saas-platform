import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import OtpVerificationForm from './components/OtpVerificationForm'
import { apiForgotPassword } from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useLocation, useNavigate } from 'react-router'

export const OtpVerificationBase = () => {
    const [otpVerified, setOtpVerified] = useTimeOutMessage()
    const [otpResend, setOtpResend] = useTimeOutMessage()
    const [message, setMessage] = useTimeOutMessage()
    const [isResending, setIsResending] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const email: string = (location.state as any)?.email || ''

    if (!email) {
        navigate('/forgot-password')
        return null
    }

    const handleResendOtp = async () => {
        setIsResending(true)
        try {
            await apiForgotPassword<unknown>({ email })
            setOtpResend('A new OTP has been sent to your email.')
        } catch {
            setMessage('Failed to resend OTP. Please try again.')
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h3 className="mb-2">OTP Verification</h3>
                <p className="font-semibold heading-text">
                    Enter the 6-digit code sent to{' '}
                    <span className="text-primary">{email}</span>
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            {otpResend && (
                <Alert showIcon className="mb-4" type="info">
                    <span className="break-all">{otpResend}</span>
                </Alert>
            )}
            {otpVerified && (
                <Alert showIcon className="mb-4" type="success">
                    <span className="break-all">{otpVerified}</span>
                </Alert>
            )}
            <OtpVerificationForm
                email={email}
                setMessage={setMessage}
                setOtpVerified={setOtpVerified}
            />
            <div className="mt-4 text-center">
                <span className="font-semibold">Didn&apos;t receive OTP? </span>
                <button
                    disabled={isResending}
                    className="heading-text font-bold underline disabled:opacity-50"
                    onClick={handleResendOtp}
                >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
            </div>
        </div>
    )
}

const OtpVerification = () => {
    return <OtpVerificationBase />
}

export default OtpVerification
