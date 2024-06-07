import { axiosInstance } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { CreateUserCommand } from '../types'

// Will return the user's uniquely generated username
export const createUser = async (
    loginRequest: CreateUserCommand
): Promise<string> => {
    const response = await axiosInstance.post(
        `/users`,
        JSON.stringify(loginRequest)
    )

    return response.data
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: (request: CreateUserCommand) => createUser(request),
    })
}
