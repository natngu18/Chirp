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
import { doCreateUserWithEmailAndPassword } from '@/firebase/auth'
import { useState } from 'react'
import { useCreateUser } from '../api/createUser'
import { FirebaseError } from 'firebase/app'
import { generateFirebaseAuthErrorMessage } from '@/firebase/errors'

const signUpSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        passwordConfirmation: passwordSchema,
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ['passwordConfirmation'],
    })
type Props = {
    onSubmitAction?: () => void
}
export function SignUpForm({ onSubmitAction }: Props) {
    const [isSigningUp, setIsSigningUp] = useState(false)
    const { mutate } = useCreateUser()
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        setIsSigningUp(true)
        doCreateUserWithEmailAndPassword(values.email, values.password)
            .then((userCredential) => {
                // Call API to create user in backend if it doesn't exist.
                // api won't return error if user already exists, it just wont create it.
                mutate({ email: values.email, id: userCredential.user.uid })
            })
            // .then(() => {
            //     // Only call the action after the user is successfully created in API call
            //     // (No other errors occurred, useful if used in a modal and action is to close the modal)
            //     // so we can view the resulting errors without the modal closing
            //     if (onSubmitAction) {
            //         onSubmitAction()
            //     }
            // })
            .catch((error) => {
                if (error instanceof FirebaseError) {
                    const errorMessage = generateFirebaseAuthErrorMessage(error)
                }
                console.log('caught error: ', error.message)
            })
            .finally(() => {
                setIsSigningUp(false)
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

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                    isLoading={isSigningUp}
                >
                    Sign Up
                </ButtonWithLoading>
            </form>
        </Form>
    )
}

export default SignUpForm
