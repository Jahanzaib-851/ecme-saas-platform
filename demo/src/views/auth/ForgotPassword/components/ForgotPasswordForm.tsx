import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { apiForgotPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import type { CommonProps } from '@/@types/common'

interface ForgotPasswordFormProps extends CommonProps {
    emailSent: boolean
    setEmailSent?: (complete: boolean) => void
    setMessage?: (message: string) => void
}

type ForgotPasswordFormSchema = {
    email: string
}

const validationSchema = z.object({
    email: z.string().email('Please enter a valid email').min(5),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { className, setMessage, setEmailSent, emailSent, children } = props
    const navigate = useNavigate()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        const { email } = values
        setSubmitting(true)

        try {
            const resp = await apiForgotPassword<{ status: string; data: any }>({ email })
            const result = (resp as any)?.data ?? resp

            if (result?.status === 'success' || result?.sent || result) {
                setSubmitting(false)
                setEmailSent?.(true)
                // Navigate to OTP page, passing the email via router state
                navigate('/otp-verification', { state: { email } })
            }
        } catch (errors) {
            setMessage?.(
                typeof errors === 'string' ? errors : 'Failed to send OTP. Please try again.',
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)}>
                    <FormItem
                        label="Email Address"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    autoComplete="off"
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
                        {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ForgotPasswordForm
