import {
    UpdateUserCommand,
    UserBriefResponse,
    UserDetailedResponse,
} from './../types/index'
import { auth } from '@/firebase/firebase'
import { axiosInstance } from '@/lib/axios'
import {
    InfiniteData,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { userQueryKeys } from '../queries'
import { useAuth } from '@/features/auth/context/AuthContext'
import localStorage from '@/lib/storage'
import { UserResponse } from '@/features/auth/types'
import { postQueryKeys } from '@/features/post/queries'
import { PaginatedList } from '@/types'
import { PostBriefResponse } from '@/features/post/types'

export const updateUser = async (
    formData: FormData,
    username: string
): Promise<void> => {
    const token = await auth.currentUser?.getIdToken()
    const response = await axiosInstance.patch(`/users/${username}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

function createFormData(request: UpdateUserCommand): FormData {
    const formData = new FormData()
    if (request.avatar) formData.append('Avatar', request.avatar)
    if (request.backgroundImage)
        formData.append('BackgroundImage', request.backgroundImage)
    if (request.bio) formData.append('Bio', request.bio)
    if (request.displayName) formData.append('DisplayName', request.displayName)
    if (request.location) formData.append('Location', request.location)
    if (request.deleteBackgroundImage)
        formData.append('DeleteBackgroundImage', 'true')
    return formData
}

export const useUpdateUser = (username: string) => {
    const queryClient = useQueryClient()
    const { firebaseUser } = useAuth()
    return useMutation({
        mutationFn: (request: UpdateUserCommand) =>
            updateUser(createFormData(request), username),
        //
        onSuccess: async (data, request) => {
            await queryClient.invalidateQueries({
                queryKey: userQueryKeys.detail(username),
            })

            // User data from the refetch after invalidation (will hold new data after user update).
            const newOrExistingUserData =
                await queryClient.getQueryData<UserDetailedResponse>(
                    userQueryKeys.detail(username)
                )

            // if query fails, return
            if (!newOrExistingUserData) return
            // If user updates image or display name
            if (request.avatar || request.displayName) {
                // Update all user posts with new avatar and/or display name
                queryClient.setQueriesData(
                    {
                        queryKey: postQueryKeys.userLists(username),
                        exact: false,
                    },
                    (
                        oldData:
                            | InfiniteData<PaginatedList<PostBriefResponse>>
                            | undefined
                    ) => {
                        // If oldData is undefined, return undefined
                        if (!oldData) {
                            return undefined
                        }
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                items: page.items.map((post) => {
                                    return {
                                        ...post,
                                        author: {
                                            ...post.author,
                                            avatar: newOrExistingUserData.avatar,
                                            displayName:
                                                newOrExistingUserData.displayName,
                                        },
                                    }
                                }),
                            })),
                        }
                    }
                )

                // Update post detail queries with new avatar
                // Not most efficient way to do this, since we also invalidate posts not authored by current user,
                // but a post query detail item is complex because it includes parent posts
                await queryClient.invalidateQueries({
                    queryKey: postQueryKeys.details(),
                    exact: false,
                    refetchType: 'inactive', // by default invalidateQueries() only forces refetch for active queries
                })

                // Update top users list with new avatar if user is in the list
                const topUsers = queryClient.getQueryData<UserBriefResponse[]>(
                    userQueryKeys.topUsers()
                )
                if (!topUsers) return
                // Check if the user is in the top users list
                const userIndex = topUsers?.findIndex(
                    (user) => user.id === newOrExistingUserData.id
                )
                // If the user is in the list, update their avatar
                if (userIndex !== undefined && userIndex !== -1) {
                    // Update the user's avatar in the top users list
                    const updatedTopUsers = [...topUsers]
                    updatedTopUsers[userIndex] = {
                        ...updatedTopUsers[userIndex],
                        avatar: newOrExistingUserData.avatar,
                        displayName: newOrExistingUserData.displayName,
                    }
                    // Update the query data
                    queryClient.setQueryData(
                        userQueryKeys.topUsers(),
                        updatedTopUsers
                    )
                }
            }

            // Update current user data in localStorage and cache
            // destructure not required fields
            const {
                followersCount,
                followingsCount,
                backgroundImage,
                ...userResponse
            } = newOrExistingUserData
            localStorage.setUser({ ...userResponse })
            queryClient.setQueryData<UserResponse>(
                ['user', firebaseUser?.uid],
                { ...userResponse }
            )
        },
    })
}
