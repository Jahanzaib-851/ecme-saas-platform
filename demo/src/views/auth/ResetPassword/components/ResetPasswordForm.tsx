import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { apiResetPassword } from '@/services/AuthService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'

interface ResetPasswordFormProps extends CommonProps {
    resetComplete: boolean
    resetToken?: string
    setResetComplete?: (complete: boolean) => void
    setMessage?: (message: string) => void
}

type ResetPasswordFormSchema = {
    newPassword: string
    confirmPassword: string
}

const validationSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const { className, setMessage, setResetComplete, resetComplete, resetToken, children } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onResetPassword = async (values: ResetPasswordFormSchema) => {
        setSubmitting(true)
        try {
            const payload: { password: string; resetToken?: string } = {
                password: values.newPassword,
            }
            if (resetToken) payload.resetToken = resetToken

            await apiResetPassword<boolean>(payload)
            setResetComplete?.(true)
        } catch (err: any) {
            setMessage?.(
                err?.response?.data?.message || 'Failed to reset password. Please try again.',
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            {!resetComplete ? (
                <Form onSubmit={handleSubmit(onResetPassword)}>
                    <FormItem
                        label="New Password"
                        invalid={Boolean(errors.newPassword)}
                        errorMessage={errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    autoComplete="new-password"
                                    placeholder="••••••••••••"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Confirm Password"
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <PasswordInput
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
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
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ResetPasswordForm
