import { axiosInstance } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

// Will return the user's uniquely generated username
export const createPost = async (
    loginRequest: CreateUserCommand
): Promise<string> => {
    const response = await axiosInstance.post(
        `/users`,
        JSON.stringify(loginRequest)
    )

    return response.data
}

export const useCreatePost = () => {
    // const { toast } = useToast()
    // const { user } = useAuth()
    // console.log('token for use sign up: ', token)
    return useMutation({
        mutationFn: (request: CreateUserCommand) => createPost(request),
        onSuccess: (data) => {},
        // onError: (error) => {
        //     console.log('use sign up error: ', error)
        // },
    })
}
