import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonWithLoading from '@/components/ButtonWithLoading'
import { emailSchema, passwordSchema } from '../validators'
import { doSignInWithEmailAndPassword } from '@/firebase/auth'
import { useCreateUser } from '../api/createUser'
import { useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { generateFirebaseAuthErrorMessage } from '@/firebase/errors'

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export function LoginForm() {
    const [isSigningIn, setIsSigningIn] = useState(false)
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const { mutate } = useCreateUser()

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsSigningIn(true)
        doSignInWithEmailAndPassword(values.email, values.password)
            .then((userCredential) => {
                // Call API to create user in backend if it doesn't exist.
                // api won't return error if user already exists, it just wont create it.
                mutate({ email: values.email, id: userCredential.user.uid })
            })
            .catch((error) => {
                if (error instanceof FirebaseError) {
                    const errorMessage = generateFirebaseAuthErrorMessage(error)
                    console.error('error', errorMessage)
                }
            })
            .finally(() => {
                setIsSigningIn(false)
            })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <ButtonWithLoading
                    className="rounded-full w-full"
                    type="submit"
                    isLoading={isSigningIn}
                >
                    Sign In
                </ButtonWithLoading>
            </form>
        </Form>
    )
}

export default LoginForm
