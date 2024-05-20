import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const deleteFollow = async (username: string): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.delete(
        `/users/${username}/followers`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return response.data
}

export const useDeleteFollow = (username: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => deleteFollow(username),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['user', username] })
            const previousUser = queryClient.getQueryData(['user', username])
            // Optimistically update to the new value
            if (previousUser) {
                queryClient.setQueryData(['user', username], {
                    ...previousUser,
                    isFollowing: false,
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
