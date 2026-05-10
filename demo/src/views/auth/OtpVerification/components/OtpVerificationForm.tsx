import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import OtpInput from '@/components/shared/OtpInput'
import { apiVerifyOtp } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import type { CommonProps } from '@/@types/common'

interface OtpVerificationFormProps extends CommonProps {
    email: string
    setOtpVerified?: (message: string) => void
    setMessage?: (message: string) => void
}

type OtpFormSchema = {
    otp: string
}

const OTP_LENGTH = 6

const validationSchema = z.object({
    otp: z.string().length(OTP_LENGTH, { message: 'Please enter the complete 6-digit OTP' }),
})

const OtpVerificationForm = (props: OtpVerificationFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { className, email, setMessage, setOtpVerified } = props
    const navigate = useNavigate()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<OtpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onVerifyOtp = async (values: OtpFormSchema) => {
        setSubmitting(true)
        try {
            const resp = await apiVerifyOtp<{ status: string; data: { resetToken: string } }>({
                email,
                otp: values.otp,
            })

            const result = (resp as any)?.data ?? resp
            const resetToken = result?.data?.resetToken || result?.resetToken

            if (resetToken) {
                setOtpVerified?.('OTP verified! Redirecting...')
                // Navigate to reset-password, passing the resetToken via router state
                setTimeout(() => {
                    navigate('/reset-password', { state: { resetToken, email } })
                }, 800)
            } else {
                setMessage?.('OTP verified but no reset token received.')
            }
        } catch (err: any) {
            setMessage?.(
                err?.response?.data?.message || 'Invalid OTP. Please try again.',
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onVerifyOtp)}>
                <FormItem
                    invalid={Boolean(errors.otp)}
                    errorMessage={errors.otp?.message}
                >
                    <Controller
                        name="otp"
                        control={control}
                        render={({ field }) => (
                            <OtpInput
                                placeholder=""
                                inputClass="h-[58px]"
                                length={OTP_LENGTH}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                </Button>
            </Form>
        </div>
    )
}

export default OtpVerificationForm
