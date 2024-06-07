import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserBriefResponse, UserDetailedResponse } from '../types'
import { userQueryKeys } from '../queries'
import { postQueryKeys } from '@/features/post/queries'

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

export const useFollow = (username: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (action: 'follow' | 'unfollow') =>
            action === 'follow'
                ? createFollow(username)
                : deleteFollow(username),
        onMutate: async (action) => {
            await queryClient.cancelQueries({
                queryKey: userQueryKeys.detail(username),
            })
            const previousUser = queryClient.getQueryData<UserDetailedResponse>(
                userQueryKeys.detail(username)
            )
            // Optimistically update to the new value
            if (previousUser) {
                queryClient.setQueryData(userQueryKeys.detail(username), {
                    ...previousUser,
                    isFollowing: action === 'follow',
                    followersCount:
                        previousUser.followersCount +
                        (action === 'follow' ? 1 : -1),
                })
            }

            //optimistically user in top users if they exist
            queryClient.setQueriesData(
                { queryKey: userQueryKeys.lists(), exact: false },
                (oldData: UserBriefResponse[] | undefined) => {
                    // If oldData is undefined, return undefined
                    if (!oldData) {
                        return undefined
                    }
                    return oldData.map((user) =>
                        user.username === username
                            ? {
                                  ...user,
                                  isFollowing: action === 'follow',
                              }
                            : user
                    )
                }
            )
            // Return a context with the previous user
            return { previousUser }
        },
        onError: (err, newUser, context) => {
            // If there was a previous user, set it back to the previous value
            if (context?.previousUser) {
                queryClient.setQueryData(
                    userQueryKeys.detail(username),
                    context.previousUser
                )
            }
        },
        onSuccess: () => {
            // Invalidate user's following feed when following/unfollowing
            queryClient.invalidateQueries({
                queryKey: postQueryKeys.followedUsersPosts(),
            })
        },
        // Always refetch after error or success:
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: userQueryKeys.detail(username),
            })
        },
    })
}
