import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    userName: string
    email: string
    password: string
    confirmPassword: string
}

const validationSchema = z
    .object({
        userName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
            .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
            .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
        confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props
    const [isSubmitting, setSubmitting] = useState(false)
    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: { userName: '', email: '', password: '', confirmPassword: '' },
    })

    const onSignUp = async (values: SignUpFormSchema) => {
        if (disableSubmit) return
        setSubmitting(true)

        try {
            const result = await signUp({
                userName: values.userName,
                email: values.email,
                password: values.password,
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        } catch {
            setMessage?.('Something went wrong. Please check your connection.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label="Full Name"
                    invalid={Boolean(errors.userName)}
                    errorMessage={errors.userName?.message}
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="John Doe"
                                autoComplete="name"
                                aria-label="Full name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                aria-label="Email address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                autoComplete="new-password"
                                aria-label="Password"
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
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                aria-label="Confirm password"
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
                    aria-label="Create account"
                >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
