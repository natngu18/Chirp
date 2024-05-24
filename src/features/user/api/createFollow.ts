import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserDetailedResponse } from '../types'

// Will return the user's uniquely generated username
export const createFollow = async (username: string): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.post(
        `/users/${username}/followers`,
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.data
}

export const useCreateFollow = (username: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => createFollow(username),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['user', username] })
            const previousUser = queryClient.getQueryData<UserDetailedResponse>(
                ['user', username]
            )
            // Optimistically update to the new value
            if (previousUser) {
                queryClient.setQueryData(['user', username], {
                    ...previousUser,

                    isFollowing: true,
                    followersCount: previousUser.followersCount + 1,
                })
            }

            // Return a context with the previous user
            return { previousUser }
        },
        onError: (err, newUser, context) => {
            // If there was a previous user, set it back to the previous value
            if (context?.previousUser) {
                queryClient.setQueryData(
                    ['user', username],
                    context.previousUser
                )
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user', username] })
        },
    })
}
